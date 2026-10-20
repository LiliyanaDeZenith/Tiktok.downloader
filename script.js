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
  
