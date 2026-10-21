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
 const bar=()=>{bx.innerHTML='<span class="mut">'+(prem()?'👑 '+esc(t('pr_on')):'⚡ '+esc(t('pr_tk'))+' <b style="color:var(--tx)">'+tok().n+'/'+CAP+'</b>')+'</span><button type="button" class="btn sm">'+esc(t('pr_btn'))+'</button>'};
 const say=m=>{dlg.querySelector('#prn').textContent=m};
 const draw=()=>{
  const p=gp(),lock=!(p.wa&&p.tt&&p.gm);
  const row=(n,k,l,b)=>'<div style="margin-top:14px"><b>'+n+'. '+esc(t(l))+'</b>'+(p[k]?' ✓':b)+'</div>';
  const pair=k=>'<div class="fr">'+btn('pr_open','go',k,'pri')+btn('pr_ok','ok',k)+'</div>';
  const games='<div class="fr">'+GM.map((g,i)=>'<button type="button" class="btn" data-a="game" data-i="'+i+'" title="'+esc(g[0])+'" aria-label="'+esc(g[0])+'" style="padding:6px">'+(im(g[0],36)||esc(g[1]))+'</button>').join('')+'</div><div class="fr">'+btn('pr_ok','ok','gm')+'</div>';
  dlg.innerHTML='<h3>👑 Premium</h3><p class="mut" id="prn">'+esc(note||t('pr_d'))+'</p>'
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

(function () {
  'use strict';

  /* ================= KONFIGURASI ================= */
  var KEY = 'mltt_profile_v1';
  var HOUR = 60 * 60 * 1000;
  var API = 'https://www.tikwm.com/api/user/info?unique_id=';
  var TIMEOUT = 12000;

  // Urutan percobaan: langsung -> lewat proxy CORS (kalau langsung diblokir browser)
  var ROUTES = [
    function (u) { return u; },
    function (u) { return 'https://corsproxy.io/?' + encodeURIComponent(u); },
    function (u) { return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); }
  ];

  // Nexus otomatis ditaruh di BAWAH elemen SaveTok. Kalau id/class SaveTok-mu beda, tambahkan di sini.
  var ANCHORS = ['#savetok', '#SaveTok', '#save-tok', '[data-savetok]', '.savetok', '.SaveTok'];

  /* ================= UTIL ================= */
  var p = null;        // profil tersimpan
  var typed = '';      // isi input
  var msg = '';        // pesan status
  var busy = false;
  var box = null;
  var reqId = 0;
  var autoDone = false;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function fmt(n) {
    n = Number(n) || 0;
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function parseName(input) {
    var s = String(input || '').trim();
    var m = s.match(/tiktok\.com\/@([A-Za-z0-9._]+)/i);
    if (m) s = m[1];
    s = s.replace(/^@+/, '').replace(/[?#\/].*$/, '');
    return /^[A-Za-z0-9._]{2,24}$/.test(s) ? s : '';
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function wipe() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  function fetchJson(url) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIMEOUT);
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }, function (e) { clearTimeout(timer); throw e; });
  }

  /* ================= AMBIL DATA TIKTOK (BENERAN) ================= */
  function lookup(name) {
    var target = API + encodeURIComponent(name);
    var i = 0;
    function next(lastErr) {
      if (i >= ROUTES.length) return Promise.reject(lastErr || new Error('gagal'));
      var url = ROUTES[i++](target);
      return fetchJson(url).then(function (j) {
        if (!j || j.code !== 0 || !j.data || !j.data.user) throw new Error('not-found');
        var u = j.data.user, s = j.data.stats || {};
        return {
          name: u.nickname || u.uniqueId || name,
          username: u.uniqueId || name,
          bio: u.signature || '',
          avatar: u.avatarLarger || u.avatarMedium || u.avatarThumb || '',
          verified: !!u.verified,
          followers: s.followerCount || 0,
          following: s.followingCount || 0,
          likes: s.heartCount || s.heart || 0,
          videos: s.videoCount || 0,
          updatedAt: Date.now()
        };
      }).catch(function (e) {
        // user memang tidak ada -> jangan coba route lain
        if (e && e.message === 'not-found') throw e;
        return next(e);
      });
    }
    return next();
  }

  // Ubah avatar ke data URL supaya tetap tampil walau link TikTok kadaluarsa.
  function toDataUrl(url) {
    if (!url || /^data:/.test(url)) return Promise.resolve(url || '');
    return fetch(url).then(function (r) { return r.blob(); }).then(function (b) {
      return new Promise(function (res) {
        var fr = new FileReader();
        fr.onload = function () { res(String(fr.result)); };
        fr.onerror = function () { res(url); };
        fr.readAsDataURL(b);
      });
    }).catch(function () { return url; });
  }

  /* ================= AKSI ================= */
  function connect(raw, silent) {
    var name = parseName(raw);
    if (!name) {
      if (!silent) { msg = 'Username tidak valid. Contoh: @namakamu atau link tiktok.com/@namakamu'; draw(); }
      return;
    }
    if (busy) return;
    var id = ++reqId;
    busy = true;
    if (!silent) msg = '';
    draw();

    lookup(name).then(function (data) {
      return toDataUrl(data.avatar).then(function (av) { data.avatar = av; return data; });
    }).then(function (data) {
      if (id !== reqId) return;
      p = data;
      save(p);
      typed = '';
      msg = silent ? '' : 'Berhasil terhubung ke @' + p.username + '.';
    }).catch(function (e) {
      if (id !== reqId) return;
      if (!silent) {
        msg = e && e.message === 'not-found'
          ? 'Akun @' + name + ' tidak ditemukan. Cek lagi username-nya.'
          : 'Gagal mengambil data TikTok. Periksa koneksi atau coba lagi nanti.';
      }
    }).then(function () {
      if (id !== reqId) return;
      busy = false;
      draw();
    });
  }

  function sync() {
    if (!p || busy) return;
    var payload;
    busy = true;
    draw();
    toDataUrl(p.avatar).then(function (av) {
      payload = { name: p.name, username: p.username, bio: p.bio, avatar: av };
      if (typeof window.onTikTokSync === 'function') {
        return window.onTikTokSync(payload);
      }
      // Tidak ada handler? Tetap kirim lewat event supaya bagian lain bisa menangkap.
      window.dispatchEvent(new CustomEvent('tiktok-sync', { detail: payload }));
      try { localStorage.setItem('mltt_synced', JSON.stringify(payload)); } catch (e) {}
      return 'event';
    }).then(function (r) {
      msg = r === 'event'
        ? 'Profil dikirim lewat event "tiktok-sync" (belum ada window.onTikTokSync, lihat CARA-PASANG.txt).'
        : 'Profil sudah disamakan dengan TikTok.';
    }).catch(function () {
      msg = 'Gagal menyamakan profil.';
    }).then(function () {
      busy = false;
      draw();
    });
  }

  /* ================= TAMPILAN ================= */
  function injectCss() {
    if (document.getElementById('mltt-css')) return;
    var s = document.createElement('style');
    s.id = 'mltt-css';
    s.textContent =
      '.mltt{box-sizing:border-box;width:100%;max-width:560px;margin:20px auto;padding:18px;background:#0f0f0f;border:1px solid #1c1c1c;border-radius:20px;color:#f2f2f2;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
      '.mltt *{box-sizing:border-box}' +
      '.mltt-title{margin:0 0 4px;font-size:18px;font-weight:700;letter-spacing:.2px}' +
      '.mltt-sub{margin:0 0 14px;color:#9a9a9a;font-size:13px}' +
      '.mltt-row{display:flex;gap:8px}' +
      '.mltt-input{flex:1;min-width:0;padding:11px 14px;background:#050505;border:1px solid #262626;border-radius:12px;color:#fff;font-size:14px;outline:none}' +
      '.mltt-input:focus{border-color:#25F4EE}' +
      '.mltt-btn,.mltt-out{padding:10px 14px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;text-align:center;border:1px solid transparent}' +
      '.mltt-btn{background:#fe2c55;color:#fff}' +
      '.mltt-btn:disabled,.mltt-out:disabled{opacity:.45;cursor:not-allowed}' +
      '.mltt-out{background:transparent;color:#e6e6e6;border-color:#2a2a2a}' +
      '.mltt-head{display:flex;align-items:center;gap:12px}' +
      '.mltt-av{width:56px;height:56px;border-radius:50%;object-fit:cover;background:#1a1a1a;border:2px solid #25F4EE;flex:none}' +
      '.mltt-name{font-weight:700;font-size:16px;word-break:break-word}' +
      '.mltt-user{color:#9a9a9a;font-size:13px}' +
      '.mltt-bio{margin:12px 0 0;color:#cfcfcf;white-space:pre-wrap;word-break:break-word}' +
      '.mltt-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}' +
      '.mltt-stats div{padding:10px 4px;background:#050505;border:1px solid #1c1c1c;border-radius:12px;text-align:center}' +
      '.mltt-stats b{display:block;font-size:15px}' +
      '.mltt-stats span{font-size:11px;color:#9a9a9a}' +
      '.mltt-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}' +
      '.mltt-acts .mltt-btn{flex:1 1 100%}' +
      '.mltt-acts .mltt-out{flex:1 1 auto}' +
      '.mltt-msg{margin:12px 0 0;color:#25F4EE;font-size:13px}';
    document.head.appendChild(s);
  }

  function draw() {
    if (!box) return;
    box.textContent = '';
    var sec = el('section', 'mltt');
    sec.appendChild(el('h3', 'mltt-title', 'Nexus · Hubungkan TikTok'));

    if (!p) {
      sec.appendChild(el('p', 'mltt-sub', 'Masukkan username TikTok untuk menampilkan pengikut dan mengikuti di profilmu.'));
      var row = el('div', 'mltt-row');
      var inp = el('input', 'mltt-input');
      var go = el('button', 'mltt-btn', busy ? 'Memuat...' : 'Hubungkan');
      inp.type = 'text';
      inp.placeholder = '@username atau link TikTok';
      inp.setAttribute('autocapitalize', 'none');
      inp.setAttribute('autocomplete', 'off');
      inp.spellcheck = false;
      inp.value = typed;
      inp.disabled = busy;
      go.disabled = busy || !typed.trim();
      inp.oninput = function () { typed = inp.value; go.disabled = busy || !typed.trim(); };
      inp.onkeydown = function (e) { if (e.key === 'Enter' && typed.trim() && !busy) connect(typed); };
      go.onclick = function () { connect(typed); };
      row.appendChild(inp);
      row.appendChild(go);
      sec.appendChild(row);
    } else {
      var card = el('div', 'mltt-card');

      var head = el('div', 'mltt-head');
      var img = el('img', 'mltt-av');
      img.alt = '';
      img.src = p.avatar || '';
      img.onerror = function () { img.style.visibility = 'hidden'; };
      var who = el('div', 'mltt-who');
      who.appendChild(el('div', 'mltt-name', p.name + (p.verified ? ' \u2713' : '')));
      who.appendChild(el('div', 'mltt-user', '@' + p.username));
      head.appendChild(img);
      head.appendChild(who);
      card.appendChild(head);

      if (p.bio) card.appendChild(el('p', 'mltt-bio', p.bio));

      var stats = el('div', 'mltt-stats');
      [['Pengikut', p.followers], ['Mengikuti', p.following], ['Suka', p.likes], ['Video', p.videos]].forEach(function (x) {
        var c = el('div');
        c.appendChild(el('b', '', fmt(x[1])));
        c.appendChild(el('span', '', x[0]));
        stats.appendChild(c);
      });
      card.appendChild(stats);

      var acts = el('div', 'mltt-acts');
      var bSync = el('button', 'mltt-btn', 'Samakan profil dengan TikTok');
      bSync.disabled = busy;
      bSync.onclick = sync;
      var link = el('a', 'mltt-out', 'TikTok');
      link.href = 'https://www.tiktok.com/@' + encodeURIComponent(p.username);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      var bRef = el('button', 'mltt-out', busy ? 'Memuat...' : 'Perbarui');
      bRef.disabled = busy;
      bRef.onclick = function () { connect(p.username); };
      var bOff = el('button', 'mltt-out', 'Putuskan');
      bOff.disabled = busy;
      bOff.onclick = function () { reqId++; wipe(); p = null; msg = ''; busy = false; draw(); };
      acts.appendChild(bSync);
      acts.appendChild(link);
      acts.appendChild(bRef);
      acts.appendChild(bOff);
      card.appendChild(acts);

      sec.appendChild(card);
    }

    if (msg) sec.appendChild(el('p', 'mltt-msg', msg));
    box.appendChild(sec);
  }

  /* ================= PASANG (DI BAWAH SAVETOK) ================= */
  function findAnchor() {
    for (var i = 0; i < ANCHORS.length; i++) {
      var a = document.querySelector(ANCHORS[i]);
      if (a) return a;
    }
    // Cadangan: cari judul/logo yang teksnya "SaveTok"
    var cands = document.querySelectorAll('h1,h2,h3,h4,section,.logo,.brand,[class*="savetok" i],[id*="savetok" i]');
    for (var j = 0; j < cands.length; j++) {
      var t = (cands[j].textContent || '').trim();
      if (t.length < 400 && /save\s*tok/i.test(t) && !cands[j].closest('#tiktok-connect')) {
        return cands[j].closest('section') || cands[j];
      }
    }
    return null;
  }

  function place(node) {
    var a = findAnchor();
    if (a && a.parentNode && a !== node && !a.contains(node)) {
      // Pastikan posisinya tepat setelah SaveTok
      if (a.nextElementSibling !== node) a.parentNode.insertBefore(node, a.nextSibling);
    } else if (!node.parentNode) {
      document.body.appendChild(node);
    }
  }

  function mount(node) {
    if (!node) node = document.getElementById('tiktok-connect');
    if (!node) {
      node = document.createElement('div');
      node.id = 'tiktok-connect';
    }
    if (node.getAttribute('data-mltt') === '1' && node === box && document.contains(node)) return;
    injectCss();
    box = node;
    box.setAttribute('data-mltt', '1');
    place(box);
    p = load();
    msg = '';
    busy = false;
    draw();
    // Perbarui angka pengikut otomatis kalau data sudah lebih dari 1 jam
    if (p && Date.now() - p.updatedAt > HOUR && !autoDone) {
      autoDone = true;
      connect(p.username, true);
    }
  }

  var scanQueued = false;
  function scan() {
    if (scanQueued) return;
    scanQueued = true;
    (window.requestAnimationFrame || setTimeout)(function () {
      scanQueued = false;
      var existing = document.getElementById('tiktok-connect');
      if (box && document.contains(box)) return;       // sudah terpasang
      if (existing || findAnchor()) mount(existing);   // ada wadah atau SaveTok -> pasang
    });
  }

  window.mountTikTokConnect = mount;
  window.tiktokConnect = connect;   // bisa dipanggil manual: tiktokConnect('@username')
  scan();
  document.addEventListener('DOMContentLoaded', scan);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
     
