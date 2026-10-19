'use strict';
/* SaveTok: tombol "Upload ke Status WhatsApp". Menempel otomatis ke kartu hasil video (#res).
   Pasang: tambahkan <script src="status-upload.js"></script> di bawah <script src="script.js"></script>. */
(() => {
  const T = {
    id: { b: 'Upload ke Status WA', a: 'Video siap, tekan sekali lagi', m: 'Video disimpan. Buka WhatsApp › Status › + lalu pilih videonya.', f: 'Video gagal diambil. Pakai tombol Tanpa Watermark, lalu upload dari galeri.', h: 'Di menu bagikan, pilih WhatsApp lalu “Status saya”.' },
    en: { b: 'Upload to WhatsApp Status', a: 'Video ready, tap once more', m: 'Video saved. Open WhatsApp › Status › + and pick it.', f: 'Couldn’t fetch the video. Use the No Watermark button, then upload it from your gallery.', h: 'In the share menu, pick WhatsApp, then “My status”.' },
    ja: { b: 'WhatsAppステータスに投稿', a: '準備完了、もう一度タップ', m: '動画を保存しました。WhatsApp › ステータス › + から選んでください。', f: '動画を取得できませんでした。「透かしなし」で保存し、ギャラリーから投稿してください。', h: '共有メニューでWhatsAppを選び、「マイステータス」を選んでください。' },
    ko: { b: 'WhatsApp 상태에 업로드', a: '영상 준비 완료, 한 번 더 탭하세요', m: '영상을 저장했습니다. WhatsApp › 상태 › + 에서 선택하세요.', f: '영상을 가져오지 못했습니다. 워터마크 없음으로 저장한 뒤 갤러리에서 올려주세요.', h: '공유 메뉴에서 WhatsApp을 고른 뒤 “내 상태”를 선택하세요.' },
    zh: { b: '上传到 WhatsApp 状态', a: '视频已就绪，请再点一次', m: '视频已保存。打开 WhatsApp › 状态 › +，选择该视频。', f: '无法获取视频。请先用“无水印”保存，再从相册上传。', h: '在分享菜单中选择 WhatsApp，然后选择“我的状态”。' },
    ru: { b: 'Загрузить в статус WhatsApp', a: 'Видео готово, нажмите ещё раз', m: 'Видео сохранено. Откройте WhatsApp › Статус › + и выберите его.', f: 'Не удалось получить видео. Сохраните кнопкой «Без водяного знака» и загрузите из галереи.', h: 'В меню «Поделиться» выберите WhatsApp, затем «Мой статус».' }
  };
  const res = document.getElementById('res');
  if (!res) return;
  const L = () => T[(document.documentElement.lang || 'id').slice(0, 2)] || T.id;

  document.head.append(Object.assign(document.createElement('style'), {
    textContent: '.btn.wa{background:#25d366;border-color:#25d366;color:#06291a}.ns-h{display:block;margin-top:10px;font-size:13px}'
  }));

  const toast = (m) => {
    const e = document.getElementById('toast'); if (!e) return;
    e.textContent = m; e.classList.add('on');
    clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 4000);
  };

  /* ambil video jadi File (satu saja disimpan) */
  let slot = { u: '', f: null, p: null };
  const load = (u) => {
    if (slot.u === u && slot.p) return slot.p;
    const m = { u, f: null, p: null }; slot = m;
    m.p = fetch(u).then((r) => { if (!r.ok) throw 0; return r.blob(); })
      .then((b) => (m.f = new File([b], 'savetok_status.mp4', { type: 'video/mp4' })));
    m.p.catch(() => { if (slot === m) slot = { u: '', f: null, p: null }; });
    return m.p;
  };

  const can = (f) => {
    try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [f] })); }
    catch (e) { return false; }
  };
  const save = (f) => {
    const a = document.createElement('a'), u = URL.createObjectURL(f);
    a.href = u; a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 4000);
  };

  /* buka menu Bagikan HP: pilih WhatsApp › Status saya */
  const send = (f, cap, b) => {
    b.textContent = L().b;
    if (!can(f)) { save(f); toast(L().m); return; } // desktop / browser tanpa share file: simpan biasa
    const x = { files: [f] }; if (cap) x.text = cap;
    let p; try { p = navigator.share(x); } catch (e) { p = Promise.reject(e); }
    p.catch((e) => {
      const n = e && e.name;
      if (n === 'AbortError') return;                                  // menu bagikan ditutup
      if (n === 'NotAllowedError') { b.textContent = L().a; toast(L().a); return; } // izin klik habis: tap sekali lagi
      save(f); toast(L().m);
    });
  };

  const inject = (card) => {
    if (card.querySelector('.ns-st')) return;
    const v = card.querySelector('video[src]'), acts = card.querySelector('.acts');
    if (!v || !acts) return;
    const u = v.getAttribute('src'), cap = (card.querySelector('.meta p') || {}).textContent || '';
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn wa ns-st'; b.textContent = L().b;
    b.onclick = () => {
      if (slot.u === u && slot.f) { send(slot.f, cap, b); return; } // file sudah siap: share langsung di dalam klik
      b.disabled = true; b.textContent = '…';
      load(u).then(
        (f) => { b.disabled = false; send(f, cap, b); },
        () => { b.disabled = false; b.textContent = L().b; toast(L().f); }
      );
    };
    acts.insertBefore(b, acts.children[1] || null);
    const h = document.createElement('small');
    h.className = 'ns-h'; h.textContent = L().h; acts.after(h);
  };

  const scan = () => res.querySelectorAll('article.card:not(.sm)').forEach(inject);
  new MutationObserver(scan).observe(res, { childList: true, subtree: true });
  new MutationObserver(() => {
    document.querySelectorAll('.ns-st').forEach((b) => { if (!b.disabled) b.textContent = L().b; });
    document.querySelectorAll('.ns-h').forEach((h) => { h.textContent = L().h; });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  scan();
})();
