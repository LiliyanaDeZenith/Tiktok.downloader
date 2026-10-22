'use strict';
/* SaveTok. Data video dari API publik tikwm.com (tanpa API key). Ganti endpoint di sini kalau perlu. */
const API='https://www.tikwm.com/api/';
const PX=['','https://corsproxy.io/?url=','https://api.allorigins.win/raw?url=']; // cadangan kalau CORS diblokir
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const mem={};
const S={g(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return k in mem?mem[k]:d}},s(k,v){mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

const D={
id:{h1:'Download Video TikTok Tanpa Watermark',sub:'Tempel link, pilih format, langsung simpan. Gratis, tanpa batas.',ph:'Tempel link TikTok di sini…',phb:'Satu link per baris (maks. 20)',paste:'Tempel',go:'Download',one:'Satu link',bat:'Batch',login:'Masuk',logout:'Keluar',reg:'Daftar',user:'Username',pass:'Password (min. 6)',hist:'Riwayat Download',empty:'Belum ada riwayat.',clear:'Hapus semua',nowm:'Tanpa Watermark',wm:'Dengan Watermark',hd:'HD (kualitas tertinggi)',mp3:'Audio MP3',cover:'Cover / Thumbnail',imgs:'Simpan semua foto',all:'Download semua',how:'Cara Pakai',faq:'FAQ & Troubleshooting',about:'Tentang SaveTok',wait:'Memproses…',saved:'Tersimpan',e_url:'Link TikTok tidak valid.',e_net:'Tidak bisa terhubung ke tikwm.com. Cek koneksi. Kalau ini dibuka dari pratinjau/sandbox, buka versi ZIP di browser atau hosting sendiri.',e_api:'Video tidak ditemukan, akun privat, atau link salah.',e_dl:'Browser menolak unduhan langsung, file dibuka di tab baru. Tahan lama lalu pilih Simpan.',e_auth:'Username atau password salah.',e_exist:'Username sudah dipakai.',e_cred:'Username 3–20 huruf/angka/_, password minimal 6 karakter.',e_paste:'Izin clipboard ditolak. Tempel manual ke kolom.',hi:'Halo',foot:'SaveTok tidak berafiliasi dengan TikTok.',
s:['Buka TikTok, tekan Bagikan lalu Salin tautan.','Tempel di kolom di atas (otomatis diproses) atau tekan Download.','Pilih format: tanpa watermark, HD, MP3, foto, atau cover.'],
f:['Loading cepat|Tanpa framework, halaman ringan','Hemat storage|File langsung ke perangkatmu, tidak ditampung di server','Privasi aman|Tanpa tracking; akun & riwayat hanya di browser','Bersih & modern|Nyaman di HP, mode terang maupun gelap'],
q:[['Kok gagal diproses?','Biasanya karena akunnya privat, videonya sudah dihapus, atau linknya terpotong. Salin ulang dari tombol Bagikan lalu coba lagi. Kalau kena batas permintaan, sistem otomatis mencoba lagi beberapa detik kemudian.'],['Kenapa file malah terbuka di tab baru?','Beberapa browser (terutama di dalam aplikasi/WebView) menolak unduhan dari domain lain. Tahan videonya lalu pilih Simpan, atau buka SaveTok lewat Chrome/Safari.'],['Beneran bisa 4K?','Kami ambil versi terbaik yang diberikan TikTok. Kalau videonya diunggah 4K dan tersedia, itu yang kamu dapat; kebanyakan video mentok di 1080p.'],['Data saya disimpan di mana?','Video tidak pernah mampir ke server kami. Akun dan riwayat hanya ada di browser perangkat ini; hapus data situs untuk membersihkannya.'],['Batch download diblokir browser?','Izinkan “unduhan ganda” saat browser bertanya (biasanya di bilah alamat), lalu coba lagi.']],
ab:'SaveTok dibuat untuk satu urusan saja: nyimpen video TikTok tanpa ribet. Tidak perlu pasang aplikasi, tidak ada iklan pop-up, tidak ada batas harian. Video diambil lewat API tikwm.com lalu langsung diunduh ke perangkatmu, jadi kami tidak menyimpan filenya. Pakai untuk mengarsipkan konten sendiri atau yang sudah diizinkan kreatornya, ya.'},
en:{h1:'Download TikTok Videos Without Watermark',sub:'Paste a link, pick a format, save. Free and unlimited.',ph:'Paste a TikTok link here…',phb:'One link per line (max 20)',paste:'Paste',go:'Download',one:'Single',bat:'Batch',login:'Log in',logout:'Log out',reg:'Sign up',user:'Username',pass:'Password (min. 6)',hist:'Download History',empty:'No history yet.',clear:'Clear all',nowm:'No Watermark',wm:'With Watermark',hd:'HD (best quality)',mp3:'Audio MP3',cover:'Cover / Thumbnail',imgs:'Save all photos',all:'Download all',how:'How to Use',faq:'FAQ & Troubleshooting',about:'About SaveTok',wait:'Working…',saved:'Saved',e_url:'That doesn’t look like a TikTok link.',e_net:'Can’t reach tikwm.com. Check your connection. If you’re viewing this in a sandboxed preview, open the ZIP build in your browser or host it yourself.',e_api:'Video not found, the account is private, or the link is wrong.',e_dl:'Your browser blocked the direct download, so the file opened in a new tab. Long-press and choose Save.',e_auth:'Wrong username or password.',e_exist:'That username is taken.',e_cred:'Username 3–20 letters/digits/_, password at least 6 characters.',e_paste:'Clipboard permission denied. Paste into the box manually.',hi:'Hi',foot:'SaveTok is not affiliated with TikTok.',
s:['In TikTok, tap Share, then Copy link.','Paste it above (it starts automatically) or press Download.','Pick a format: no watermark, HD, MP3, photos or cover.'],
f:['Fast loading|No frameworks, a featherweight page','Saves storage|Files go straight to your device, never to a server','Private|No tracking; account and history stay in your browser','Clean & modern|Comfortable on phones, light or dark'],
q:[['Why did it fail?','Usually the account is private, the video was deleted, or the link got cut off. Copy it again from the Share button and retry. If you hit a rate limit, the app retries by itself after a few seconds.'],['Why did the file open in a new tab?','Some browsers (especially in-app WebViews) refuse downloads from other domains. Long-press the video and choose Save, or open SaveTok in Chrome/Safari.'],['Is 4K really possible?','We fetch the best version TikTok provides. If a video was uploaded in 4K and is available, that’s what you get; most videos top out at 1080p.'],['Where is my data stored?','Videos never touch our servers. Your account and history live only in this browser; clear site data to wipe them.'],['Batch download blocked by the browser?','Allow “multiple downloads” when the browser asks (usually in the address bar), then try again.']],
ab:'SaveTok does one job: saving TikTok videos without the hassle. No app to install, no pop-up ads, no daily cap. Videos are fetched through the tikwm.com API and go straight to your device, so we never store the files. Use it to archive your own content or what creators have allowed.'},
ja:{h1:'TikTok動画をウォーターマークなしで保存',sub:'リンクを貼って形式を選ぶだけ。無料・無制限。',ph:'TikTokのリンクを貼り付け…',phb:'1行に1リンク(最大20件)',paste:'貼り付け',go:'ダウンロード',one:'単体',bat:'一括',login:'ログイン',logout:'ログアウト',reg:'新規登録',user:'ユーザー名',pass:'パスワード(6文字以上)',hist:'ダウンロード履歴',empty:'履歴はありません。',clear:'全削除',nowm:'透かしなし',wm:'透かしあり',hd:'HD(最高画質)',mp3:'音声MP3',cover:'カバー画像',imgs:'全写真を保存',all:'すべて保存',how:'使い方',faq:'FAQ・トラブル対処',about:'このサイトについて',wait:'処理中…',saved:'保存しました',e_url:'TikTokのリンクが正しくありません。',e_api:'動画が見つかりません(非公開・削除の可能性)。',e_auth:'ユーザー名またはパスワードが違います。',hi:'ようこそ',
s:['TikTokアプリで「共有→リンクをコピー」。','上の欄に貼り付けて「ダウンロード」を押す。','透かしなし・HD・MP3・写真・カバーから選んで保存。'],f:['高速表示','容量を節約','プライバシー保護','シンプルで洗練']},
ko:{h1:'워터마크 없이 TikTok 영상 저장',sub:'링크를 붙여넣고 형식을 고르면 끝. 무료, 무제한.',ph:'TikTok 링크를 붙여넣으세요…',phb:'한 줄에 링크 하나(최대 20개)',paste:'붙여넣기',go:'다운로드',one:'단일',bat:'일괄',login:'로그인',logout:'로그아웃',reg:'가입',user:'아이디',pass:'비밀번호(6자 이상)',hist:'다운로드 기록',empty:'기록이 없습니다.',clear:'전체 삭제',nowm:'워터마크 없음',wm:'워터마크 포함',hd:'HD(최고 화질)',mp3:'오디오 MP3',cover:'커버 이미지',imgs:'사진 모두 저장',all:'모두 다운로드',how:'사용 방법',faq:'FAQ·문제 해결',about:'소개',wait:'처리 중…',saved:'저장됨',e_url:'올바른 TikTok 링크가 아닙니다.',e_api:'영상을 찾을 수 없습니다(비공개 또는 삭제됨).',e_auth:'아이디 또는 비밀번호가 틀렸습니다.',hi:'환영합니다',
s:['TikTok 앱에서 공유 → 링크 복사.','위 입력창에 붙여넣고 다운로드를 누르세요.','워터마크 없음·HD·MP3·사진·커버 중 선택해 저장하세요.'],f:['빠른 로딩','저장공간 절약','개인정보 보호','깔끔한 디자인']},
zh:{h1:'无水印下载 TikTok 视频',sub:'粘贴链接,选择格式,即可保存。免费不限次。',ph:'在此粘贴 TikTok 链接…',phb:'每行一个链接(最多20个)',paste:'粘贴',go:'下载',one:'单个',bat:'批量',login:'登录',logout:'退出',reg:'注册',user:'用户名',pass:'密码(至少6位)',hist:'下载记录',empty:'暂无记录。',clear:'清空',nowm:'无水印',wm:'带水印',hd:'高清(最高画质)',mp3:'音频 MP3',cover:'封面',imgs:'保存全部图片',all:'全部下载',how:'使用方法',faq:'常见问题与排错',about:'关于本站',wait:'处理中…',saved:'已保存',e_url:'TikTok 链接无效。',e_api:'未找到视频(可能为私密或已删除)。',e_auth:'用户名或密码错误。',hi:'欢迎',
s:['在 TikTok 中点“分享→复制链接”。','粘贴到上方输入框,点击“下载”。','选择无水印、高清、MP3、图片或封面保存。'],f:['加载快速','节省空间','隐私安全','简洁现代']},
ru:{h1:'Скачать видео TikTok без водяного знака',sub:'Вставьте ссылку, выберите формат — готово. Бесплатно и без лимитов.',ph:'Вставьте ссылку TikTok…',phb:'По одной ссылке в строке (до 20)',paste:'Вставить',go:'Скачать',one:'Одно',bat:'Пакет',login:'Войти',logout:'Выйти',reg:'Регистрация',user:'Логин',pass:'Пароль (от 6 символов)',hist:'История загрузок',empty:'Истории пока нет.',clear:'Очистить',nowm:'Без водяного знака',wm:'С водяным знаком',hd:'HD (макс. качество)',mp3:'Аудио MP3',cover:'Обложка',imgs:'Сохранить все фото',all:'Скачать всё',how:'Как пользоваться',faq:'FAQ и решение проблем',about:'О сервисе',wait:'Обработка…',saved:'Сохранено',e_url:'Неверная ссылка TikTok.',e_api:'Видео не найдено (приватное или удалено).',e_auth:'Неверный логин или пароль.',hi:'Привет',
s:['В TikTok: «Поделиться» → «Копировать ссылку».','Вставьте ссылку выше и нажмите «Скачать».','Выберите: без знака, HD, MP3, фото или обложка.'],f:['Быстрая загрузка','Экономия места','Приватность','Чистый дизайн']}
};
const LN={id:'Indonesia',en:'English',ja:'日本語',ko:'한국어',zh:'中文',ru:'Русский'};
let L=S.g('lang','id');if(!D[L])L='id';
const t=k=>{const v=D[L][k];return v!==undefined?v:D.en[k]!==undefined?D.en[k]:D.id[k]};

/* tema */
const root=document.documentElement,sv=S.g('theme',null);if(sv)root.dataset.theme=sv;
$('#theme').onclick=()=>{const d=root.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'),n=d==='dark'?'light':'dark';root.dataset.theme=n;S.s('theme',n)};

/* pesan & toast */
const msg=(m,bad)=>{const e=$('#msg');e.textContent=m||'';e.className=bad?'err':''};
let tt;const toast=m=>{const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),3500)};

/* link & API */
const RX=/(?:https?:\/\/)?(?:[\w-]+\.)*tiktok\.com\/[^\s"'<>]+/i;
const getUrl=s=>{const m=String(s||'').match(RX);if(!m)return null;const u=m[0].replace(/[.,;)\]]+$/,'');return/^https?:/i.test(u)?u:'https://'+u};
const ab=u=>!u?'':/^https?:/i.test(u)?u:u.startsWith('//')?'https:'+u:'https://www.tikwm.com'+(u[0]==='/'?'':'/')+u;
let last=0;
async function api(url){
 const q=API+'?hd=1&url='+encodeURIComponent(url);let net=true;
 for(let n=0;n<3;n++){ // tikwm gratis: 1 request/detik
  const w=1150-(Date.now()-last);if(w>0)await sleep(w);last=Date.now();
  let limited=false;
  for(const p of PX){
   let j;try{j=await(await fetch(p?p+encodeURIComponent(q):q)).json()}catch(e){continue}
   net=false;
   if(j&&j.code===0&&j.data)return Object.assign(j.data,{images:(j.data.images||[]).filter(Boolean)});
   if(j&&/limit/i.test(j.msg||''))limited=true;
   break;
  }
  if(!limited)break;
 }
 throw new Error(net?'net':'api');
}

/* download */
const fn=(d,tag,ext)=>`savetok_${d.id||Date.now()}_${tag}.${ext}`;
async function dl(u,name,btn){
 u=ab(u);if(!u)return;
 const old=btn&&btn.textContent;if(btn){btn.disabled=true;btn.textContent='…'}
 try{
  const r=await fetch(u);if(!r.ok)throw 0;
  const a=el('a');a.href=URL.createObjectURL(await r.blob());a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast(t('saved')+' ✓');
 }catch(e){window.open(u,'_blank','noopener');toast(t('e_dl'))}
 if(btn){btn.disabled=false;btn.textContent=old}
}
const ACT={
 nowm:(d,b)=>dl(d.play,fn(d,'nowm','mp4'),b),
 wm:(d,b)=>dl(d.wmplay,fn(d,'wm','mp4'),b),
 hd:(d,b)=>dl(d.hdplay,fn(d,'hd','mp4'),b),
 mp3:(d,b)=>dl(d.music||(d.music_info||{}).play,fn(d,'audio','mp3'),b),
 cover:(d,b)=>dl(d.origin_cover||d.cover,fn(d,'cover','jpg'),b),
 img:(d,b,n)=>dl(d.images[n],fn(d,'foto'+(n+1),'jpg'),b),
 imgs:async(d,b)=>{if(b)b.disabled=true;for(let i=0;i<d.images.length;i++){await dl(d.images[i],fn(d,'foto'+(i+1),'jpg'));await sleep(400)}if(b)b.disabled=false}
};

/* kartu hasil */
function card(d,c){
 const a=d.author||{},im=d.images,nf=new Intl.NumberFormat(L,{notation:'compact'}),cv=esc(d.cover||''),mu=d.music||(d.music_info||{}).play,
 B=(k,n,x)=>`<button type="button" class="btn${x?' '+x:''}" data-k="${k}"${n==null?'':` data-n="${n}"`}>${esc(t(k))}</button>`,
 E=el('article','card'+(c?' sm':'')),
 media=c?`<img class="th" src="${cv}" alt="" onerror="this.style.visibility='hidden'">`
  :im.length?`<div class="grid">${im.map((u,i)=>`<div><img loading="lazy" src="${esc(u)}" alt=""><button type="button" class="btn sm" data-k="img" data-n="${i}">↓ ${i+1}</button></div>`).join('')}</div>`
  :`<video controls playsinline preload="none" poster="${cv}" src="${esc(ab(d.play))}"></video>`;
 E.innerHTML=media+`<div class="meta"><b>@${esc(a.unique_id)}</b> ${esc(a.nickname)}<p>${esc(d.title)}</p><small>▶ ${nf.format(d.play_count||0)} · ♥ ${nf.format(d.digg_count||0)} · ${+d.duration||0}s</small></div><div class="acts">`
  +(im.length?B('imgs',null,'pri'):B('nowm',null,'pri')+(d.hdplay?B('hd'):'')+B('wm'))+(mu?B('mp3'):'')+B('cover')+'</div>';
 E.onclick=e=>{const b=e.target.closest('button[data-k]');if(!b)return;addHist(d);ACT[b.dataset.k](d,b,+b.dataset.n)};
 return E;
}

/* riwayat & akun (disimpan di localStorage browser) */
const hk=()=>'h:'+(S.g('cur',null)||'guest');
function addHist(d){if(!d.id||!d._url)return;const h=S.g(hk(),[]).filter(x=>x.id!==d.id);h.unshift({id:d.id,url:d._url,title:d.title||'',cover:d.cover||'',ts:Date.now()});S.s(hk(),h.slice(0,50));renderHist()}
function renderHist(){
 const h=S.g(hk(),[]),b=$('#hl');b.replaceChildren();$('#hc').hidden=!h.length;
 if(!h.length){b.append(el('p','mut',t('empty')));return}
 h.forEach(x=>{const r=el('button','hrow');r.type='button';r.innerHTML=`<img src="${esc(x.cover)}" alt="" onerror="this.style.visibility='hidden'"><span>${esc(x.title||x.url)}<small>${esc(new Date(x.ts).toLocaleString(L))}</small></span>`;r.onclick=()=>{setMode('single');$('#u').value=x.url;scrollTo({top:0,behavior:'smooth'});go()};b.append(r)});
}
async function hash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('savetok:'+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=5381;for(const c of 'savetok:'+s)h=(h*33^c.charCodeAt(0))>>>0;return'x'+h}}
async function auth(reg){
 const u=$('#au').value.trim().toLowerCase(),p=$('#ap').value,us=S.g('users',{}),er=k=>{$('#ae').textContent=t(k)};
 if(!/^[a-z0-9_]{3,20}$/.test(u)||p.length<6)return er('e_cred');
 const h=await hash(p);
 if(reg){if(Object.prototype.hasOwnProperty.call(us,u))return er('e_exist');us[u]=h;S.s('users',us)}
 else if(us[u]!==h)return er('e_auth');
 S.s('cur',u);$('#ap').value='';$('#dlg').close();refresh();toast(t('hi')+', '+u);
}
function refresh(){const c=S.g('cur',null);$('#auth').textContent=c?`${c} · ${t('logout')}`:t('login');renderHist()}

/* proses link */
let mode='single',busy=false;
function setMode(m){mode=m;$$('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));$('#u').hidden=m!=='single';$('#ub').hidden=m==='single'}
async function go(){
 if(busy)return;busy=true;msg('');$('#go').disabled=true;
 try{
  const box=$('#res');
  if(mode==='single'){
   const u=getUrl($('#u').value);if(!u){msg(t('e_url'),1);return}
   msg(t('wait'));const d=await api(u);d._url=u;box.replaceChildren(card(d));msg('');
  }else{
   const us=[...new Set($('#ub').value.split(/\s+/).map(getUrl).filter(Boolean))].slice(0,20);
   if(!us.length){msg(t('e_url'),1);return}
   box.replaceChildren();const ok=[];
   for(let i=0;i<us.length;i++){
    msg(`${t('wait')} ${i+1}/${us.length}`);
    try{const d=await api(us[i]);d._url=us[i];ok.push(d);box.append(card(d,1))}
    catch(e){box.append(el('div','card err','✕ '+us[i]))}
   }
   msg('');
   if(ok.length>1){const b=el('button','btn pri',t('all')+' ('+ok.length+')');b.type='button';b.style.width='100%';b.dataset.all='1';
    b.onclick=async()=>{b.disabled=true;for(const d of ok){addHist(d);await(d.images.length?ACT.imgs(d):ACT.nowm(d));await sleep(700)}b.disabled=false};box.prepend(b)}
  }
 }catch(e){msg(t(e.message==='net'?'e_net':'e_api'),1)}
 finally{busy=false;$('#go').disabled=false}
}

/* teks multi bahasa */
function applyLang(){
 root.lang=L;
 $$('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 $('#u').placeholder=t('ph');$('#ub').placeholder=t('phb');$('#au').placeholder=t('user');$('#ap').placeholder=t('pass');
 $$('#res [data-k]').forEach(b=>{if(b.dataset.k!=='img')b.textContent=t(b.dataset.k)});
 const all=$('#res [data-all]');if(all)all.textContent=t('all')+' ('+(all.textContent.match(/\((\d+)\)/)||[0,''])[1]+')';
 $('#feats').innerHTML=t('f').map(x=>{const p=x.split('|');return`<div><b>${esc(p[0])}</b>${p[1]?`<span>${esc(p[1])}</span>`:''}</div>`}).join('');
 $('#steps').innerHTML=t('s').map(x=>`<li>${esc(x)}</li>`).join('');
 $('#faqs').innerHTML=t('q').map(x=>`<details><summary>${esc(x[0])}</summary><p>${esc(x[1])}</p></details>`).join('');
 $('#ab').textContent=t('ab');
 refresh();
}

/* event */
const ls=$('#lang');Object.keys(LN).forEach(k=>ls.add(new Option(LN[k],k)));ls.value=L;
ls.onchange=()=>{L=ls.value;S.s('lang',L);applyLang()};
$$('.tabs button').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
$('#f').onsubmit=e=>{e.preventDefault();go()};
$('#u').addEventListener('paste',()=>setTimeout(()=>{if(getUrl($('#u').value))go()},60));
$('#paste').onclick=async()=>{
 try{const x=await navigator.clipboard.readText();(mode==='single'?$('#u'):$('#ub')).value=x;if(mode==='single'&&getUrl(x))go()}
 catch(e){(mode==='single'?$('#u'):$('#ub')).focus();toast(t('e_paste'))}
};
$('#hc').onclick=()=>{S.s(hk(),[]);renderHist()};
$('#auth').onclick=()=>{if(S.g('cur',null)){S.s('cur',null);refresh()}else{$('#ae').textContent='';$('#dlg').showModal()}};
$('#af').onsubmit=e=>{e.preventDefault();auth(false)};
$('#rg').onclick=()=>auth(true);
$('#cl').onclick=()=>$('#dlg').close();
setMode('single');applyLang();
/* ===== SaveTok: tombol "WhatsApp" -> kirim video/foto ke Status WhatsApp =====
   TEMPEL DI PALING BAWAH script.js (baris 178, setelah: setMode('single');applyLang();)
   Tanpa API key: pakai Web Share API bawaan browser HP (gratis & resmi). */
Object.assign(D.id,{wa:'WhatsApp',e_wa:'Simpan filenya, lalu buka WhatsApp → Status dan pilih file itu.',e_wa2:'File siap. Tekan WhatsApp sekali lagi.'});
Object.assign(D.en,{wa:'WhatsApp',e_wa:'Save the file, then open WhatsApp → Status and pick it.',e_wa2:'File ready. Tap WhatsApp once more.'});
async function waFiles(d){ // ambil video/foto jadi File supaya bisa di-share
 const v=!d.images.length;
 return Promise.all((v?[d.play]:d.images.slice(0,10)).map(async(u,i)=>{
  if(!u)throw 0;const r=await fetch(ab(u));if(!r.ok)throw 0;const x=await r.blob();
  return new File([x],fn(d,v?'nowm':'foto'+(i+1),v?'mp4':'jpg'),{type:v?'video/mp4':x.type||'image/jpeg'});
 }));
}
ACT.wa=async(d,b)=>{
 const old=b.textContent,had=!!d._wa,rs=()=>{b.disabled=false;b.textContent=old},
 fb=async()=>{await(d.images.length?ACT.imgs(d):ACT.nowm(d));toast(t('e_wa'))}; // cadangan: unduh file
 b.disabled=true;b.textContent='…';
 try{
  const f=d._wa||(d._wa=await waFiles(d));rs();
  if(navigator.canShare&&navigator.canShare({files:f}))await navigator.share({files:f});else await fb();
 }catch(e){
  rs();const n=e&&e.name;
  if(n==='NotAllowedError'&&!had)toast(t('e_wa2'));else if(n!=='AbortError')await fb();
 }
};
const _card=card; // tambah tombol WhatsApp di baris tombol hasil, kode lama tidak diubah
card=(d,c)=>{const E=_card(d,c);E.querySelector('.acts').insertAdjacentHTML('beforeend','<button type="button" class="btn" data-k="wa">'+esc(t('wa'))+'</button>');return E};
                                                   
/* ===== SaveTok: menu setting "Deluxe" (hubungi developer + rating & saran fitur) =====
   TEMPEL DI PALING BAWAH script.js: baris 178 (kalau patch WhatsApp belum dipasang) atau baris 204 (kalau sudah).
   Ganti email di variabel MAIL kalau perlu. Tanpa server: tombol kirim membuka aplikasi email dengan isi sudah terisi. */
(()=>{
 const MAIL='websitescarlett@gmail.com';
 Object.assign(D.id,{dx_c:'Hubungi Developer',dx_mail:'Kirim Email',dx_copy:'Salin Email',dx_cp:'Email disalin ✓',dx_r:'Rating & Saran Fitur',dx_fp:'Tulis saran fitur (opsional)…',dx_s:'Kirim',dx_rn:'Pilih bintang atau tulis saran dulu.',dx_ok:'Terima kasih! Tekan Kirim di aplikasi email-mu.',dx_x:'Tutup'});
 Object.assign(D.en,{dx_c:'Contact Developer',dx_mail:'Send Email',dx_copy:'Copy Email',dx_cp:'Email copied ✓',dx_r:'Rating & Feature Suggestion',dx_fp:'Write a feature suggestion (optional)…',dx_s:'Send',dx_rn:'Pick a star or write a suggestion first.',dx_ok:'Thank you! Press Send in your email app.',dx_x:'Close'});
 const dlg=el('dialog'),btn=el('button','btn sm','⚙');let rate=0;
 dlg.id='dxd';btn.type='button';btn.id='dxb';btn.title='Deluxe';btn.setAttribute('aria-label','Deluxe');
 const say=m=>{dlg.querySelector('#dxm').textContent=m};
 const paint=()=>dlg.querySelectorAll('[data-s]').forEach(b=>{const on=+b.dataset.s<=rate;b.classList.toggle('pri',on);b.textContent=on?'★':'☆'});
 const send=(s,b)=>{location.href='mailto:'+MAIL+'?subject='+encodeURIComponent(s)+'&body='+encodeURIComponent(b)};
 const B=(a,k,x)=>`<button type="button" class="btn${x||''}" data-a="${a}">${esc(t(k))}</button>`;
 const html=()=>`<h3>⚙ Deluxe</h3><b>${esc(t('dx_c'))}</b><br><small>${MAIL}</small>`
  +`<div class="fr">${B('mail','dx_mail',' pri')}${B('copy','dx_copy')}</div>`
  +`<div style="border-top:1px solid var(--bd);margin:16px 0"></div><b>${esc(t('dx_r'))}</b>`
  +`<div class="fr">${[1,2,3,4,5].map(n=>`<button type="button" class="btn" style="font-size:20px" data-s="${n}">☆</button>`).join('')}</div>`
  +`<textarea id="dxs" rows="2" maxlength="500" placeholder="${esc(t('dx_fp'))}" style="margin-top:10px"></textarea>`
  +`<div class="fr">${B('send','dx_s')}</div><p class="mut" id="dxm" role="status"></p><div class="fr">${B('x','dx_x')}</div>`;
 btn.onclick=()=>{rate=S.g('dxrate',0);dlg.innerHTML=html();paint();if(!dlg.open)dlg.showModal()};
 dlg.onclick=async e=>{
  const b=e.target.closest('button');if(!b)return;
  const a=b.dataset.a,v=dlg.querySelector('#dxs').value.trim();
  if(b.dataset.s){rate=+b.dataset.s;paint();say('')}
  else if(a==='x')dlg.close();
  else if(a==='mail')send('Hubungi Developer SaveTok','Halo developer SaveTok,\n\n');
  else if(a==='copy'){try{await navigator.clipboard.writeText(MAIL);say(t('dx_cp'))}catch(x){say(MAIL)}}
  else if(a==='send'){
   if(!rate&&!v)return say(t('dx_rn'));
   if(rate)S.s('dxrate',rate);
   send('SaveTok '+[rate&&'Rating '+rate+'/5',v&&'Saran Fitur'].filter(Boolean).join(' + '),[rate&&'Rating: '+'★'.repeat(rate)+'☆'.repeat(5-rate)+' ('+rate+'/5)',v&&'Saran Fitur:\n'+v].filter(Boolean).join('\n\n'));
   say(t('dx_ok'));
  }
 };
 document.body.append(dlg);$('#theme').after(btn);
})();
/* ===== SaveTok: token harian + Premium =====
   TEMPEL DI PALING BAWAH script.js (setelah patch sponsor ikon). Angka aturan ada di baris const paling atas.
   Jujur soal batasan: token & status premium disimpan di browser (localStorage), jadi ini pembatas ringan, bukan keamanan.
   Tugas (ikuti WA/TikTok, download game, iklan) tidak bisa dicek website statis: sistemnya berbasis kejujuran + jeda waktu. */
(()=>{
 const CAP=30,DAILY=5,ADN=5,WAIT=8000,SEC=10; // maks token, token per hari, jumlah iklan, jeda minimal tugas (ms), detik per iklan
 const WA='https://whatsapp.com/channel/0029VbDfnrw0QeacGwXoCG3U',TT='https://www.tiktok.com/@liliyana.chan';
 // game untuk tugas download: [nama, label singkat, halaman resmi]
 const GM=[['Genshin Impact','Genshin','https://genshin.hoyoverse.com/'],['Honkai: Star Rail','HSR','https://hsr.hoyoverse.com/en-us/home'],['Zenless Zone Zero','ZZZ','https://zenless.hoyoverse.com/'],['Honkai Impact 3rd','HI3','https://honkaiimpact3.hoyoverse.com/global/en-us/'],['Wuthering Waves','WuWa','https://wutheringwaves.kurogames.com/en/']];
 // iklan sponsor HoYoverse: [game, teks, link]. Ganti dengan materi iklan asli kalau sudah ada.
 const ADS=[['Genshin Impact','Open-world action RPG',GM[0][2]],['Honkai: Star Rail','A space fantasy RPG',GM[1][2]],['Zenless Zone Zero','Urban fantasy action RPG',GM[2][2]],['Honkai Impact 3rd','Sci-fi action game',GM[3][2]]];
 Object.assign(D.id,{pr_tk:'Token',pr_on:'Premium aktif, tanpa batas',pr_btn:'Premium',pr_d:'Premium = download tanpa batas. Selesaikan 4 tahap. Tanpa premium: 1 token per video, 3 token per batch, +5 token tiap hari (maks. 30).',pr_low:'Token tidak cukup (butuh {c}, punya {n}). Token bertambah +5 tiap hari (maks. 30), atau jadi Premium.',pr_wa:'Ikuti Saluran WhatsApp',pr_tt:'Ikuti TikTok @liliyana.chan',pr_gm:'Download satu game HoYoverse atau Wuthering Waves',pr_ad:'Tonton 5 iklan (Sponsor HoYoverse)',pr_open:'Buka',pr_ok:'Sudah',pr_first:'Tekan Buka dulu.',pr_wait:'Selesaikan tugasnya dulu, lalu tekan Sudah.',pr_lock:'Selesaikan tahap 1 sampai 3 dulu.',pr_watch:'Tonton iklan',pr_ad1:'Iklan',pr_sp:'Sponsor HoYoverse',pr_w:'Tunggu {s} dtk…',pr_fin:'Selesai ✓',pr_vis:'Halaman resmi',pr_win:'Selamat! Premium aktif. 🎉',pr_x:'Tutup'});
 Object.assign(D.en,{pr_tk:'Tokens',pr_on:'Premium active, unlimited',pr_btn:'Premium',pr_d:'Premium = unlimited downloads. Finish 4 steps. Without premium: 1 token per video, 3 per batch, +5 tokens every day (max 30).',pr_low:'Not enough tokens (need {c}, have {n}). You get +5 tokens every day (max 30), or go Premium.',pr_wa:'Follow the WhatsApp Channel',pr_tt:'Follow TikTok @liliyana.chan',pr_gm:'Download one HoYoverse game or Wuthering Waves',pr_ad:'Watch 5 ads (HoYoverse Sponsor)',pr_open:'Open',pr_ok:'Done',pr_first:'Tap Open first.',pr_wait:'Finish the task first, then tap Done.',pr_lock:'Finish steps 1 to 3 first.',pr_watch:'Watch ad',pr_ad1:'Ad',pr_sp:'HoYoverse Sponsor',pr_w:'Wait {s}s…',pr_fin:'Done ✓',pr_vis:'Official page',pr_win:'Congrats! Premium is on. 🎉',pr_x:'Close'});
 const day=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
 const tok=()=>{const d=day();let s=S.g('stk',null);if(!s||typeof s.n!=='number')s={n:DAILY,d};else if(d>s.d){s.n=Math.min(CAP,s.n+(d-s.d)*DAILY);s.d=d}S.s('stk',s);return s};
 const gp=()=>Object.assign({wa:0,tt:0,gm:0,ad:0},S.g('spr',{}));
 const prem=()=>{const p=gp();return !!(p.wa&&p.tt&&p.gm&&p.ad>=ADN)};
 const charge=c=>{const s=tok();s.n=Math.max(0,s.n-c);S.s('stk',s)};
 const im=(n,s)=>{const u=(window.STIC||{})[n];return u?'<img src="'+esc(u)+'" alt="" width="'+s+'" height="'+s+'" style="border-radius:22%;display:block;margin:auto">':''};
 const btn=(l,a,k,c,x)=>'<button type="button" class="btn'+(c?' '+c:'')+'" data-a="'+a+'"'+(k?' data-k="'+k+'"':'')+(x||'')+'>'+esc(t(l))+'</button>';
 const dlg=el('dialog'),ad=el('dialog'),bx=el('div');
 let note='',t0={},cur=ADS[0],iv=0;
 bx.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:10px;font-size:14px';
 const bar=()=>{bx.innerHTML='<span class="mut">'+(prem()?' Luxe Active '+esc(t('pr_on')):' Mora '+esc(t('pr_tk'))+' <b style="color:var(--tx)">'+tok().n+'/'+CAP+'</b>')+'</span><button type="button" class="btn sm">'+esc(t('pr_btn'))+'</button>'};
 const say=m=>{dlg.querySelector('#prn').textContent=m};
 const draw=()=>{
  const p=gp(),lock=!(p.wa&&p.tt&&p.gm);
  const row=(n,k,l,b)=>'<div style="margin-top:14px"><b>'+n+'. '+esc(t(l))+'</b>'+(p[k]?' ✓':b)+'</div>';
  const pair=k=>'<div class="fr">'+btn('pr_open','go',k,'pri')+btn('pr_ok','ok',k)+'</div>';
  const games='<div class="fr">'+GM.map((g,i)=>'<button type="button" class="btn" data-a="game" data-i="'+i+'" title="'+esc(g[0])+'" aria-label="'+esc(g[0])+'" style="padding:6px">'+(im(g[0],36)||esc(g[1]))+'</button>').join('')+'</div><div class="fr">'+btn('pr_ok','ok','gm')+'</div>';
  dlg.innerHTML='<h3>Luxe Active Premium</h3><p class="mut" id="prn">'+esc(note||t('pr_d'))+'</p>'
   +row(1,'wa','pr_wa',pair('wa'))+row(2,'tt','pr_tt',pair('tt'))+row(3,'gm','pr_gm',games)
   +'<div style="margin-top:14px"><b>4. '+esc(t('pr_ad'))+'</b> <span class="mut">'+(p.ad>=ADN?'✓':p.ad+'/'+ADN)+'</span>'
   +(p.ad>=ADN?'':'<div class="fr">'+btn('pr_watch','ad','','pri',lock?' disabled':'')+'</div>'+(lock?'<small>'+esc(t('pr_lock'))+'</small>':''))+'</div>'
   +'<div class="fr" style="margin-top:16px">'+btn('pr_x','x')+'</div>';
 };
 const show=m=>{note=m||'';draw();if(!dlg.open)dlg.showModal()};
 dlg.onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  const a=b.dataset.a,k=b.dataset.k,p=gp();
  if(a==='x')dlg.close();
  else if(a==='go'){window.open(k==='wa'?WA:TT,'_blank','noopener');t0[k]=Date.now();say(t('pr_wait'))}
  else if(a==='game'){const g=GM[+b.dataset.i];window.open(g[2],'_blank','noopener');t0.gm=Date.now();say(g[0]+': '+t('pr_wait'))}
  else if(a==='ok'){
   if(!t0[k])return say(t('pr_first'));
   if(Date.now()-t0[k]<WAIT)return say(t('pr_wait'));
   p[k]=1;S.s('spr',p);note='';draw();bar();
  }
  else if(a==='ad')play();
 };
 const play=()=>{
  const p=gp();let c=SEC;cur=ADS[p.ad%ADS.length];
  ad.innerHTML='<small class="mut">'+esc(t('pr_ad1'))+' '+(p.ad+1)+'/'+ADN+' · '+esc(t('pr_sp'))+'</small><div style="text-align:center;margin:14px 0">'+im(cur[0],72)+'<h3 style="margin:10px 0 4px">'+esc(cur[0])+'</h3><p class="mut" style="margin:0">'+esc(cur[1])+'</p></div><div class="fr">'+btn('pr_vis','vis')+'<button type="button" class="btn pri" data-a="fin" disabled>'+esc(t('pr_w').replace('{s}',c))+'</button></div>';
  const f=ad.querySelector('[data-a=fin]');
  clearInterval(iv);
  iv=setInterval(()=>{
   if(document.visibilityState==='visible')c--;
   if(c<=0){clearInterval(iv);f.disabled=false;f.textContent=t('pr_fin')}else f.textContent=t('pr_w').replace('{s}',c);
  },1000);
  ad.showModal();
 };
 ad.onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.a==='vis')window.open(cur[2],'_blank','noopener');
  else if(b.dataset.a==='fin'){const p=gp();p.ad++;S.s('spr',p);ad.close();note=prem()?t('pr_win'):'';draw();bar()}
 };
 ad.onclose=()=>clearInterval(iv);
 bx.onclick=e=>{if(e.target.closest('button'))show('')};
 const _go=go,_al=applyLang;
 go=async()=>{ // potong token hanya kalau link berhasil diproses: 1 token, batch 3 token
  if(busy)return _go();
  const c=mode==='single'?1:3,s=tok();
  if(!prem()&&s.n<c)return show(t('pr_low').replace('{c}',c).replace('{n}',s.n));
  await _go();
  if(!prem()&&$('#msg').className!=='err'&&$$('#res article.card').length)charge(c);
  bar();
 };
 applyLang=()=>{_al();bar()};
 $('#msg').after(bx);document.body.append(dlg,ad);bar();
})();
/* ===== SaveTok: sponsor game RPG berbentuk kartu + ikon resmi (MENGGANTIKAN patch sponsor sebelumnya) =====
   PASANG: hapus blok sponsor lama (baris 240-256), lalu tempel kode ini di baris 240.
   Belum pernah memasang yang lama? Tempel di paling bawah script.js.
   Ikon diambil langsung dari halaman resmi App Store (iTunes API milik Apple), jadi selalu sama dengan ikon aslinya.
   Tiap ikon dicek dulu (nama app harus cocok). Kalau tidak cocok atau gagal dimuat, kartu menampilkan huruf awal, bukan ikon lain. */
(()=>{
 Object.assign(D.id,{sp:'Sponsor Game RPG'});
 Object.assign(D.en,{sp:'RPG Game Sponsors'});
 Object.assign(D.ja,{sp:'RPGゲームのスポンサー'});
 Object.assign(D.ko,{sp:'RPG 게임 스폰서'});
 Object.assign(D.zh,{sp:'RPG游戏赞助商'});
 Object.assign(D.ru,{sp:'Спонсоры RPG-игр'});
 // [nama tampil, ID App Store (0 = cari lewat nama), kata kunci nama app, kata kunci publisher (hanya untuk pencarian cadangan)]
 const G=[
  ['Zenless Zone Zero',1606356401,'zenless','cognosphere|hoyoverse|mihoyo'],
  ['Honkai Impact 3rd',1336342304,'honkai impact','cognosphere|hoyoverse|mihoyo'],
  ['Honkai: Star Rail',1599719154,'star rail','cognosphere|hoyoverse|mihoyo'],
  ['Genshin Impact',1517783697,'genshin','cognosphere|hoyoverse|mihoyo'],
  ['Wuthering Waves',6475033368,'wuthering','kuro'],
  ['Tower of Fantasy',1601586278,'tower of fantasy','perfect world|level infinite|hotta|tencent'],
  ['Solo Leveling: ARISE',1662742277,'solo leveling','netmarble'],
  ['Neverness to Everness',6754593077,'neverness','perfect world|hotta|n2e'],
  ['Arknights: Endfield',6752642477,'endfield','gryph'],
  ['Where Winds Meet',6472396866,'where winds','netease'],
  ['Blue Archive',1571873795,'blue archive','nexon']
 ];
 $$('[data-i="sp"]').forEach(e=>e.closest('section').remove()); // buang bagian sponsor versi lama kalau masih ada
 document.head.append(el('style',0,'.spn{grid-template-columns:repeat(auto-fit,minmax(96px,1fr))}.spn div{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}.spn b{font-size:13px;line-height:1.25}.spn img,.spn i{width:56px;height:56px;border-radius:13px;object-fit:cover}.spn i{display:grid;place-items:center;background:var(--bg);border:1px solid var(--bd);color:var(--mut);font:700 22px/1 system-ui}'));
 const sec=el('section'),h=el('h2',0,t('sp')),g=el('div','feats spn');
 h.dataset.i='sp';
 g.innerHTML=G.map(x=>'<div><i>'+esc(x[0][0])+'</i><b>'+esc(x[0])+'</b></div>').join('');
 sec.append(h,g);
 $('#ab').closest('section').before(sec);
 const ICO=window.STIC=window.STIC||{},U={};
 const paint=(i,u)=>{ICO[G[i][0]]=u;const im=el('img');im.alt='';im.loading='lazy';im.onerror=()=>{im.onerror=null;im.src=u};im.src=u.replace('100x100','200x200');g.children[i].firstChild.replaceWith(im)};
 const save=(i,u)=>{U[i]=u;paint(i,u);S.s('spic',{t:Date.now(),u:U})};
 const jp=(u,f)=>{const n='__stj'+Math.random().toString(36).slice(2),s=el('script');window[n]=d=>{delete window[n];s.remove();f(d&&d.results||[])};s.onerror=()=>{delete window[n];s.remove();f([])};s.src=u+'&callback='+n;document.head.append(s)};
 const nm=r=>(r.trackName||'').toLowerCase(),pb=r=>((r.sellerName||'')+' '+(r.artistName||'')).toLowerCase(),okn=(i,r)=>!!r.artworkUrl100&&nm(r).includes(G[i][2]);
 const C=S.g('spic',null);
 if(C&&Date.now()-C.t<6048e5&&Object.keys(C.u).length===G.length)Object.keys(C.u).forEach(i=>{U[i]=C.u[i];paint(+i,C.u[i])}); // pakai cache 7 hari
 else jp('https://itunes.apple.com/lookup?country=us&id='+G.map(x=>x[1]).filter(Boolean).join(','),rs=>G.forEach((x,i)=>{
  const r=rs.find(r=>r.trackId==x[1]&&okn(i,r));
  if(r)save(i,r.artworkUrl100);
  else jp('https://itunes.apple.com/search?country=us&entity=software&limit=10&term='+encodeURIComponent(x[0]),ss=>{const q=ss.find(r=>okn(i,r)&&new RegExp(x[3]).test(pb(r)));if(q)save(i,q.artworkUrl100)});
 }));
})();
// UPDATE: tombol "AI Asisten" di menu pengaturan "Deluxe"
// Tempel di dalam <script> ... </script> baru, tepat di atas </body>

;(function () {
  if (window.__skAi) return;
  window.__skAi = true;

  // Alamat AI. Hanya dipakai di dalam kode, tidak ditampilkan di layar.
  var AI_URL = 'https://nexus-sealyn-ai-deve-m9l5.bolt.host/';
  var DLG = 'sk-ai-dlg';
  var ITEM = 'sk-ai-item';
  var prevOverflow = '';

  // Gaya hanya untuk elemen baru, tampilan yang sudah ada tidak disentuh.
  var st = document.createElement('style');
  st.textContent =
    '.sk-ai-btn{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;margin:8px 0;padding:12px 14px;border:1px solid rgba(128,128,128,.3);border-radius:12px;background:rgba(128,128,128,.1);color:inherit;font:inherit;text-align:left;cursor:pointer}' +
    '.sk-ai-go{margin-left:auto;opacity:.5}' +
    '.sk-ai-btn:focus-visible,.sk-ai-x:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
    'dialog.sk-ai-dlg{position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:0;border:0;overflow:hidden}' +
    'dialog.sk-ai-dlg[open]{display:flex;flex-direction:column}' +
    '.sk-ai-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;padding-top:calc(10px + env(safe-area-inset-top,0px));border-bottom:1px solid rgba(128,128,128,.3)}' +
    '.sk-ai-x{border:0;background:none;color:inherit;font:inherit;font-size:1.3em;padding:4px 8px;cursor:pointer}' +
    '.sk-ai-frame{flex:1;min-height:0;width:100%;border:0}';
  document.head.appendChild(st);

  function clear(c) {
    return !c || c === 'transparent' || /rgba\(.*,\s*0\)$/.test(c);
  }

  function isLight(c) {
    var m = (c || '').match(/\d+/g) || [0, 0, 0];
    return (m[0] * 299 + m[1] * 587 + m[2] * 114) / 1000 > 140;
  }

  // Panel AI layar penuh (warna mengikuti tema halaman: gelap/terang)
  function openAI() {
    var d = document.getElementById(DLG);
    if (!d) {
      d = document.createElement('dialog');
      d.id = DLG;
      d.className = 'sk-ai-dlg';
      d.innerHTML =
        '<div class="sk-ai-bar"><b>AI Asisten</b>' +
        '<button type="button" class="sk-ai-x" aria-label="Tutup">\u2715</button></div>' +
        '<iframe class="sk-ai-frame" title="AI Asisten" allow="clipboard-write"></iframe>';
      d.querySelector('.sk-ai-x').onclick = function () { d.close(); };
      d.addEventListener('close', function () {
        document.documentElement.style.overflow = prevOverflow;
      });
      document.body.appendChild(d);
    }

    var cs = getComputedStyle(document.body);
    var bg = cs.backgroundColor;
    if (clear(bg)) bg = getComputedStyle(document.documentElement).backgroundColor;
    if (clear(bg)) bg = isLight(cs.color) ? '#0b0b0f' : '#ffffff';
    d.style.background = bg;
    d.style.color = cs.color;

    var f = d.querySelector('iframe');
    if (!f.getAttribute('src')) f.src = AI_URL;

    if (!d.open) {
      prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      d.showModal();
    }
  }

  function letters(s) {
    return (s || '').toLowerCase().replace(/[^a-z]/g, '');
  }

  // Cari label "Deluxe" lalu pasang tombol AI tepat di bawahnya
  function ensure() {
    var item = document.getElementById(ITEM);
    var prev = item && item.previousElementSibling;
    if (prev && letters(prev.textContent) === 'deluxe') return;

    var all = document.body.getElementsByTagName('*');
    var row = null;
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
      if (/^(SCRIPT|STYLE|IFRAME|SELECT|OPTION|OPTGROUP)$/.test(el.tagName)) continue;
      var t = el.textContent;
      if (t.length < 40 && letters(t) === 'deluxe') { row = el; break; }
    }
    if (!row) return;

    if (item) item.remove();
    var w = document.createElement(row.tagName === 'LI' ? 'li' : 'div');
    w.id = ITEM;
    w.style.cssText = 'grid-column:1/-1;list-style:none';
    w.innerHTML =
      '<button type="button" class="sk-ai-btn">' +
      '<span style="font-size:1.4em">\uD83E\uDD16</span>' +
      '<span>AI Asisten</span>' +
      '<span class="sk-ai-go">\u203A</span></button>';
    w.firstChild.onclick = openAI;
    row.insertAdjacentElement('afterend', w);
  }

  // Menu pengaturan dirender lewat JavaScript, jadi dipantau terus
  var timer;
  new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(ensure, 150);
  }).observe(document.body, { childList: true, subtree: true });
  ensure();
})();
// UPDATE: video 16:9 di bawah judul utama "Download Video TikTok Tanpa Watermark"
// Tempel di paling bawah script.js, setelah baris 478 (penutup "})();" terakhir)

;(function () {
  var VIDEO_URL = 'https://videotourl.com/videos/1791884903568-c7254efa-ff1e-47d1-b8bc-fc07d85edf2f.mp4';

  function add() {
    var h = document.querySelector('h1[data-i="h1"]') || document.querySelector('h1');
    if (!h || document.getElementById('sk-vid')) return;

    var box = document.createElement('div');
    box.id = 'sk-vid';
    box.style.cssText =
      'width:100%;max-width:640px;aspect-ratio:16/9;margin:14px auto;' +
      'border:1px solid var(--bd);border-radius:18px;overflow:hidden;background:#000';
  
   var v = document.createElement('video');
v.src = VIDEO_URL + '#t=0.001';
v.muted = true;
v.setAttribute('muted', '');
v.autoplay = true;
v.loop = true;
v.playsInline = true;
v.setAttribute('playsinline', '');
v.preload = 'auto';
v.style.cssText = 'display:block;width:100%;height:100%;object-fit:contain;cursor:pointer';

var tip = document.createElement('div');
tip.textContent = 'Ketuk untuk putar dengan suara';
tip.style.cssText = 'position:absolute;left:10px;bottom:10px;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;pointer-events:none';

box.style.position = 'relative';
box.appendChild(v);
box.appendChild(tip);
h.insertAdjacentElement('afterend', box);

v.addEventListener('click', function () {
  v.muted = false;
  v.loop = false;
  v.controls = true;
  v.currentTime = 0;
  v.play();
  tip.remove();
}, { once: true });

var p = v.play();
if (p && p.catch) p.catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add);
  else add();
})();
// UPDATE: menu "Nexus" di Pengaturan, tepat di bawah "AI Asisten"
// Pencarian ala Google untuk TikTok: profil, bio, pengikut, mengikuti, teman, suka,
// caption, hashtag, video/foto, dan audio dari tautan. Data dari API tikwm.com.
// Tempel di paling bawah script.js, setelah baris 530 (penutup "})();" terakhir)

;(function () {
  var ITEM = 'sk-nx-item';
  var API = 'https://www.tikwm.com';
  var last = 0, token = 0, items = [], keepOverflow = '';

  /* ---------- alat bantu ---------- */
  function $(s) { return document.querySelector(s); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function letters(s) { return String(s).toLowerCase().replace(/[^a-z]/g, ''); }
  function abs(u) {
    if (!u) return '';
    if (u.indexOf('//') === 0) return 'https:' + u;
    return u.charAt(0) === '/' ? API + u : u;
  }
  function num(n) {
    n = Number(n) || 0;
    var u = [[1e9, ' M'], [1e6, ' jt'], [1e3, ' rb']];
    for (var i = 0; i < u.length; i++) {
      if (n >= u[i][0]) return (n / u[i][0]).toFixed(1).replace('.', ',').replace(/,0$/, '') + u[i][1];
    }
    return String(n);
  }
  function tags(t) {
    return (String(t || '').match(/#[^\s#]+/g) || []).map(function (x) {
      return x.replace(/[.,!?;:)\]]+$/, '');
    }).filter(function (x) { return x.length > 1; });
  }
  function msg(e) {
    var m = String((e && e.message) || '');
    if (/limit/i.test(m)) return 'Terlalu banyak permintaan. Tunggu beberapa detik, lalu coba lagi.';
    if (/url|pars/i.test(m)) return 'Link tidak dikenali. Periksa link TikTok-nya dan pastikan videonya tidak privat.';
    return 'Data tidak ditemukan atau gagal dimuat. Periksa koneksi, lalu coba lagi.';
  }

  /* ---------- data (API tikwm.com, diberi jeda karena ada limit per detik) ---------- */
  function call(path, params) {
    var wait = Math.max(0, last + 1100 - Date.now());
    last = Date.now() + wait;
    return new Promise(function (ok) { setTimeout(ok, wait); }).then(function () {
      return fetch(API + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: new URLSearchParams(params)
      });
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.code !== 0 || !j.data) throw new Error((j && j.msg) || 'kosong');
      return j.data;
    });
  }
  function api(path, params, n) {
    n = n || 0;
    return call(path, params).catch(function (e) {
      if (n >= 3 || !/limit/i.test(e.message)) throw e;
      return new Promise(function (ok) { setTimeout(ok, 1500 * (n + 1)); }).then(function () {
        return api(path, params, n + 1);
      });
    });
  }

  // Link video / link pendek -> post, link profil atau @username -> user, selain itu -> kata kunci
  function parse(q) {
    q = String(q || '').trim();
    var u = q.match(/https?:\/\/\S*tiktok\.com\S*/i);
    if (u) q = u[0];
    var m = q.match(/tiktok\.com\/@([\w.]+)\/?(?:[?#].*)?$/i);
    if (m) return { t: 'user', id: m[1] };
    if (/tiktok\.com/i.test(q)) return { t: 'post', url: /^https?:/i.test(q) ? q : 'https://' + q };
    if (/^@[\w.]{2,24}$/.test(q)) return { t: 'user', id: q.slice(1) };
    return q ? { t: 'find', q: q } : null;
  }

  /* ---------- tampilan: warna ikut tema situs, tidak mengubah elemen yang sudah ada ---------- */
  function theme() {
    function rgb(c) {
      var m = /^rgba?\(/i.test(c) ? String(c).match(/[\d.]+/g) : null;
      return m ? { r: +m[0], g: +m[1], b: +m[2], a: m.length > 3 ? +m[3] : 1 } : null;
    }
    var f = rgb(getComputedStyle(document.body).color);
    var b = rgb(getComputedStyle(document.body).backgroundColor);
    if (!b || b.a < 0.9) b = rgb(getComputedStyle(document.documentElement).backgroundColor);
    var dark = f ? (f.r * 299 + f.g * 587 + f.b * 114) / 1000 > 140 :
      !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    if (!b || b.a < 0.9) b = dark ? { r: 12, g: 12, b: 16 } : { r: 255, g: 255, b: 255 };
    if (!f) f = dark ? { r: 245, g: 245, b: 248 } : { r: 18, g: 18, b: 22 };
    return '--nx-bg:rgb(' + b.r + ',' + b.g + ',' + b.b + ');--nx-fg:rgb(' + f.r + ',' + f.g + ',' + f.b + ')';
  }

  var CSS = `
#sk-nx{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483000;display:flex;flex-direction:column;background:var(--nx-bg);color:var(--nx-fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--nx-bd:var(--bd,rgba(128,128,128,.32))}
#sk-nx *{box-sizing:border-box}
#sk-nx button,#sk-nx input{font:inherit}
#sk-nx button{color:inherit;cursor:pointer}
#sk-nx .sk-nx-top{display:flex;align-items:center;padding:calc(6px + env(safe-area-inset-top,0px)) 6px 6px 16px;border-bottom:1px solid var(--nx-bd)}
#sk-nx .sk-nx-top b{flex:1;font-size:17px}
#sk-nx .sk-nx-x{background:none;border:0;font-size:28px;line-height:1;padding:6px 14px}
#sk-nx .sk-nx-bar{display:flex;gap:8px;padding:12px}
#sk-nx .sk-nx-bar input{flex:1;min-width:0;padding:12px 18px;border-radius:999px;border:1px solid var(--nx-bd);background:rgba(128,128,128,.12);color:inherit;outline:0}
#sk-nx .sk-nx-bar input:focus{border-color:var(--nx-fg)}
#sk-nx .sk-nx-res{flex:1;overflow:auto;padding:0 12px 32px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
#sk-nx .sk-nx-dim{opacity:.65}
#sk-nx #sk-nx-st{margin:4px 2px 14px;font-size:14px}
#sk-nx #sk-nx-st.bad{opacity:1;color:#ff6b81}
#sk-nx .sk-nx-card{border:1px solid var(--nx-bd);border-radius:16px;padding:14px;margin-bottom:12px;background:rgba(128,128,128,.08)}
#sk-nx .sk-nx-who{display:flex;align-items:center;gap:12px}
#sk-nx .sk-nx-who img{width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none;background:rgba(128,128,128,.25)}
#sk-nx .sk-nx-who b{font-size:17px}
#sk-nx .sk-nx-v{display:inline-block;width:16px;height:16px;margin-left:6px;border-radius:50%;background:#20a5f5;color:#fff;font-size:11px;font-style:normal;line-height:16px;text-align:center;vertical-align:1px}
#sk-nx .sk-nx-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px;margin:14px 0 10px;text-align:center}
#sk-nx .sk-nx-stats b{display:block;font-size:16px}
#sk-nx .sk-nx-stats span{font-size:12px;opacity:.65}
#sk-nx .sk-nx-bio,#sk-nx .sk-nx-cap{margin:8px 0;white-space:pre-wrap;word-break:break-word}
#sk-nx .sk-nx-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
#sk-nx .sk-nx-b{display:inline-block;padding:9px 16px;border-radius:999px;border:1px solid var(--nx-bd);background:transparent;color:inherit;font-size:14px;font-weight:600;text-align:center;text-decoration:none}
#sk-nx .sk-nx-b.p{background:var(--nx-fg);border-color:var(--nx-fg);color:var(--nx-bg)}
#sk-nx .sk-nx-b:disabled{opacity:.6}
#sk-nx .sk-nx-note{margin-top:10px;font-size:12px}
#sk-nx .sk-nx-tags{margin:6px 0 2px}
#sk-nx .sk-nx-tags a{display:inline-block;margin:0 6px 6px 0;padding:3px 10px;border-radius:999px;background:rgba(128,128,128,.18);color:inherit;font-size:13px;text-decoration:none}
#sk-nx .sk-nx-meta{display:flex;flex-wrap:wrap;gap:4px 14px;margin:8px 0 12px;font-size:13px;opacity:.7}
#sk-nx video{display:block;width:100%;max-height:70vh;border-radius:12px;background:#000}
#sk-nx .sk-nx-au{margin-top:14px}
#sk-nx .sk-nx-au audio{display:block;width:100%;margin-top:6px}
#sk-nx .sk-nx-imgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:6px}
#sk-nx .sk-nx-ph{position:relative}
#sk-nx .sk-nx-ph img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:10px}
#sk-nx .sk-nx-ph button{position:absolute;right:6px;bottom:6px;width:34px;height:34px;border:0;border-radius:50%;background:rgba(0,0,0,.65);color:#fff}
#sk-nx .sk-nx-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
#sk-nx .sk-nx-tile{position:relative;padding:0;border:0;border-radius:10px;overflow:hidden;aspect-ratio:9/16;background:rgba(128,128,128,.2)}
#sk-nx .sk-nx-tile img{display:block;width:100%;height:100%;object-fit:cover}
#sk-nx .sk-nx-tile span{position:absolute;left:6px;bottom:5px;font-size:12px;color:#fff;text-shadow:0 1px 3px #000}
`;

  function injectCss() {
    if ($('#sk-nx-css')) return;
    var s = document.createElement('style');
    s.id = 'sk-nx-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function st(text, bad) {
    var el = $('#sk-nx-st');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'sk-nx-dim' + (bad ? ' bad' : '');
    el.style.display = text ? '' : 'none';
  }
  function stat(label, v) {
    return '<div><b>' + (v == null ? '-' : num(v)) + '</b><span>' + label + '</span></div>';
  }
  function dlBtn(label, url, name, main) {
    return '<button type="button" class="sk-nx-b' + (main ? ' p' : '') + '" data-dl="' + esc(url) +
      '" data-n="' + esc(name) + '">' + label + '</button>';
  }

  /* ---------- kartu profil ---------- */
  function prof(d) {
    var P = $('#sk-nx-prof');
    if (!P) return;
    var u = d.user || {}, s = d.stats || {}, id = u.uniqueId || '';
    var url = 'https://www.tiktok.com/@' + encodeURIComponent(id);
    P.setAttribute('data-u', id.toLowerCase());
    P.innerHTML =
      '<div class="sk-nx-card">' +
        '<div class="sk-nx-who">' +
          '<img referrerpolicy="no-referrer" alt="" src="' + esc(abs(u.avatarLarger || u.avatarMedium || u.avatarThumb)) + '">' +
          '<div><b>' + esc(u.nickname || id) + '</b>' + (u.verified ? '<i class="sk-nx-v">\u2713</i>' : '') +
          '<div class="sk-nx-dim">@' + esc(id) + (u.privateAccount ? ' \uD83D\uDD12' : '') + '</div></div>' +
        '</div>' +
        '<div class="sk-nx-stats">' +
          stat('Pengikut', s.followerCount) + stat('Mengikuti', s.followingCount) +
          stat('Teman', s.friendCount) + stat('Suka', s.heartCount != null ? s.heartCount : s.heart) +
          stat('Video', s.videoCount) +
        '</div>' +
        '<div class="sk-nx-bio' + (u.signature ? '' : ' sk-nx-dim') + '">' + (u.signature ? esc(u.signature) : 'Bio kosong') + '</div>' +
        '<div class="sk-nx-acts">' +
          '<a class="sk-nx-b p" target="_blank" rel="noopener" href="' + url + '">Ikuti di TikTok</a>' +
          '<a class="sk-nx-b" target="_blank" rel="noopener" href="' + url + '">Kirim pesan di TikTok</a>' +
          '<button type="button" class="sk-nx-b" data-copy="' + url + '">Salin link profil</button>' +
        '</div>' +
        '<div class="sk-nx-note sk-nx-dim">Ikuti dan kirim pesan dilakukan langsung di TikTok, perlu login akun kamu.</div>' +
      '</div>';
  }

  /* ---------- kartu postingan: caption, hashtag, video/foto, audio ---------- */
  function show(p) {
    var D = $('#sk-nx-det'), P = $('#sk-nx-prof');
    if (!p || !D) return;
    var my = token;
    var id = p.id || p.video_id || '', a = p.author || {}, cap = p.title || '';
    var ht = tags(cap), txt = cap.replace(/#[^\s#]+/g, '').replace(/\s+/g, ' ').trim();
    var imgs = (p.images || []).map(abs), mu = p.music_info || {};
    var au = abs(mu.play || p.music), hd = abs(p.hdplay), sd = abs(p.play);
    var when = p.create_time
      ? new Date(p.create_time * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    var h = '<div class="sk-nx-card">';
    if (a.unique_id) h += '<div class="sk-nx-dim">@' + esc(a.unique_id) + (a.nickname ? ' (' + esc(a.nickname) + ')' : '') + '</div>';
    h += '<div class="sk-nx-cap">' + (txt ? esc(txt) : '<span class="sk-nx-dim">Tanpa caption</span>') + '</div>';
    if (ht.length) {
      h += '<div class="sk-nx-tags">' + ht.map(function (x) {
        return '<a target="_blank" rel="noopener" href="https://www.tiktok.com/tag/' + encodeURIComponent(x.slice(1)) + '">' + esc(x) + '</a>';
      }).join('') + '</div>';
    }
    h += '<div class="sk-nx-meta">' + (when ? '<span>' + when + '</span>' : '') +
      '<span>\u25B6 ' + num(p.play_count) + '</span><span>\u2665 ' + num(p.digg_count) + '</span>' +
      '<span>\uD83D\uDCAC ' + num(p.comment_count) + '</span><span>\u21AA ' + num(p.share_count) + '</span>' +
      '<span>\uD83D\uDD16 ' + num(p.collect_count) + '</span></div>';
    if (imgs.length) {
      h += '<div class="sk-nx-imgs">' + imgs.map(function (u, i) {
        return '<div class="sk-nx-ph"><img loading="lazy" referrerpolicy="no-referrer" alt="" src="' + esc(u) + '">' +
          '<button type="button" aria-label="Unduh foto ' + (i + 1) + '" data-dl="' + esc(u) +
          '" data-n="nexus-' + esc(id) + '-' + (i + 1) + '.jpg">\u2B07</button></div>';
      }).join('') + '</div>';
    } else if (hd || sd) {
      h += '<video controls playsinline preload="metadata" poster="' + esc(abs(p.cover || p.origin_cover)) +
        '" src="' + esc(hd || sd) + '"></video>';
    }
    if (au) {
      h += '<div class="sk-nx-au"><b>\u266B ' + esc(mu.title || 'Audio') + '</b>' +
        (mu.author ? ' <span class="sk-nx-dim">' + esc(mu.author) + '</span>' : '') +
        '<audio controls preload="none" src="' + esc(au) + '"></audio></div>';
    }
    h += '<div class="sk-nx-acts">';
    if (!imgs.length && hd) h += dlBtn('Unduh video HD', hd, 'nexus-' + id + '-hd.mp4', true);
    if (!imgs.length && sd && sd !== hd) h += dlBtn('Unduh video', sd, 'nexus-' + id + '.mp4', !hd);
    if (au) h += dlBtn('Unduh audio MP3', au, 'nexus-' + id + '.mp3');
    h += '<button type="button" class="sk-nx-b" data-copy="' + esc(cap) + '">Salin caption</button></div></div>';
    D.innerHTML = h;
    var res = $('.sk-nx-res');
    if (res) res.scrollTop = 0;

    // profil pemilik postingan (pengikut, bio, dst.) dimuat menyusul
    var u = String(a.unique_id || '').toLowerCase();
    if (u && P && P.getAttribute('data-u') !== u) {
      P.setAttribute('data-u', u);
      P.innerHTML = '';
      api('/api/user/info', { unique_id: a.unique_id }).then(function (d) {
        if (my === token) prof(d);
      }).catch(function () {
        if (my === token) P.removeAttribute('data-u');
      });
    }
  }

  function grid(arr) {
    var L = $('#sk-nx-list');
    if (!L) return;
    items = arr;
    L.innerHTML = arr.length ? '<div class="sk-nx-grid">' + arr.map(function (p, i) {
      var photo = p.images && p.images.length;
      return '<button type="button" class="sk-nx-tile" data-i="' + i + '">' +
        '<img loading="lazy" referrerpolicy="no-referrer" alt="" src="' + esc(abs(p.cover || p.origin_cover)) + '">' +
        '<span>' + (photo ? '\uD83D\uDDBC ' : '\u25B6 ') + num(p.play_count) + '</span></button>';
    }).join('') + '</div>' : '';
  }

  /* ---------- pencarian ---------- */
  function run(q) {
    var k = parse(q);
    if (!k) return;
    var my = ++token;
    var ok = function () { return my === token; };
    var P = $('#sk-nx-prof'), D = $('#sk-nx-det'), L = $('#sk-nx-list');
    if (!P || !D || !L) return;
    P.innerHTML = D.innerHTML = L.innerHTML = '';
    P.removeAttribute('data-u');
    items = [];
    st('Mencari\u2026');
    var fail = function (e) { if (ok()) st(msg(e), true); };

    if (k.t === 'post') {
      api('/api/', { url: k.url, hd: 1, HD: 1 }).then(function (p) {
        if (ok()) { st(''); show(p); }
      }).catch(fail);
    } else if (k.t === 'user') {
      api('/api/user/info', { unique_id: k.id }).then(function (d) {
        if (!ok()) return;
        prof(d);
        st('Memuat video\u2026');
        return api('/api/user/posts', { unique_id: '@' + k.id, count: 12, cursor: 0, hd: 1 }).then(function (r) {
          if (!ok()) return;
          grid(r.videos || []);
          st(items.length ? '' : 'Belum ada video yang bisa ditampilkan.');
        });
      }).catch(fail);
    } else {
      api('/api/feed/search', { keywords: k.q, count: 12, cursor: 0, HD: 1 }).then(function (r) {
        if (!ok()) return;
        grid(r.videos || []);
        st(items.length ? '' : 'Tidak ada hasil untuk kata kunci ini.');
      }).catch(fail);
    }
  }

  /* ---------- unduh & salin ---------- */
  function save(url, name, btn) {
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Mengunduh\u2026';
    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('x');
      return r.blob();
    }).then(function (b) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
      btn.textContent = label;
    }).catch(function () {
      // server menolak unduhan langsung: tombol berubah jadi pembuka file di tab baru
      btn.removeAttribute('data-dl');
      btn.setAttribute('data-go', url);
      btn.textContent = label.length < 3 ? '\u2197' : 'Buka file di tab baru';
    }).then(function () { btn.disabled = false; });
  }
  function copy(text, btn) {
    var label = btn.textContent;
    var done = function () {
      btn.textContent = 'Tersalin';
      setTimeout(function () { btn.textContent = label; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    } else {
      var t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      t.remove();
    }
  }

  /* ---------- panel Nexus ---------- */
  function openNx() {
    closeNx();
    injectCss();
    var r = document.createElement('div');
    r.id = 'sk-nx';
    r.setAttribute('role', 'dialog');
    r.setAttribute('aria-label', 'Nexus');
    r.style.cssText = theme();
    r.innerHTML =
      '<div class="sk-nx-top"><b>Nexus</b><button type="button" class="sk-nx-x" data-x aria-label="Tutup">\u00D7</button></div>' +
      '<div class="sk-nx-bar"><input type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Link TikTok, @username, atau kata kunci">' +
      '<button type="button" class="sk-nx-b p" data-s>Cari</button></div>' +
      '<div class="sk-nx-res"><p id="sk-nx-st" class="sk-nx-dim"></p><div id="sk-nx-prof"></div><div id="sk-nx-det"></div><div id="sk-nx-list"></div></div>';
    var inp = r.querySelector('input');
    r.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-x],[data-s],[data-i],[data-dl],[data-go],[data-copy]') : null;
      if (!t) return;
      if (t.hasAttribute('data-x')) closeNx();
      else if (t.hasAttribute('data-s')) run(inp.value);
      else if (t.hasAttribute('data-i')) show(items[+t.getAttribute('data-i')]);
      else if (t.hasAttribute('data-dl')) save(t.getAttribute('data-dl'), t.getAttribute('data-n') || 'nexus', t);
      else if (t.hasAttribute('data-go')) window.open(t.getAttribute('data-go'), '_blank', 'noopener');
      else if (t.hasAttribute('data-copy')) copy(t.getAttribute('data-copy'), t);
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(inp.value); });
    r.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNx(); });
    document.body.appendChild(r);
    keepOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    st('Tempel link video atau profil TikTok, ketik @username, atau tulis kata kunci.');
    inp.focus();
  }
  function closeNx() {
    var r = document.getElementById('sk-nx');
    if (!r) return;
    token++;
    r.remove();
    document.documentElement.style.overflow = keepOverflow;
  }

  /* ---------- menu "Nexus" di Pengaturan (dipantau terus, sama seperti menu AI Asisten) ---------- */
  function findDeluxe() {
    var all = document.body.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
            if (/^(SCRIPT|STYLE|IFRAME|SELECT|OPTION|OPTGROUP)$/.test(el.tagName)) continue;
      var t = el.textContent;
      if (t.length < 40 && letters(t) === 'deluxe') return el;
    }
    return null;
  }
  function ensure() {
    var cur = document.getElementById(ITEM);
    var ai = document.querySelector('.sk-ai-btn:not(.sk-nx-btn)');
    var row = ai ? ai.parentNode : findDeluxe();
    if (!row) return;
    if (cur && cur.previousElementSibling === row) return;
    if (cur) cur.remove();
    var w = document.createElement(row.tagName === 'LI' ? 'li' : 'div');
    w.id = ITEM;
    w.style.cssText = 'grid-column:1/-1;list-style:none';
    w.innerHTML =
      '<button type="button" class="sk-ai-btn sk-nx-btn">' +
      '<span style="font-size:1.4em">\uD83D\uDD0E</span>' +
      '<span>Nexus</span>' +
      '<span class="sk-ai-go">\u203A</span></button>';
    w.firstChild.onclick = openNx;
    row.insertAdjacentElement('afterend', w);
  }

  function start() {
    var timer;
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(ensure, 150);
    }).observe(document.body, { childList: true, subtree: true });
    ensure();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
/*!
 * SaveTok Plus - koin, rank, premium 30 hari, mini game, gacha, kotak misteri, tantangan harian, terlaris.
 * Satu file, tanpa library. Data tersimpan di localStorage perangkat.
 *
 * Pasang  : tambahkan tag script dengan src="savetok-plus.js" dan atribut defer di index.html.
 * Posisi  : otomatis di bawah area utama. Atur lewat <div id="savetok-plus"> atau CFG.afterSelector.
 * Download: tiap unduhan dihitung otomatis lewat tombol yang cocok dengan CFG.downloadSelector.
 *           Kalau tombolmu beda, panggil  SaveTokPlus.onDownload({ id: 'idVideo' })  setelah unduhan sukses.
 * Toko    : sebelum fitur berbayar jalan, tanya dulu  if (!SaveTokPlus.use('hd')) return;
 *           kode item: 'hd', 'mp3', 'batch'.  Batas batch: SaveTokPlus.batchLimit().
 * Atur    : sebelum file ini dimuat, boleh tulis  window.SAVETOK_PLUS_CONFIG = { wmButton: '#btn-nowm', inputSelector: '#url' };
 * Puzzle  : isi CFG.wmButton dengan selector tombol "Download Tanpa Watermark" supaya terkunci sampai puzzle selesai,
 *           atau cek sendiri dengan SaveTokPlus.wmUnlocked().
 */
(function () {
  'use strict';
  if (window.SaveTokPlus) return;

  var DAY = 864e5, MIN = 6e4;
  var CFG = {
    hookId: 'savetok-plus',
    afterSelector: '',
    key: 'stp:v1',
    coinPerDownload: 10,
    xpPerDownload: 10,
    premiumDays: 30,
    prices: { hd: 30, mp3: 20, batch: 50 },        // harga tukar (koin); premium aktif = gratis
    batchBase: 10, batchMax: 50, batchRank: 45,    // Rank 45 membuka batch 50 video
    spinEvery: 3, boxEvery: 5,
    downloadSelector: 'a[download],[data-download],button[id*="download" i],button[class*="download" i],a[class*="download" i]',
    inputSelector: '',                             // kolom link downloader; kosong = ditebak otomatis
    wmButton: '',                                  // tombol "Download Tanpa Watermark" yang dikunci sampai puzzle selesai
    boardUrl: '',                                  // endpoint papan peringkat bersama (opsional, lihat CARA-PASANG.txt)
    api: 'https://www.tikwm.com/api/'
  };
  try { Object.assign(CFG, window.SAVETOK_PLUS_CONFIG || {}); } catch (e) {}   // atur tanpa mengedit file ini
  var RANKS = [[45, 'Deluxe Master'], [15, 'Elite Saver'], [1, 'Beginner Downloader']];
  var THEMES = [
    { id: 'mint', name: 'Neon Mint', r: 'Rare', c: '#10b981' },
    { id: 'sunset', name: 'Sunset', r: 'Rare', c: '#f97316' },
    { id: 'sakura', name: 'Sakura', r: 'Epic', c: '#ec4899' },
    { id: 'aurora', name: 'Aurora', r: 'Epic', c: '#8b5cf6' },
    { id: 'galaxy', name: 'Galaxy', r: 'Legendary', c: '#eab308' }
  ];
  var FILL = ['Original sound', 'Sped up version', 'Remix viral', 'Lofi chill beat', 'Dance challenge mix', 'Trending sound'];
  var TABS = [['sound', 'Tebak suara'], ['puzzle', 'Puzzle'], ['gacha', 'Gacha'], ['box', 'Kotak misteri'], ['daily', 'Tantangan'], ['top', 'Terlaris'], ['shop', 'Toko'], ['prem', 'Premium']];

  var D = load(), last = null, host = null, ov = null, dlg = null, bodyEl = null, tab = 'sound', prevFocus = null;
  var toastEl = null, toastT = 0, lastDl = { id: '', t: 0 }, paintSeq = 0;

  /* ---------- util ---------- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function btn(label, cls, fn, off) {
    var b = el('button', cls || 'stp-out', label);
    b.type = 'button';
    if (fn) b.onclick = fn;
    b.disabled = !!off;
    return b;
  }
  function para(t, cls) { return el('p', cls || 'stp-p', t); }
  function rand(n) { return Math.floor(Math.random() * n); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = rand(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function clip(s, n) { s = String(s || ''); n = n || 38; return s.length > n ? s.slice(0, n - 1) + '\u2026' : s; }
  function fmt(n) { try { return new Intl.NumberFormat('id-ID').format(n); } catch (e) { return String(n); } }
  function safeUrl(u) {
    if (!u) return '';
    try { var x = new URL(u, location.href); return /^https?:$/.test(x.protocol) ? x.href.replace(/^http:/, 'https:') : ''; } catch (e) { return ''; }
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function emit(n, d) { try { window.dispatchEvent(new CustomEvent(n, { detail: d })); } catch (e) {} }

  /* ---------- data ---------- */

  function load() {
    var d = {};
    try { d = JSON.parse(localStorage.getItem(CFG.key) || '{}') || {}; } catch (e) {}
    var first = !d.t0;
    d = Object.assign({ coins: 0, xp: 0, dl: 0, spins: 0, boxes: 0, till: 0, shared: 0, themes: [], theme: '', wm: 0, tok: { hd: 0, mp3: 0, batch: 0 }, board: { day: '', items: {} }, daily: null, heard: [], soundDone: '', code: '', ref: '' }, d);
    if (first) {                                   // kunjungan pertama: premium percobaan 30 hari
      d.t0 = Date.now();
      d.till = d.t0 + CFG.premiumDays * DAY;
      d.code = Math.random().toString(36).slice(2, 8);
    }
    try { var ref = new URLSearchParams(location.search).get('ref'); if (ref && !d.ref && ref !== d.code) d.ref = ref.slice(0, 12); } catch (e) {}
    return d;
  }
  function save() { try { localStorage.setItem(CFG.key, JSON.stringify(D)); } catch (e) {} }
  function prem() { return D.till > Date.now(); }
  function lvl(xp) {                               // kebutuhan XP naik tiap rank: 20 + 8 x rank
    var n = 1, need = 28;
    while (xp >= need) { xp -= need; n++; need = 20 + 8 * n; }
    return { n: n, into: xp, need: need };
  }
  function rankName(n) { for (var i = 0; i < RANKS.length; i++) if (n >= RANKS[i][0]) return RANKS[i][1]; return RANKS[RANKS.length - 1][1]; }
  function rank() { return lvl(D.xp).n; }

  /* ---------- notifikasi ---------- */

  function toast(msg) {
    if (!toastEl) {
      toastEl = el('div', 'stp-toast');
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2800);
  }

  /* ---------- jaringan (tikwm) ---------- */

  async function api(path, params) {
    var qs = Object.keys(params).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    var url = CFG.api + path + '?' + qs;
    var routes = [url, 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url)], last = null;
    for (var i = 0; i < routes.length; i++) {
      for (var n = 0; n < 2; n++) {
        var j;
        try { var r = await fetch(routes[i]); if (!r.ok) throw new Error('http'); j = await r.json(); } catch (e) { last = e; break; }
        if (j && j.code === 0 && j.data) return j.data;
        if (/limit/i.test(String(j && j.msg))) { last = new Error('rate'); await sleep(1300); continue; }
        throw new Error('api');
      }
    }
    throw last || new Error('network');
  }
  async function feed() {
    var d = await api('feed/list', { region: 'ID', count: 20 });
    var a = (Array.isArray(d) ? d : d.videos || []).map(function (v) {
      var au = v.author && (v.author.unique_id || v.author.uniqueId) || '', id = String(v.video_id || v.id || '');
      return { id: id, title: v.title || '', author: au, cover: safeUrl(v.cover || v.origin_cover), plays: Number(v.play_count) || 0, url: au && id ? 'https://www.tiktok.com/@' + au + '/video/' + id : '' };
    }).filter(function (v) { return v.id && v.url; });
    if (!a.length) throw new Error('empty');
    return a;
  }

  /* belajar dari video yang sedang diproses downloader (tanpa mengubah responsnya) */
  function learn(j) {
    var d = j && j.code === 0 && j.data;
    if (!d || !d.id) return;
    var mi = d.music_info || {};
    last = { id: String(d.id), title: d.title || '', author: (d.author && (d.author.unique_id || d.author.uniqueId)) || '', cover: safeUrl(d.cover || d.origin_cover), music: safeUrl(d.music || mi.play), musicTitle: mi.title || '' };
    if (last.musicTitle && D.heard.indexOf(last.musicTitle) < 0) { D.heard.unshift(last.musicTitle); D.heard.length = Math.min(D.heard.length, 12); save(); }
  }
  if (window.fetch) {
    var rawFetch = window.fetch;
    window.fetch = function (input) {
      var p = rawFetch.apply(this, arguments);
      try {
        var x = new URL(typeof input === 'string' ? input : (input && input.url) || '', location.href);
        if (/(^|\.)tikwm\.com$/.test(x.hostname) && /^\/api\/?$/.test(x.pathname)) p.then(function (r) { return r.clone().json(); }).then(learn).catch(function () {});
      } catch (e) {}
      return p;
    };
  }

  /* ---------- ekonomi ---------- */

  function onDownload(info) {
    info = info || {};
    var v = info.id ? info : (last || {}), id = String(v.id || ''), now = Date.now();
    if (now - lastDl.t < 3000 || (id && id === lastDl.id && now - lastDl.t < 20000)) return false;   // cegah hitung ganda
    lastDl = { id: id, t: now };
    var before = rank();
    D.dl++; D.xp += CFG.xpPerDownload; D.coins += CFG.coinPerDownload;
    var msg = '+' + CFG.coinPerDownload + ' koin dari download';
    if (D.dl % CFG.spinEvery === 0) { D.spins++; msg += ', +1 tiket gacha'; }
    if (D.dl % CFG.boxEvery === 0) { D.boxes++; msg += ', +1 kotak misteri'; }
    var today_ = today();
    if (D.board.day !== today_) D.board = { day: today_, items: {} };
    if (id) {
      var it = D.board.items[id] || (D.board.items[id] = { n: 0, title: v.title || '', author: v.author || '' });
      it.n++;
      if (CFG.boardUrl) { try { fetch(CFG.boardUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: id, title: it.title, author: it.author }) }).catch(function () {}); } catch (e) {} }
    }
    if (D.daily && D.daily.day === today_ && !D.daily.done && id && id === String(D.daily.id)) { D.daily.done = true; D.coins += 50; msg += ', tantangan harian selesai +50 koin'; }
    var now_ = rank();
    if (now_ > before) msg += '. Naik ke Rank ' + now_ + ' (' + rankName(now_) + ')' + (before < CFG.batchRank && now_ >= CFG.batchRank ? ', batch ' + CFG.batchMax + ' video terbuka' : '');
    save(); toast(msg); draw(); emit('stp:download', { dl: D.dl, coins: D.coins, rank: now_ });
    return true;
  }
  function cost(item) { return prem() ? 0 : CFG.prices[item]; }
  function use(item) {                             // dipanggil sebelum fitur berbayar jalan
    if (CFG.prices[item] == null) return false;
    if (prem()) return true;
    if (D.tok[item] > 0) { D.tok[item]--; save(); draw(); return true; }
    toast('Tukar ' + CFG.prices[item] + ' koin di Toko untuk memakai fitur ini.');
    open('shop');
    return false;
  }
  function buy(item) {
    var c = CFG.prices[item];
    if (D.coins < c) { toast('Koin kurang ' + (c - D.coins) + '.'); return; }
    D.coins -= c; D.tok[item]++; save(); draw(); toast('Berhasil ditukar. Kamu punya ' + D.tok[item] + ' jatah.'); paint();
  }
  function batchLimit() { return rank() >= CFG.batchRank ? CFG.batchMax : CFG.batchBase; }
  function wmUnlocked() { return D.wm > Date.now() || prem(); }

  function setTheme(id) {
    var t = THEMES.filter(function (x) { return x.id === id; })[0];
    var s = document.documentElement.style;
    if (!t) { ['--accent', '--tkc-accent', '--stp-accent'].forEach(function (k) { s.removeProperty(k); }); document.documentElement.removeAttribute('data-stp-theme'); D.theme = ''; }
    else { ['--accent', '--tkc-accent', '--stp-accent'].forEach(function (k) { s.setProperty(k, t.c); }); document.documentElement.setAttribute('data-stp-theme', t.id); D.theme = t.id; }
    save();
  }

  async function share() {
    var url = location.origin + location.pathname + '?ref=' + D.code, ok = false;
    try {
      if (navigator.share) { await navigator.share({ title: 'SaveTok', text: 'Download video TikTok tanpa watermark di SaveTok', url: url }); ok = true; }
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); ok = true; toast('Link disalin. Kirim ke temanmu.'); }
    } catch (e) { ok = false; }
    if (!ok) return;
    var now = Date.now();
    if (now - D.shared < CFG.premiumDays * DAY) { toast('Bonus premium dari berbagi bisa diambil sekali tiap 30 hari.'); return; }
    if (D.till > now + 3 * DAY) { toast('Premium kamu masih aktif. Bagikan lagi menjelang habis.'); return; }
    D.till = Math.max(D.till, now) + CFG.premiumDays * DAY; D.shared = now; save(); draw(); paint();
    toast('Premium diperpanjang 30 hari. Terima kasih sudah berbagi!');
  }

  /* ---------- panel di halaman ---------- */

  function draw() {
    if (!host) return;
    var l = lvl(D.xp), now = Date.now();
    var s = el('section', 'stp');
    s.setAttribute('aria-label', 'Hadiah SaveTok');
    var top = el('div', 'stp-top'), who = el('div', 'stp-who');
    who.appendChild(el('b', '', 'Rank ' + l.n));
    who.appendChild(el('span', '', rankName(l.n)));
    var c = el('div', 'stp-coins');
    c.appendChild(el('b', '', fmt(D.coins)));
    c.appendChild(el('span', '', ' koin'));
    top.appendChild(who); top.appendChild(c); s.appendChild(top);
    var bar = el('div', 'stp-bar'), fill = el('i');
    bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-label', 'XP menuju rank berikutnya');
    bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', String(l.need)); bar.setAttribute('aria-valuenow', String(l.into));
    fill.style.width = Math.round(l.into / l.need * 100) + '%';
    bar.appendChild(fill); s.appendChild(bar);
    s.appendChild(para(D.till > now ? 'Premium aktif, sisa ' + Math.max(1, Math.ceil((D.till - now) / DAY)) + ' hari. Semua item Toko gratis.' : 'Premium habis. Bagikan SaveTok ke teman untuk 30 hari lagi.', 'stp-sub'));
    var acts = el('div', 'stp-acts');
    TABS.forEach(function (t) {
      var label = t[1] + (t[0] === 'gacha' && D.spins ? ' (' + D.spins + ')' : '') + (t[0] === 'box' && D.boxes ? ' (' + D.boxes + ')' : '');
      acts.appendChild(btn(label, 'stp-out', function () { open(t[0]); }));
    });
    s.appendChild(acts);
    host.textContent = '';
    host.appendChild(s);
    applyWm();
  }

  /* ---------- jendela game/toko ---------- */

  function pageColors() {
    var bg = 'rgb(255,255,255)', fg = 'rgb(20,22,26)';
    try {
      var b = getComputedStyle(document.body), h = getComputedStyle(document.documentElement);
      var pick = [b.backgroundColor, h.backgroundColor].filter(function (x) { return x && !/rgba?\(.*,\s*0\)$/.test(x) && x !== 'transparent'; })[0];
      if (pick) bg = pick;
      fg = b.color || fg;
    } catch (e) {}
    return { bg: bg, fg: fg };
  }

  function open(t) {
    tab = t || tab;
    if (!ov) {
      prevFocus = document.activeElement;
      ov = el('div', 'stp-ov');
      dlg = el('div', 'stp-dlg');
      dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', 'Hadiah SaveTok');
      ov.appendChild(dlg);
      ov.onclick = function (e) { if (e.target === ov) close(); };
      document.addEventListener('keydown', onKey, true);
      document.body.appendChild(ov);
    }
    paint(true);
  }
  function onKey(e) {
    if (!ov) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = [].slice.call(dlg.querySelectorAll('button:not(:disabled),a[href],input,[tabindex="0"]'));
    if (!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if (!dlg.contains(document.activeElement)) { e.preventDefault(); a.focus(); }
    else if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
  function close() {
    if (!ov) return;
    paintSeq++;
    document.removeEventListener('keydown', onKey, true);
    ov.remove(); ov = dlg = bodyEl = null;
    if (prevFocus && prevFocus.focus && prevFocus.isConnected) prevFocus.focus();
  }

  function paint(focus) {
    if (!ov) return;
    var seq = ++paintSeq, pc = pageColors();
    var had = dlg.contains(document.activeElement);
    dlg.style.background = pc.bg; dlg.style.color = pc.fg;
    dlg.textContent = '';
    var head = el('div', 'stp-head');
    head.appendChild(el('b', 'stp-bal', fmt(D.coins) + ' koin'));
    var x = btn('Tutup', 'stp-out stp-x', close);
    head.appendChild(x);
    dlg.appendChild(head);
    var nav = el('div', 'stp-tabs');
    nav.setAttribute('role', 'tablist');
    TABS.forEach(function (t) {
      var b = el('button', 'stp-tab' + (t[0] === tab ? ' on' : ''), t[1]);
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', t[0] === tab ? 'true' : 'false');
      b.onclick = function () { tab = t[0]; paint(); };
      nav.appendChild(b);
    });
    dlg.appendChild(nav);
    var cur = nav.querySelector('.on');                       // tab aktif selalu terlihat di baris tab
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ inline: 'center', block: 'nearest' });
    bodyEl = el('div', 'stp-body');
    bodyEl.setAttribute('role', 'tabpanel');
    dlg.appendChild(bodyEl);
    var fn = { sound: tabSound, puzzle: tabPuzzle, gacha: tabGacha, box: tabBox, daily: tabDaily, top: tabTop, shop: tabShop, prem: tabPrem }[tab];
    if (fn) fn(bodyEl, function () { return seq === paintSeq && !!ov; });
    if (focus) x.focus(); else if (had) (dlg.querySelector('.stp-tab.on') || x).focus();
  }

  /* --- tebak suara --- */
  function tabSound(b) {
    if (!last || !last.music) { b.appendChild(para('Tempel link video TikTok di downloader dulu. Suara videonya dipakai untuk tebakan: dengarkan 1 detik awal, lalu pilih judulnya.')); return; }
    if (D.soundDone === last.id) { b.appendChild(para('Tebakan untuk video ini sudah dipakai. Unduh video lain untuk main lagi.')); return; }
    var right = clip(last.musicTitle || 'Original sound');
    var pool = shuffle(D.heard.concat(FILL).map(function (x) { return clip(x); }).filter(function (x, i, a) { return x !== right && a.indexOf(x) === i; })).slice(0, 3);
    var opts = shuffle([right].concat(pool));
    b.appendChild(para('Dengarkan 1 detik awal suara video yang baru kamu proses. Benar dapat 20 koin.'));
    var plays = 0, au = new Audio(last.music), msg = el('p', 'stp-res');
    var play = btn('Putar 1 detik (3x)', 'stp-btn', function () {
      if (plays >= 3) return;
      plays++; play.textContent = plays >= 3 ? 'Putaran habis' : 'Putar lagi (' + (3 - plays) + ')'; play.disabled = plays >= 3;
      try { au.currentTime = 0; var p = au.play(); if (p && p.catch) p.catch(function () { msg.textContent = 'Audio tidak bisa diputar di perangkat ini.'; }); setTimeout(function () { au.pause(); }, 1000); } catch (e) {}
    });
    b.appendChild(play);
    var list = el('div', 'stp-opts');
    opts.forEach(function (o) {
      list.appendChild(btn(o, 'stp-out', function () {
        D.soundDone = last.id;
        [].forEach.call(list.children, function (c) { c.disabled = true; });
        au.pause();
        if (o === right) { D.coins += 20; msg.textContent = 'Benar! +20 koin.'; } else { msg.textContent = 'Belum tepat. Jawabannya: ' + right + '.'; }
        save(); draw(); var bal = dlg && dlg.querySelector('.stp-bal'); if (bal) bal.textContent = fmt(D.coins) + ' koin';
      }));
    });
    b.appendChild(list); b.appendChild(msg);
  }

  /* --- puzzle geser 3x3 --- */
  function nbrs(i) { var r = (i / 3) | 0, c = i % 3, o = []; if (r > 0) o.push(i - 3); if (r < 2) o.push(i + 3); if (c > 0) o.push(i - 1); if (c < 2) o.push(i + 1); return o; }
  function solved(t) { for (var i = 0; i < 8; i++) if (t[i] !== i + 1) return false; return t[8] === 0; }
  function tabPuzzle(b) {
    if (wmUnlocked() && !prem()) b.appendChild(para('Tombol Download Tanpa Watermark masih terbuka. Sisa ' + Math.max(1, Math.ceil((D.wm - Date.now()) / MIN)) + ' menit.', 'stp-ok'));
    if (prem()) b.appendChild(para('Premium aktif: tombol tanpa watermark sudah terbuka tanpa puzzle. Kamu tetap bisa main untuk koin.', 'stp-ok'));
    b.appendChild(para('Geser kotak ke ruang kosong sampai gambar utuh. Selesai = tombol Download Tanpa Watermark terbuka 10 menit + 5 koin.'));
    var t, z, prev, done = false, t0 = Date.now();
    do {
      t = [1, 2, 3, 4, 5, 6, 7, 8, 0]; z = 8; prev = -1;
      for (var k = 0; k < 8; k++) { var c = nbrs(z).filter(function (x) { return x !== prev; }), m = c[rand(c.length)]; t[z] = t[m]; t[m] = 0; prev = z; z = m; }
    } while (solved(t));
    var grid = el('div', 'stp-grid'), msg = el('p', 'stp-res');
    var img = last && last.cover;
    function drawGrid() {
      grid.textContent = '';
      t.forEach(function (v, i) {
        var cell = el('button', 'stp-tile' + (v ? '' : ' empty'), v ? String(v) : '');
        cell.type = 'button';
        cell.setAttribute('aria-label', v ? 'Kotak ' + v : 'Ruang kosong');
        if (v) {
          if (img) { cell.style.backgroundImage = 'url("' + img + '")'; cell.style.backgroundSize = '300% 300%'; cell.style.backgroundPosition = (((v - 1) % 3) * 50) + '% ' + (((v - 1) / 3 | 0) * 50) + '%'; }
          cell.onclick = function () {
            if (done || nbrs(i).indexOf(t.indexOf(0)) < 0) return;
            var e = t.indexOf(0); t[e] = v; t[i] = 0; drawGrid();
            if (solved(t)) {
              done = true; D.wm = Date.now() + 10 * MIN; D.coins += 5; save(); draw(); applyWm();
              msg.textContent = 'Selesai dalam ' + Math.max(1, Math.round((Date.now() - t0) / 1000)) + ' detik. Tombol tanpa watermark terbuka 10 menit, +5 koin.';
              var bal = dlg && dlg.querySelector('.stp-bal'); if (bal) bal.textContent = fmt(D.coins) + ' koin';
              emit('stp:wm-unlocked', { until: D.wm });
            }
          };
        }
        grid.appendChild(cell);
      });
    }
    drawGrid();
    b.appendChild(grid); b.appendChild(msg);
    b.appendChild(btn('Acak ulang', 'stp-out', function () { tabReset(); }));
    function tabReset() { paint(); }
  }
  function applyWm() {
    if (!CFG.wmButton) return;
    try {
      var on = wmUnlocked();
      [].forEach.call(document.querySelectorAll(CFG.wmButton), function (n) {
        n.setAttribute('aria-disabled', on ? 'false' : 'true');
        n.title = on ? '' : 'Selesaikan puzzle untuk membuka tombol ini';
        n.classList.toggle('stp-locked', !on);
      });
    } catch (e) {}
  }

  /* --- gacha tema premium --- */
  function roll() {
    var r = Math.random();
    if (r < 0.5) return { coins: 15 };
    var pool = THEMES.filter(function (t) { return t.r === (r < 0.8 ? 'Rare' : r < 0.95 ? 'Epic' : 'Legendary'); });
    return { theme: pool[rand(pool.length)] };
  }
  function tabGacha(b) {
    b.appendChild(para('Tiket gacha: ' + D.spins + '. Kamu dapat 1 tiket tiap ' + CFG.spinEvery + ' download. Hadiah: koin atau tema premium (Rare, Epic, Legendary).'));
    var res = el('div', 'stp-slot', '?'), msg = el('p', 'stp-res');
    res.setAttribute('aria-live', 'polite');
    var go = btn('Putar gacha', 'stp-btn', function () {
      if (D.spins < 1) return;
      D.spins--; save(); go.disabled = true; msg.textContent = '';
      var i = 0, iv = setInterval(function () { res.textContent = THEMES[i++ % THEMES.length].name; }, 90);
      setTimeout(function () {
        clearInterval(iv);
        var g = roll(), text;
        if (g.coins) { D.coins += g.coins; text = '+' + g.coins + ' koin'; res.textContent = text; }
        else if (D.themes.indexOf(g.theme.id) >= 0) { D.coins += 20; text = g.theme.name + ' sudah kamu punya, diganti 20 koin'; res.textContent = g.theme.name; }
        else { D.themes.push(g.theme.id); setTheme(g.theme.id); text = 'Tema baru: ' + g.theme.name + ' (' + g.theme.r + '), langsung dipakai'; res.textContent = g.theme.name; }
        msg.textContent = text; save(); draw();
        var bal = dlg && dlg.querySelector('.stp-bal'); if (bal) bal.textContent = fmt(D.coins) + ' koin';
        setTimeout(function () { if (ov && tab === 'gacha') paint(); }, 1800);
      }, 1100);
    }, D.spins < 1);
    b.appendChild(res); b.appendChild(go); b.appendChild(msg);
    if (D.themes.length) {
      b.appendChild(para('Tema milikmu:', 'stp-h'));
      var list = el('div', 'stp-opts');
      list.appendChild(btn('Bawaan' + (D.theme === '' ? ' (dipakai)' : ''), 'stp-out', function () { setTheme(''); paint(); }));
      THEMES.filter(function (t) { return D.themes.indexOf(t.id) >= 0; }).forEach(function (t) {
        list.appendChild(btn(t.name + ' (' + t.r + ')' + (D.theme === t.id ? ' (dipakai)' : ''), 'stp-out', function () { setTheme(t.id); paint(); }));
      });
      b.appendChild(list);
    }
  }

  /* --- kotak misteri & tantangan --- */
  function fillInput(url) {
    var inp = null;
    try { inp = (CFG.inputSelector && document.querySelector(CFG.inputSelector)) || document.querySelector('main input[type="url"],main input[type="text"],input[type="url"],input[type="text"]'); } catch (e) {}
    if (!inp) { try { navigator.clipboard.writeText(url); } catch (e) {} toast('Link disalin. Tempel di kolom downloader.'); close(); return; }
    inp.value = url;
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
    close(); inp.focus();
    toast('Link diisi ke kolom downloader. Tekan tombol unduh.');
  }
  function videoCard(v) {
    var c = el('div', 'stp-vid');
    if (v.cover) { var i = el('img'); i.alt = ''; i.referrerPolicy = 'no-referrer'; i.src = v.cover; c.appendChild(i); }
    var t = el('div', 'stp-vt');
    t.appendChild(el('b', '', clip(v.title || 'Video TikTok', 70)));
    t.appendChild(el('span', '', (v.author ? '@' + v.author : '') + (v.plays ? '  ' + fmt(v.plays) + ' tayangan' : '')));
    c.appendChild(t);
    var a = el('div', 'stp-opts');
    a.appendChild(btn('Isi ke kolom download', 'stp-btn', function () { fillInput(v.url); }));
    var l = el('a', 'stp-out', 'Buka di TikTok'); l.href = v.url; l.target = '_blank'; l.rel = 'noopener noreferrer';
    a.appendChild(l); c.appendChild(a);
    return c;
  }
  function tabBox(b, alive) {
    b.appendChild(para('Kotak misteri: ' + D.boxes + '. Kamu dapat 1 kotak tiap ' + CFG.boxEvery + ' download. Isinya satu video viral acak yang tidak kamu cari, plus 15 koin.'));
    var out = el('div'), msg = el('p', 'stp-res');
    var go = btn('Buka kotak', 'stp-btn', async function () {
      if (D.boxes < 1) return;
      go.disabled = true; msg.textContent = 'Membuka kotak...';
      try {
        var all = await feed(), v = all[rand(all.length)];
        if (!alive()) return;
        D.boxes--; D.coins += 15; save(); draw();
        msg.textContent = 'Isi kotak: video viral hari ini. +15 koin.';
        out.textContent = ''; out.appendChild(videoCard(v));
        var bal = dlg && dlg.querySelector('.stp-bal'); if (bal) bal.textContent = fmt(D.coins) + ' koin';
      } catch (e) { if (alive()) { msg.textContent = 'Gagal memuat video acak. Kotak tidak terpakai, coba lagi nanti.'; go.disabled = D.boxes < 1; } }
    }, D.boxes < 1);
    b.appendChild(go); b.appendChild(msg); b.appendChild(out);
  }
  function tabDaily(b, alive) {
    b.appendChild(para('Tantangan hari ini: download video di bawah ini dan edit jadi versi kamu. Selesai saat video itu terunduh: +50 koin.'));
    var out = el('div');
    b.appendChild(out);
    var show = function () {
      var d = D.daily;
      out.textContent = '';
      out.appendChild(videoCard({ id: d.id, title: d.title, author: d.author, cover: d.cover, url: d.url }));
      out.appendChild(para(d.done ? 'Tantangan hari ini sudah selesai. Kembali lagi besok.' : 'Belum selesai. Unduh video ini untuk klaim 50 koin.', d.done ? 'stp-ok' : 'stp-p'));
    };
    if (D.daily && D.daily.day === today()) { show(); return; }
    out.appendChild(para('Memuat tantangan...'));
    feed().then(function (all) {
      var v = all[rand(all.length)];
      D.daily = { day: today(), id: v.id, title: v.title, author: v.author, cover: v.cover, url: v.url, done: false };
      save();
      if (alive()) show();
    }).catch(function () { if (alive()) { out.textContent = ''; out.appendChild(para('Gagal memuat tantangan. Coba buka lagi sebentar lagi.')); } });
  }

  /* --- terlaris --- */
  function tabTop(b, alive) {
    var local = Object.keys(D.board.items || {}).filter(function () { return D.board.day === today(); }).map(function (k) { var x = D.board.items[k]; return { id: k, title: x.title, author: x.author, n: x.n }; });
    var listEl = el('ol', 'stp-top5');
    function fill(rows, label) {
      b.insertBefore(para(label, 'stp-h'), listEl);
      listEl.textContent = '';
      if (!rows.length) { listEl.appendChild(el('li', '', 'Belum ada unduhan hari ini.')); return; }
      rows.sort(function (a, z) { return z.n - a.n; }).slice(0, 5).forEach(function (r) {
        listEl.appendChild(el('li', '', clip(r.title || ('Video ' + r.id), 60) + (r.author ? ' (@' + r.author + ')' : '') + ': ' + r.n + 'x'));
      });
    }
    b.appendChild(listEl);
    fill(local, 'Video paling banyak diunduh hari ini di perangkat ini');
    if (CFG.boardUrl) {
      fetch(CFG.boardUrl).then(function (r) { return r.json(); }).then(function (rows) {
        if (!alive() || !Array.isArray(rows)) return;
        b.querySelector('.stp-h').remove();
        fill(rows.map(function (x) { return { id: x.id, title: x.title, author: x.author, n: Number(x.n) || 0 }; }), 'Video paling banyak diunduh hari ini di SaveTok');
      }).catch(function () {});
    } else {
      b.appendChild(para('Papan ini baru menghitung unduhan di perangkatmu. Untuk papan bersama semua pengguna, isi CFG.boardUrl (lihat CARA-PASANG.txt).', 'stp-note'));
    }
  }

  /* --- toko --- */
  function tabShop(b) {
    var pr = prem();
    b.appendChild(para(pr ? 'Premium aktif: semua item di bawah gratis. Tidak perlu menukar koin.' : 'Tukar koin dengan jatah pakai. Tiap unduhan memberi ' + CFG.coinPerDownload + ' koin.', pr ? 'stp-ok' : 'stp-p'));
    [['hd', 'Download HD', 'Kualitas video tertinggi'], ['mp3', 'Download MP3 saja', 'Ambil audionya saja'], ['batch', 'Hapus watermark batch', 'Beberapa video sekaligus']].forEach(function (x) {
      var row = el('div', 'stp-row');
      var t = el('div'); t.appendChild(el('b', '', x[1])); t.appendChild(el('span', 'stp-note', x[2] + '. Jatah: ' + (D.tok[x[0]] || 0)));
      row.appendChild(t);
      row.appendChild(btn(pr ? 'Gratis' : 'Tukar ' + CFG.prices[x[0]] + ' koin', 'stp-btn', function () { buy(x[0]); }, pr || D.coins < CFG.prices[x[0]]));
      b.appendChild(row);
    });
    b.appendChild(para('Batch maksimal sekarang ' + batchLimit() + ' video. Capai Rank ' + CFG.batchRank + ' (' + rankName(CFG.batchRank) + ') untuk batch ' + CFG.batchMax + ' video sekaligus.', 'stp-note'));
  }

  /* --- premium & bagikan --- */
  function tabPrem(b) {
    var now = Date.now(), pr = D.till > now;
    b.appendChild(para(pr ? 'Premium aktif sampai ' + new Date(D.till).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + '.' : 'Premium sudah habis.', pr ? 'stp-ok' : 'stp-p'));
    b.appendChild(para('Premium berlaku 30 hari: semua item Toko gratis dan tombol tanpa watermark terbuka. Untuk dapat premium 30 hari lagi, bagikan SaveTok ke temanmu (berlaku saat premium habis atau tinggal 3 hari, sekali tiap 30 hari).'));
    b.appendChild(btn('Bagikan ke teman', 'stp-btn', share));
    b.appendChild(para('Link ajakanmu: ' + location.origin + location.pathname + '?ref=' + D.code, 'stp-note'));
  }

  /* ---------- posisi & gaya ---------- */

  function css() {
    if (document.getElementById('stp-style')) return;
    var s = el('style');
    s.id = 'stp-style';
    s.textContent = [
      '.stp-host{box-sizing:border-box;display:block;width:100%;margin:24px 0 0}',
      '.stp-host--page{max-width:720px;margin:24px auto 0;padding:0 16px}',
      '.stp,.stp *,.stp-dlg,.stp-dlg *{box-sizing:border-box}',
      '.stp,.stp-dlg{--stp-a:var(--stp-accent,var(--tkc-accent,#e11d48));--stp-l:rgba(127,127,127,.3)}',
      '.stp{padding:18px;border:1px solid var(--stp-l);border-radius:14px;background:rgba(127,127,127,.06);color:inherit;font:inherit;line-height:1.45}',
      '.stp button,.stp-dlg button{font-family:inherit}',
      '.stp-top{display:flex;justify-content:space-between;align-items:baseline;gap:12px}',
      '.stp-who b{display:block;font-size:1.1rem}.stp-who span{font-size:.88rem;opacity:.75}',
      '.stp-coins{white-space:nowrap}.stp-coins b{font-size:1.2rem;font-variant-numeric:tabular-nums}.stp-coins span{opacity:.75;font-size:.9rem}',
      '.stp-bar{height:8px;margin:12px 0 0;border-radius:99px;background:rgba(127,127,127,.25);overflow:hidden}',
      '.stp-bar i{display:block;height:100%;background:var(--stp-a);border-radius:99px;transition:width .3s}',
      '.stp-sub{margin:10px 0 0;font-size:.88rem;opacity:.8}',
      '.stp-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}',
      '.stp-btn,.stp-out{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 14px;border-radius:10px;font-size:.9rem;font-weight:600;line-height:1.2;text-align:center;text-decoration:none;cursor:pointer}',
      '.stp-btn{border:1px solid var(--stp-a);background:var(--stp-a);color:#fff}',
      '.stp-out{border:1px solid var(--stp-l);background:transparent;color:inherit}',
      '.stp-btn:disabled,.stp-out:disabled{opacity:.5;cursor:not-allowed}',
      '.stp-btn:focus-visible,.stp-out:focus-visible,.stp-tab:focus-visible,.stp-tile:focus-visible{outline:2px solid var(--stp-a);outline-offset:2px}',
      '.stp-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.55)}',
      '.stp-dlg{width:100%;max-width:560px;max-height:90vh;overflow:auto;padding:16px;border-radius:18px 18px 0 0;font:inherit;line-height:1.45}',
      '@media (min-width:640px){.stp-ov{align-items:center}.stp-dlg{border-radius:18px}}',
      '.stp-head{display:flex;justify-content:space-between;align-items:center;gap:12px}',
      '.stp-bal{font-size:1.1rem;font-variant-numeric:tabular-nums}',
      '.stp-tabs{display:flex;gap:6px;margin:12px -4px 0;padding:0 4px 8px;overflow-x:auto;border-bottom:1px solid var(--stp-l)}',
      '.stp-tab{flex:none;min-height:40px;padding:0 12px;border:0;border-radius:99px;background:transparent;color:inherit;font-size:.88rem;cursor:pointer;opacity:.75}',
      '.stp-tab.on{background:var(--stp-a);color:#fff;opacity:1;font-weight:600}',
      '.stp-body{padding-top:14px}.stp-p,.stp-ok,.stp-note,.stp-res,.stp-h{margin:0 0 12px}',
      '.stp-note{font-size:.82rem;opacity:.7}.stp-ok{font-weight:600}.stp-h{font-weight:700}',
      '.stp-opts{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}',
      '.stp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:min(100%,300px);margin:12px auto}',
      '.stp-tile{aspect-ratio:1;border:0;border-radius:8px;background:var(--stp-a) center/cover;color:#fff;font-size:1.2rem;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.7);cursor:pointer}',
      '.stp-tile.empty{background:rgba(127,127,127,.18);cursor:default}',
      '.stp-slot{display:grid;place-items:center;min-height:84px;margin:12px 0;border:1px dashed var(--stp-l);border-radius:12px;font-size:1.3rem;font-weight:700;text-align:center}',
      '.stp-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--stp-l)}',
      '.stp-row b{display:block}.stp-row .stp-note{margin:0}',
      '.stp-vid{display:flex;flex-direction:column;gap:8px;margin:12px 0}.stp-vid img{width:100%;max-height:240px;object-fit:cover;border-radius:12px}',
      '.stp-vt b{display:block}.stp-vt span{font-size:.85rem;opacity:.7}',
      '.stp-top5{margin:0 0 12px;padding-left:20px}.stp-top5 li{margin:6px 0}',
      '.stp-toast{position:fixed;left:50%;bottom:24px;z-index:2147483600;max-width:min(92vw,460px);padding:10px 16px;border-radius:12px;background:#17181c;color:#fff;font-size:.9rem;text-align:center;transform:translate(-50%,16px);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}',
      '.stp-toast.on{opacity:1;transform:translate(-50%,0)}',
      '.stp-locked{opacity:.55;cursor:not-allowed}',
      '@media (max-width:420px){.stp{padding:16px}.stp-acts>*{flex:1 1 auto}}',
      '@media (prefers-reduced-motion:reduce){.stp-bar i,.stp-toast{transition:none}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function place() {
    var hook = document.getElementById(CFG.hookId), h = el('div', 'stp-host');
    if (host && host.parentNode) host.parentNode.removeChild(host);
    if (hook) hook.parentNode.replaceChild(h, hook);
    else {
      var after = CFG.afterSelector && document.querySelector(CFG.afterSelector);
      var main = document.querySelector('main') || document.querySelector('#app,#root,.app,.container,.wrapper');
      if (after && after.parentNode) after.parentNode.insertBefore(h, after.nextSibling);
      else if (main) main.appendChild(h);
      else {
        h.classList.add('stp-host--page');
        var foot = document.querySelector('footer');
        if (foot && foot.parentNode) foot.parentNode.insertBefore(h, foot); else document.body.appendChild(h);
      }
    }
    host = h;
  }

  function init() {
    css();
    place();
    draw();
    if (D.theme) setTheme(D.theme);
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t) return;
      if (CFG.wmButton) {                           // tombol tanpa watermark terkunci -> arahkan ke puzzle
        var w = t.closest(CFG.wmButton);
        if (w && !wmUnlocked()) { e.preventDefault(); e.stopPropagation(); toast('Selesaikan puzzle dulu untuk membuka tombol ini.'); open('puzzle'); return; }
      }
      if (t.closest('.stp-dlg,.stp')) return;
      if (CFG.downloadSelector && t.closest(CFG.downloadSelector)) setTimeout(function () { onDownload(); }, 0);
    }, true);
    if (window.MutationObserver) {
      var q = false;
      new MutationObserver(function () {
        if (q) return;
        q = true;
        setTimeout(function () { q = false; if (!host || !host.isConnected) { place(); draw(); } applyWm(); }, 80);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  window.SaveTokPlus = {
    v: 1,
    onDownload: onDownload,
    use: use,
    can: function (item) { return CFG.prices[item] != null && (prem() || D.tok[item] > 0); },
    batchLimit: batchLimit,
    wmUnlocked: wmUnlocked,
    open: open,
    state: function () { return JSON.parse(JSON.stringify({ coins: D.coins, xp: D.xp, rank: rank(), rankName: rankName(rank()), downloads: D.dl, spins: D.spins, boxes: D.boxes, premium: prem(), premiumUntil: D.till, themes: D.themes })); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
