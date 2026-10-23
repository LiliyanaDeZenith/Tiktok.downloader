/*!
 * LuxAPI - deteksi caption, komentar, link, dan data TikTok untuk fitur Luxe (preset Alight Motion).
 * Satu file, tanpa library. Memakai API tikwm, atau fungsi tw() milik aplikasimu.
 *
 * Muat file ini SEBELUM script Luxe, lalu:
 *   LuxAPI.bind(tw)                                  opsional: pakai fungsi tw(path, params, post) yang sudah ada
 *   await LuxAPI.video(urlAtauId)                    data TikTok lengkap (caption, statistik, musik, penulis)
 *   await LuxAPI.comments(urlAtauId, { max: 100 })   komentar, ganti halaman otomatis
 *   LuxAPI.extractLinks(teks)                        link + jenis + tingkat keyakinan (0 sampai 1)
 *   LuxAPI.parseCaption(teks)                        hashtag, mention, link, dan petunjuk "link di bio/komentar"
 *   await LuxAPI.inspect(urlAtauId)                  caption + komentar + semua link, digabung dan diurutkan
 *   await LuxAPI.enrich(st.list, { alive, onItem })  tambahkan link dari komentar ke daftar video (field pre)
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LuxAPI = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
  'use strict';

  var CFG = {
    api: 'https://www.tikwm.com/api/',
    tw: null,
    timeoutMs: 12000,
    gapMs: 1100,                       // jeda antar panggilan (batas gratis tikwm: 1 request/detik)
    retryMs: 1300,
    proxy: function (u) { return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); }
  };

  /* ---------- util ---------- */

  function num(v) { v = Number(v); return isFinite(v) && v > 0 ? v : 0; }
  function str(v) { return v == null ? '' : String(v); }
  function iso(t) { t = Number(t); if (!t) return ''; try { return new Date(t < 1e12 ? t * 1000 : t).toISOString(); } catch (e) { return ''; } }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function msgOf(e) { return str(e && (e.message || e.msg) || e); }
  function count(s, ch) { return s.split(ch).length - 1; }
  function safeUrl(u) {
    if (!u) return '';
    try { var x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href.replace(/^http:/, 'https:') : ''; } catch (e) { return ''; }
  }

  /* ---------- baca input TikTok ---------- */

  function parseInput(raw) {
    var s = str(raw).trim(), m;
    if (/^\d{15,20}$/.test(s)) return { type: 'video', id: s, user: '', url: '' };
    var u = s.match(/https?:\/\/\S+/i);
    if (u) s = u[0].replace(/[.,;:!?)\]}'"]+$/, '');
    if (/^@[A-Za-z0-9._]{2,24}$/.test(s)) return { type: 'user', user: s.slice(1), url: 'https://www.tiktok.com/' + s };
    if (!/tiktok\.com/i.test(s)) return null;
    if ((m = s.match(/tiktok\.com\/@([A-Za-z0-9._]{2,24})\/(?:video|photo)\/(\d{15,20})/i))) return { type: 'video', id: m[2], user: m[1], url: 'https://www.tiktok.com/@' + m[1] + '/video/' + m[2] };
    if ((m = s.match(/tiktok\.com\/(?:video|v)\/(\d{15,20})/i))) return { type: 'video', id: m[1], user: '', url: '' };
    if ((m = s.match(/tiktok\.com\/music\/[^\s?#]*?-?(\d{15,20})/i))) return { type: 'music', id: m[1], url: s };
    if ((m = s.match(/tiktok\.com\/tag\/([^\s/?#]+)/i))) return { type: 'tag', tag: decodeURIComponent(m[1]), url: s };
    if (/^https?:\/\/(vm|vt)\.tiktok\.com\/|tiktok\.com\/t\//i.test(s)) return { type: 'short', url: s };
    if ((m = s.match(/tiktok\.com\/@([A-Za-z0-9._]{2,24})\/?(?:[?#]|$)/i))) return { type: 'user', user: m[1], url: 'https://www.tiktok.com/@' + m[1] };
    return null;
  }

  /* ---------- pembersihan teks ---------- */

  var ZW = /[\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;
  function clean(t) {
    var s = str(t);
    try { s = s.normalize('NFKC'); } catch (e) {}              // huruf lebar penuh -> biasa, titik ellipsis -> "..."
    return s.replace(ZW, '')                                    // karakter tak terlihat penyamar link
      .replace(/([A-Za-z0-9])[\u3002\uFF61\u2024]([A-Za-z0-9])/g, '$1.$2')
      .replace(/\bhxxp(s?):\/\//gi, 'http$1://')
      .replace(/\s*[\[({]\s*(?:\.|dot)\s*[\])}]\s*/gi, '.');   // alight[.]link  alight(dot)link
  }

  /* ---------- link: temukan, rapikan, jenis, keyakinan ---------- */

  var UC = "[A-Za-z0-9\\-._~:/?#\\[\\]@!$&'()*+,;=%]";
  var TLD = 'com|net|org|id|co|io|me|link|app|ly|gl|to|cc|xyz|site|page|dev|tv|fm|gg|sh|ws|info|biz|top|online|store|click|one|pw|in|us|uk|sg|my|ph|jp|kr|cn|ru|de|fr|es|it|nl|br|bio|at|is|ai|so|su|la|vc|ee|nu|run|be|nz';
  var RE_SCHEME = new RegExp('https?://' + UC + '+', 'gi');
  var RE_BARE = new RegExp('(^|[^A-Za-z0-9@._%+/:-])((?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+(?:' + TLD + ')(?::\\d{2,5})?/' + UC + '{2,})', 'gi');
  var DROP = /^(utm_[a-z_]+|fbclid|gclid|igshid|igsh|si|ref_src|usp|feature)$/i;
  var KINDS = [
    ['app-store', 0, ['play.google.com', 'apps.apple.com', 'itunes.apple.com', 'appgallery.huawei.com']],
    ['tiktok', 0.05, ['tiktok.com', 'tiktokv.com']],
    ['file', 0.5, ['mediafire.com', 'dropbox.com', 'mega.nz', 'gofile.io', '4shared.com', 'sendspace.com', 'files.fm', 'wetransfer.com', 'we.tl', 'sfile.mobi', 'pixeldrain.com', 'krakenfiles.com', 'uploadhaven.com', 'send.cm']],
    ['drive', 0.5, ['drive.google.com', 'docs.google.com', 'onedrive.live.com', '1drv.ms']],
    ['paste', 0.5, ['pastebin.com', 'paste.ee', 'rentry.co', 'hastebin.com', 'justpaste.it', 'controlc.com', 'dpaste.org']],
    ['telegram', 0.4, ['t.me', 'telegram.me', 'telegram.dog']],
    ['code', 0.4, ['github.com', 'raw.githubusercontent.com', 'gist.github.com', 'gitlab.com']],
    ['linkhub', 0.35, ['linktr.ee', 'lynk.id', 'bio.link', 'beacons.ai', 'taplink.cc', 'campsite.bio', 'linkin.bio', 'msha.ke', 'lnk.bio', 'carrd.co', 'bento.me']],
    ['shortener', 0.35, ['bit.ly', 'tinyurl.com', 's.id', 'cutt.ly', 'rebrand.ly', 'shorturl.at', 'is.gd', 't.ly', 'ow.ly', 'rb.gy', 'tiny.cc', 'v.gd', 'link.id', 'goo.gl', 'shrinkme.io', 'ouo.io', 'adf.ly']],
    ['donasi', 0.2, ['trakteer.id', 'saweria.co', 'sociabuzz.com', 'ko-fi.com', 'patreon.com', 'karyakarsa.com', 'buymeacoffee.com']],
    ['social', 0.05, ['instagram.com', 'facebook.com', 'fb.com', 'fb.me', 'twitter.com', 'x.com', 'youtube.com', 'youtu.be', 'snapchat.com', 'threads.net', 'pinterest.com', 'reddit.com', 'discord.gg', 'discord.com', 'wa.me', 'whatsapp.com', 'twitch.tv', 'linkedin.com']]
  ];
  var NOT_PRESET = { 'app-store': 1, tiktok: 1, social: 1, donasi: 1, 'alight-info': 1 };
  var STRONG = /(preset|xml|alight\s*motion|alightmotion|\balight\b|\.alp\b|\.amv\b)/;
  var WEAK = /\b(link|tautan|download|unduh|dl|template|project|proyek|gratis|free|file)\b/;

  function kindOf(host, u) {
    if (host === 'alight.link' || /(^|\.)alight[a-z-]*\.app\.link$/.test(host)) return ['alight', 0.95];
    if (/(^|\.)(alightmotion|alightcreative)\.com$/.test(host)) {
      return /^\/(am|shared|share|e|p|preset|elements?)(\/|$)/i.test(u.pathname) ? ['alight', 0.8] : ['alight-info', 0.2];
    }
    for (var i = 0; i < KINDS.length; i++) {
      for (var j = 0; j < KINDS[i][2].length; j++) {
        var d = KINDS[i][2][j];
        if (host === d || host.slice(-d.length - 1) === '.' + d) return [KINDS[i][0], KINDS[i][1]];
      }
    }
    return ['other', 0.2];
  }

  function canon(u) {
    var host = u.hostname.toLowerCase().replace(/^www\./, '');
    u.hash = '';
    if (/(^|\.)tiktok\.com$/.test(host)) u.search = '';
    else {
      var keep = [];
      u.searchParams.forEach(function (v, k) { if (!DROP.test(k)) keep.push([k, v]); });
      keep.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
      u.search = '';
      keep.forEach(function (kv) { u.searchParams.append(kv[0], kv[1]); });
    }
    var path = u.pathname.length > 1 ? u.pathname.replace(/\/+$/, '') : u.pathname;   // huruf besar/kecil kode link dipertahankan
    return { host: host, url: 'https://' + u.host + path + u.search, key: host + path + u.search };
  }

  function trimTail(s) {                                         // buang tanda baca di ujung kalimat, bukan bagian link
    var trunc = false, c;
    for (;;) {
      c = s.charAt(s.length - 1);
      if (!c) break;
      if (/[.,;:!?'"*_~]/.test(c)) { if (c === '.' && s.charAt(s.length - 2) === '.') trunc = true; s = s.slice(0, -1); continue; }
      if (c === ')' && count(s, ')') > count(s, '(')) { s = s.slice(0, -1); continue; }
      if (c === ']' && count(s, ']') > count(s, '[')) { s = s.slice(0, -1); continue; }
      break;
    }
    return { s: s, trunc: trunc };
  }

  function split(s, base, out) {                                 // link yang tertempel tanpa spasi: dipecah di tiap "http"
    var re = /https?:\/\//gi, idx = [], m;
    while ((m = re.exec(s))) idx.push(m.index);
    if (!idx.length || idx[0] !== 0) idx.unshift(0);
    for (var i = 0; i < idx.length; i++) out.push({ raw: s.slice(idx[i], i + 1 < idx.length ? idx[i + 1] : s.length), at: base + idx[i] });
  }

  function extractLinks(text, o) {
    o = o || {};
    var orig = str(text), t = clean(orig), found = [], m;
    var masked = t.replace(RE_SCHEME, function (s, i) { split(s, i, found); return new Array(s.length + 1).join(' '); });
    RE_BARE.lastIndex = 0;
    while ((m = RE_BARE.exec(masked))) split(m[2], m.index + m[1].length, found);
    var map = {}, out = [];
    found.sort(function (a, b) { return a.at - b.at; }).forEach(function (c) {
      var tr = trimTail(c.raw), u;
      if (!tr.s) return;
      try { u = new URL(/^https?:\/\//i.test(tr.s) ? tr.s : 'https://' + tr.s); } catch (e) { return; }
      if (!/\.[a-z0-9-]{2,}$/i.test(u.hostname) || u.hostname.length > 120) return;
      var k = canon(u), kd = kindOf(k.host, u), ext = /\.(xml|alp|amv)$/i.test(u.pathname) ? 0.3 : /\.(zip|rar|7z)$/i.test(u.pathname) ? 0.1 : 0;
      var before = t.slice(Math.max(0, c.at - 120), c.at).toLowerCase(), after = t.slice(c.at + c.raw.length, c.at + c.raw.length + 120).toLowerCase();
      var ctx = before + ' ' + after, s = kd[1];
      if (!NOT_PRESET[kd[0]]) {
        s += STRONG.test(ctx) ? 0.25 : WEAK.test(ctx) ? 0.08 : 0;
        s += ext + (STRONG.test(u.pathname) ? 0.1 : 0) + (o.author ? 0.08 : 0) + (o.pinned ? 0.07 : 0);
      }
      s = Math.min(1, s);
      if (tr.trunc) s -= 0.25;                                   // diakhiri "..." = kemungkinan terpotong
      s = Math.max(0, Math.round(s * 100) / 100);
      var prev = map[k.key];
      if (prev) { prev.count++; if (s > prev.confidence) { prev.confidence = s; prev.level = level(s); prev.preset = isPreset(kd[0], s, o); } return; }
      var link = { url: k.url, key: k.key, host: k.host, kind: kd[0], confidence: s, level: level(s), preset: isPreset(kd[0], s, o), truncated: tr.trunc, normalized: orig.indexOf(c.raw) < 0, at: c.at, count: 1, context: (before.slice(-60) + ' ' + after.slice(0, 60)).replace(/\s+/g, ' ').trim() };
      map[k.key] = link; out.push(link);
    });
    return out.sort(function (a, b) { return b.confidence - a.confidence || a.at - b.at; });
  }
  function level(s) { return s >= 0.8 ? 'tinggi' : s >= 0.5 ? 'sedang' : 'rendah'; }
  function isPreset(kind, s, o) { return !NOT_PRESET[kind] && s >= (o && o.min != null ? o.min : 0.5); }

  /* ---------- caption ---------- */

  function hints(text) {
    var s = clean(text).toLowerCase();
    return {
      bio: /(link|xml|preset|dl|download|unduh)[^.\n]{0,30}\b(di|in|on|ada di)\s*(bio|profil|profile)\b|\blink\s?in\s?bio\b|\blinkbio\b/.test(s),
      comment: /(link|xml|preset|dl|download|unduh)[^.\n]{0,30}\b(di|in|on|ada di)\s*(komen|komentar|comments?|kolom komentar)\b|\b(cek|check|see|lihat)\s+(komen|komentar|comments?)\b|\bpinned\b|\bdisematkan\b/.test(s),
      dm: /\b(dm|chat|wa|whatsapp|telegram|tele)\b.{0,20}\b(link|xml|preset|minta)\b|\b(link|xml|preset)\b.{0,20}\b(dm|chat|wa|pm)\b/.test(s),
      preset: /\b(preset|xml|alight)\b/.test(s)
    };
  }

  function parseCaption(text) {
    var t = clean(text), tags = [], men = [], m;
    var reTag = /(^|[^\p{L}\p{N}_&#])#([\p{L}\p{N}_]{1,60})/gu, reMen = /(^|[^\p{L}\p{N}_.@])@([A-Za-z0-9._]{2,24})/gu;
    while ((m = reTag.exec(t))) { var h = m[2].toLowerCase(); if (tags.indexOf(h) < 0) tags.push(h); }
    while ((m = reMen.exec(t))) { var n = m[2].replace(/\.+$/, ''); if (n.length > 1 && men.indexOf(n) < 0) men.push(n); }
    return { text: str(text), hashtags: tags, mentions: men, links: extractLinks(text), hints: hints(text) };
  }

  /* ---------- panggilan API ---------- */

  var lastAt = 0;
  function unwrap(j) {
    if (j && typeof j === 'object' && !Array.isArray(j) && 'code' in j) { if (j.code === 0) return j.data; throw new Error(str(j.msg) || 'api'); }
    return j;
  }
  async function direct(path, params) {
    var url = CFG.api + path + '?' + Object.keys(params).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    async function get(u) {
      var c = typeof AbortController === 'function' ? new AbortController() : null, tm = c && setTimeout(function () { c.abort(); }, CFG.timeoutMs);
      try { var r = await fetch(u, c ? { signal: c.signal } : undefined); if (!r.ok) throw new Error('http' + r.status); return await r.json(); }
      finally { clearTimeout(tm); }
    }
    try { var j = await get(url); if (j && j.code !== 0 && /limit/i.test(str(j.msg))) return j; return j; }
    catch (e) { return get(CFG.proxy(url)); }                    // diblokir CORS/jaringan -> lewat proxy cadangan
  }
  async function call(path, params) {
    var last;
    for (var n = 0; n < 3; n++) {
      var wait = CFG.gapMs - (Date.now() - lastAt);
      if (wait > 0) await sleep(wait);
      lastAt = Date.now();
      try { return unwrap(CFG.tw ? await CFG.tw(path, params) : await direct(path, params)); }
      catch (e) { last = e; if (!/limit|1 request|too many|429/i.test(msgOf(e))) throw e; await sleep(CFG.retryMs); }
    }
    throw last;
  }

  /* ---------- data video ---------- */

  function normVideo(d) {
    d = d || {};
    var a = d.author || {}, m = d.music_info || {}, id = str(d.id || d.video_id || d.aweme_id), user = str(a.unique_id || a.uniqueId || a.username);
    return {
      id: id,
      url: user && id ? 'https://www.tiktok.com/@' + user + '/video/' + id : '',
      caption: str(d.title || d.desc || d.caption),
      createdAt: iso(d.create_time || d.createTime),
      region: str(d.region),
      duration: num(d.duration),
      cover: safeUrl(d.cover || d.origin_cover),
      play: safeUrl(d.play), hdplay: safeUrl(d.hdplay), wmplay: safeUrl(d.wmplay),
      size: num(d.size || d.hd_size),
      images: (Array.isArray(d.images) ? d.images : []).map(safeUrl).filter(Boolean),
      author: { id: str(a.id), username: user, nickname: str(a.nickname), avatar: safeUrl(a.avatar) },
      stats: { plays: num(d.play_count), likes: num(d.digg_count), comments: num(d.comment_count), shares: num(d.share_count), saves: num(d.collect_count), downloads: num(d.download_count) },
      music: { id: str(m.id || d.music_id), title: str(m.title), author: str(m.author), url: safeUrl(d.music || m.play), cover: safeUrl(m.cover), original: !!m.original, duration: num(m.duration) }
    };
  }
  async function video(ref) {
    var d = await call('', { url: ref, hd: 1 });
    var v = normVideo(d);
    if (!v.id) throw new Error('video tidak ditemukan');
    return v;
  }

  /* ---------- komentar ---------- */

  function normComment(c, authorName, authorId, parent) {
    c = c || {};
    var u = c.user || c.author || {}, name = str(u.unique_id || u.uniqueId || u.username), uid = str(u.id || u.uid || c.user_id);
    var text = str(c.text != null ? c.text : (c.content != null ? c.content : c.comment));
    var id = str(c.cid || c.id || c.comment_id) || ('h' + name + ':' + text.length + ':' + text.slice(0, 24));
    return {
      id: id, parent: parent || '', reply: !!parent, text: text,
      user: { username: name, nickname: str(u.nickname), id: uid },
      likes: num(c.digg_count != null ? c.digg_count : (c.like_count != null ? c.like_count : c.likes)),
      replies: num(c.reply_total != null ? c.reply_total : (c.reply_comment_total != null ? c.reply_comment_total : c.reply_count)),
      createdAt: iso(c.create_time || c.createTime),
      isAuthor: !!(c.is_author || (authorName && name && name.toLowerCase() === authorName.toLowerCase()) || (authorId && uid && uid === authorId)),
      pinned: !!(c.author_pin || c.is_pinned || c.pinned)
    };
  }

  async function comments(ref, o) {
    o = Object.assign({ max: 100, page: 50, replies: false, author: null, alive: null }, o || {});
    var aName = str(o.author && (o.author.username || o.author.unique_id || o.author)), aId = str(o.author && o.author.id);
    var cursor = 0, out = [], seen = {}, hasMore = true, total = 0, guard = 0;
    while (out.length < o.max && hasMore && guard++ < 30) {
      if (o.alive && !o.alive()) break;
      var d = await call('comment/list', { url: ref, count: Math.min(o.page, o.max - out.length), cursor: cursor });
      var list = Array.isArray(d) ? d : ((d && (d.comments || d.comment_list)) || []), added = 0;
      total = num(d && d.total) || total;
      list.forEach(function (c) {
        var n = normComment(c, aName, aId);
        if (seen[n.id]) return;
        seen[n.id] = 1; out.push(n); added++;
      });
      var next = d && d.cursor != null ? Number(d.cursor) : cursor + list.length;
      hasMore = !!(d && (d.hasMore != null ? d.hasMore : d.has_more)) && added > 0 && isFinite(next) && next !== cursor;   // cegah putaran tanpa akhir
      cursor = next;
    }
    out = out.slice(0, o.max);
    if (o.replies) {                                             // balasan komentar (opsional): link dari penulis sering ada di sini
      var cand = out.filter(function (c) { return c.replies > 0 && (c.isAuthor || c.pinned || hints(c.text).comment || c.likes >= 5); }).slice(0, 8);
      for (var i = 0; i < cand.length; i++) {
        if (o.alive && !o.alive()) break;
        try {
          var r = await call('comment/reply', { url: ref, comment_id: cand[i].id, count: 20, cursor: 0 });
          (Array.isArray(r) ? r : ((r && (r.comments || r.comment_list)) || [])).forEach(function (c) {
            var n = normComment(c, aName, aId, cand[i].id);
            if (!seen[n.id]) { seen[n.id] = 1; out.push(n); }
          });
        } catch (e) { /* balasan gagal dimuat: lewati, komentar utama tetap dipakai */ }
      }
    }
    return { list: out, total: total, hasMore: hasMore, cursor: cursor };
  }

  /* ---------- gabungan: caption + komentar ---------- */

  async function inspect(ref, o) {
    o = Object.assign({ comments: 'smart', max: 100, replies: false, min: 0.5, alive: null, video: null }, o || {});
    var v = o.video || await video(ref), cap = parseCaption(v.caption), map = {}, all = [];
    function add(l, src) {
      var p = map[l.key];
      if (!p) { p = map[l.key] = Object.assign({}, l, { sources: [] }); all.push(p); }
      else { p.count += l.count; if (l.confidence > p.confidence) { p.confidence = l.confidence; p.level = l.level; p.preset = l.preset; } }
      p.sources.push(src);
    }
    var minOpt = { min: o.min };
    extractLinks(v.caption, minOpt).forEach(function (l) { add(l, { where: 'caption' }); });
    var need = o.comments === 'all' || (o.comments === 'smart' && (cap.hints.comment || !all.some(function (l) { return l.preset; })));
    var cm = { fetched: false, count: 0, total: 0, hasMore: false };
    if (need && o.comments !== 'none') {
      var r = await comments(v.id || ref, { max: o.max, replies: o.replies, author: v.author, alive: o.alive });
      cm = { fetched: true, count: r.list.length, total: r.total, hasMore: r.hasMore };
      r.list.forEach(function (c) {
        extractLinks(c.text, { author: c.isAuthor, pinned: c.pinned, min: o.min }).forEach(function (l) {
          add(l, { where: c.reply ? 'reply' : 'comment', id: c.id, user: c.user.username, likes: c.likes, author: c.isAuthor, pinned: c.pinned, at: c.createdAt });
        });
      });
    }
    all.sort(function (a, b) { return b.confidence - a.confidence; });
    return { video: v, caption: cap, comments: cm, links: all, presets: all.filter(function (l) { return l.preset; }), hints: cap.hints };
  }

  /* ---------- sambungan ke daftar video Luxe ---------- */

  function idOf(v) {
    var m = str(v.url || v.href || v.link).match(/\/(?:video|photo)\/(\d{8,})/);
    return str(v.id || v.vid || v.video_id || v.aweme_id || (m && m[1]));
  }
  function textOf(v) { return str(v.caption || v.title || v.desc || v.text); }
  function authorOf(v) { var a = v.author; return str(typeof a === 'string' ? a : (a && (a.unique_id || a.username)) || v.username || v.user || v.au); }
  function toPre(l) {                                            // format longgar: beberapa nama field umum sekaligus
    var from = l.sources.map(function (s) { return s.where; }).filter(function (w, i, a) { return a.indexOf(w) === i; });
    return { u: l.url, url: l.url, href: l.url, link: l.url, k: from[0] || 'comment', kind: l.kind, conf: l.confidence, level: l.level, from: from.join(','), n: l.count, user: (l.sources[0] || {}).user || '' };
  }
  function keyOf(u) { try { return canon(new URL(u)).key; } catch (e) { return str(u); } }
  function mergePre(v, links, conv) {
    v.pre = Array.isArray(v.pre) ? v.pre : [];
    var have = {};
    v.pre.forEach(function (p) { var u = p && (typeof p === 'string' ? p : (p.u || p.url || p.href || p.link)); if (u) have[keyOf(u)] = 1; });
    links.forEach(function (l) { if (!have[l.key]) { have[l.key] = 1; v.pre.push(conv(l)); } });
  }

  async function enrich(list, o) {
    o = Object.assign({ limit: 12, max: 60, mode: 'smart', min: 0.5, replies: false, captionToo: false, alive: null, onItem: null, onDone: null, toPre: toPre }, o || {});
    var done = 0;
    for (var i = 0; i < list.length && i < o.limit; i++) {
      if (o.alive && !o.alive()) return list;
      var v = list[i], id = idOf(v);
      if (!id) continue;
      try {
        var r = await inspect(id, { video: { id: id, caption: textOf(v), author: { username: authorOf(v) } }, comments: o.mode, max: o.max, min: o.min, replies: o.replies, alive: o.alive });
        if (o.alive && !o.alive()) return list;
        v.lux = r;
        mergePre(v, r.presets.filter(function (l) { return o.captionToo || l.sources.some(function (s) { return s.where !== 'caption'; }); }), o.toPre);
        done++;
        if (o.onItem) o.onItem(v, r);
      } catch (e) { v.luxError = msgOf(e); }
    }
    if (o.onDone) o.onDone(list, done);
    return list;
  }

  return {
    version: 1,
    configure: function (c) { Object.assign(CFG, c || {}); return CFG; },
    bind: function (tw) { CFG.tw = typeof tw === 'function' ? tw : null; },
    parseInput: parseInput, clean: clean, hints: hints, parseCaption: parseCaption, extractLinks: extractLinks,
    video: video, comments: comments, inspect: inspect, enrich: enrich, normVideo: normVideo, toPre: toPre
  };
});
