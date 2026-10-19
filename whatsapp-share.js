/* SaveTok – WhatsApp share add-on
 * Menambah: (1) Share langsung ke WhatsApp, (2) Share ke Status WhatsApp setelah download.
 * Tidak mengubah style.css / layout. Tombol memakai class yang sudah ada (.btn .sm).
 * Pasang di index.html SETELAH script.js:
 *   <script src="whatsapp-share.js"></script>
 */
(function () {
  'use strict';

  var res = document.getElementById('res');
  if (!res) return;

  var KEY = 'savetok_wa_auto';
  var SITE = location.href.split('#')[0];
  var MAX_BYTES = 100 * 1024 * 1024;

  var L = {
    id: {
      chat: 'WhatsApp', status: 'Status WA', auto: 'Auto ke Status setelah download',
      msg: 'Video TikTok tanpa watermark', via: 'via SaveTok',
      prep: 'Menyiapkan file untuk Status WhatsApp…',
      ready: 'File siap. Kirim ke Status WhatsApp? Pilih “Status Saya” di daftar WhatsApp.',
      send: 'Kirim', close: 'Nanti',
      fb: 'File tidak bisa dibagikan langsung dari browser ini. Kirim link-nya lewat WhatsApp?',
      fbBtn: 'Buka WhatsApp'
    },
    en: {
      chat: 'WhatsApp', status: 'WA Status', auto: 'Auto to Status after download',
      msg: 'TikTok video without watermark', via: 'via SaveTok',
      prep: 'Preparing file for WhatsApp Status…',
      ready: 'File ready. Send to WhatsApp Status? Pick “My Status” in the WhatsApp list.',
      send: 'Send', close: 'Later',
      fb: 'This browser can’t share the file directly. Send the link via WhatsApp instead?',
      fbBtn: 'Open WhatsApp'
    }
  };

  function T() {
    var sel = document.getElementById('lang');
    var l = ((sel && sel.value) || document.documentElement.lang || 'id').slice(0, 2).toLowerCase();
    return L[l] || L.en;
  }

  function auto() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function setAuto(v) {
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {}
  }

  /* ---------- helpers ---------- */
  function txt(a) {
    return ((a.textContent || '') + ' ' + (a.getAttribute('href') || '') + ' ' + (a.getAttribute('download') || '')).toLowerCase();
  }
  function kind(a) {
    var s = txt(a);
    if (/mp3|audio|music|musik/.test(s)) return 'audio';
    if (/cover|foto|photo|image|\.jpe?g|\.png|\.webp/.test(s)) return 'image';
    return 'video';
  }
  function isMedia(a) {
    var h = a.getAttribute('href') || '';
    if (!/^(https?:|blob:)/i.test(h)) return false;
    return a.hasAttribute('download') || /download|unduh|mp4|mp3|\bhd\b|video/.test(txt(a));
  }
  function shareText(url) {
    var t = T();
    return t.msg + '\n' + url + '\n' + t.via + ' ' + SITE;
  }
  function openWA(url) {
    window.open('https://wa.me/?text=' + encodeURIComponent(shareText(url)), '_blank', 'noopener');
  }

  /* ---------- prompt kecil (butuh tap = user gesture untuk Web Share) ---------- */
  function hide() {
    var p = document.getElementById('wa-prompt');
    if (p) p.remove();
  }
  function prompt(msg, btnLabel, onOk) {
    hide();
    var t = T();
    var p = document.createElement('div');
    p.id = 'wa-prompt';
    p.className = 'card';
    p.setAttribute('role', 'alertdialog');
    p.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));' +
      'max-width:420px;margin:0 auto;z-index:60;display:flex;flex-direction:column;gap:10px';
    var m = document.createElement('div');
    m.textContent = msg;
    p.appendChild(m);
    if (btnLabel) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:8px;justify-content:flex-end';
      var no = document.createElement('button');
      no.type = 'button'; no.className = 'btn sm'; no.textContent = t.close;
      no.onclick = hide;
      var ok = document.createElement('button');
      ok.type = 'button'; ok.className = 'btn sm pri'; ok.textContent = btnLabel;
      ok.onclick = function () { hide(); onOk(); };
      row.appendChild(no); row.appendChild(ok);
      p.appendChild(row);
    }
    document.body.appendChild(p);
  }

  /* ---------- Status WhatsApp ---------- */
  function fetchFile(url, name) {
    return fetch(url, { credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error('http');
      return r.blob();
    }).then(function (b) {
      if (!b.size || b.size > MAX_BYTES) return null;
      var type = b.type || '';
      if (!/^(video|audio|image)\//.test(type)) type = 'video/mp4';
      var ext = /^audio/.test(type) ? 'mp3' : /^image/.test(type) ? 'jpg' : 'mp4';
      var n = name && /\.\w{2,4}$/.test(name) ? name : 'savetok-' + Date.now() + '.' + ext;
      return new File([b], n, { type: type });
    });
  }
  function canFiles(f) {
    return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [f] }));
  }
  function doShare(file, url) {
    navigator.share({ files: [file], text: shareText(url) }).catch(function (e) {
      if (e && e.name === 'AbortError') return;
      fallback(url);
    });
  }
  function fallback(url) {
    var t = T();
    prompt(t.fb, t.fbBtn, function () { openWA(url); });
  }

  var busy = false;
  function statusFlow(url, name) {
    if (busy) return;
    busy = true;
    var t = T();
    prompt(t.prep);
    fetchFile(url, name).then(function (file) {
      if (!file || !canFiles(file)) return fallback(url);
      // Kalau gesture masih aktif, langsung buka share sheet; kalau tidak, minta 1 tap.
      if (navigator.userActivation && navigator.userActivation.isActive) {
        hide();
        return doShare(file, url);
      }
      prompt(t.ready, t.send, function () { doShare(file, url); });
    }).catch(function () {
      fallback(url);
    }).then(function () {
      busy = false;
    });
  }

  /* ---------- UI: bar kecil di bawah tombol download (pakai class .btn yang sudah ada) ---------- */
  function makeBar(a) {
    var t = T();
    var bar = document.createElement('div');
    bar.className = 'wa-bar';
    bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px';
    bar.dataset.href = a.href;
    bar.dataset.name = a.getAttribute('download') || '';

    var b1 = document.createElement('button');
    b1.type = 'button'; b1.className = 'btn sm'; b1.dataset.wa = 'chat'; b1.textContent = t.chat;
    var b2 = document.createElement('button');
    b2.type = 'button'; b2.className = 'btn sm'; b2.dataset.wa = 'status'; b2.textContent = t.status;

    var lab = document.createElement('label');
    lab.className = 'mut';
    lab.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:.85em';
    var cb = document.createElement('input');
    cb.type = 'checkbox'; cb.dataset.wa = 'auto'; cb.checked = auto();
    var sp = document.createElement('span');
    sp.textContent = t.auto;
    lab.appendChild(cb); lab.appendChild(sp);

    bar.appendChild(b1); bar.appendChild(b2); bar.appendChild(lab);
    return bar;
  }

  function enhance() {
    var links = res.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.closest('.wa-bar') || !isMedia(a) || kind(a) !== 'video') continue;
      var box = a.parentElement;
      if (!box) continue;
      if (box === res) {
        if (res.querySelector(':scope > .wa-bar')) continue;
        res.appendChild(makeBar(a));
      } else {
        var nx = box.nextElementSibling;
        if (nx && nx.classList.contains('wa-bar')) continue;
        box.insertAdjacentElement('afterend', makeBar(a));
      }
    }
  }

  /* ---------- events (delegasi, tahan re-render) ---------- */
  res.addEventListener('click', function (e) {
    var b = e.target.closest('[data-wa]');
    if (b) {
      var bar = b.closest('.wa-bar');
      if (!bar) return;
      if (b.dataset.wa === 'chat') openWA(bar.dataset.href);
      else if (b.dataset.wa === 'status') statusFlow(bar.dataset.href, bar.dataset.name);
      return;
    }
    var a = e.target.closest('a[href]');
    if (a && !a.closest('.wa-bar') && isMedia(a) && auto()) {
      statusFlow(a.href, a.getAttribute('download') || '');
    }
  }, true);

  res.addEventListener('change', function (e) {
    if (!e.target.matches || !e.target.matches('input[data-wa="auto"]')) return;
    setAuto(e.target.checked);
    var all = res.querySelectorAll('input[data-wa="auto"]');
    for (var i = 0; i < all.length; i++) all[i].checked = e.target.checked;
  });

  var queued = false;
  new MutationObserver(function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; enhance(); });
  }).observe(res, { childList: true, subtree: true });

  var lang = document.getElementById('lang');
  if (lang) {
    lang.addEventListener('change', function () {
      setTimeout(function () {
        var bars = res.querySelectorAll('.wa-bar');
        for (var i = 0; i < bars.length; i++) bars[i].remove();
        enhance();
      }, 50);
    });
  }

  enhance();

  /* Hook manual kalau tombol download di script.js bukan <a>:
   *   SaveTokWA.share(url)           -> share link ke WhatsApp
   *   SaveTokWA.status(url, nama)    -> flow Status WhatsApp
   *   SaveTokWA.afterDownload(url, nama) -> jalankan flow Status hanya jika toggle auto aktif
   */
  window.SaveTokWA = {
    share: openWA,
    status: function (url, name) { statusFlow(url, name || ''); },
    afterDownload: function (url, name) { if (auto()) statusFlow(url, name || ''); }
  };
})();
