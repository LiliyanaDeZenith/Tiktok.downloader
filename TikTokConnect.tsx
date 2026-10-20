// TikTokConnect.tsx — komponen TAMBAHAN untuk halaman Setting Nexus (tidak mengubah tampilan lain)
//
// Pemakaian di file Setting:
//   import TikTokConnect from './TikTokConnect';
//   <TikTokConnect
//     onSync={(t) => updateProfile({ name: t.name, username: t.username, bio: t.bio, avatar: t.avatar })}
//   />

import { useEffect, useState } from 'react';
import { BadgeCheck, ExternalLink, Loader2, Music2, RefreshCw, Unlink } from 'lucide-react';

export type TikTokProfile = {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  verified: boolean;
  updatedAt: number;
};

type SyncData = { name: string; username: string; bio: string; avatar: string };

const KEY = 'ml_tiktok';

const outline =
  'inline-flex items-center gap-1.5 rounded-full border border-gray-500/40 px-3.5 py-1.5 text-sm font-bold hover:bg-gray-500/10 disabled:opacity-50';

const fmt = (n: number) =>
  n >= 1e6
    ? (n / 1e6).toFixed(1).replace('.0', '') + 'M'
    : n >= 1e3
      ? (n / 1e3).toFixed(1).replace('.0', '') + 'K'
      : String(n);

// Ambil profil publik TikTok lewat username (tanpa login)
async function lookup(input: string): Promise<TikTokProfile> {
  const m = input.match(/tiktok\.com\/@([\w.]+)/i);
  const id = (m ? m[1] : input).trim().replace(/^@/, '');
  if (!id) throw new Error('empty');

  const res = await fetch('https://www.tikwm.com/api/user/info?unique_id=' + encodeURIComponent(id));
  const j = await res.json();
  const u = j?.data?.user ?? j?.data?.userInfo?.user;
  const s = j?.data?.stats ?? j?.data?.userInfo?.stats ?? {};
  if (!u) throw new Error('not found');

  return {
    username: u.uniqueId || id,
    name: u.nickname || id,
    bio: u.signature || '',
    avatar: u.avatarLarger || u.avatarMedium || u.avatarThumb || '',
    followers: s.followerCount ?? 0,
    following: s.followingCount ?? 0,
    likes: s.heartCount ?? s.heart ?? 0,
    videos: s.videoCount ?? 0,
    verified: !!u.verified,
    updatedAt: Date.now(),
  };
}

// Link foto TikTok bisa kedaluwarsa, jadi simpan sebagai data URL kalau bisa
async function toDataUrl(url: string) {
  try {
    const blob = await (await fetch(url)).blob();
    return await new Promise<string>((ok, err) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result));
      r.onerror = err;
      r.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

export default function TikTokConnect({ onSync }: { onSync?: (data: SyncData) => void }) {
  const [p, setP] = useState<TikTokProfile | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch {
      return null;
    }
  });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const connect = async (name: string, silent = false) => {
    setBusy(true);
    if (!silent) setMsg('');
    try {
      const data = await lookup(name);
      localStorage.setItem(KEY, JSON.stringify(data));
      setP(data);
      setInput('');
    } catch {
      if (!silent) setMsg('Gagal mengambil data TikTok. Periksa username atau coba lagi nanti.');
    } finally {
      setBusy(false);
    }
  };

  // Perbarui angka pengikut otomatis kalau data sudah lebih dari 1 jam
  useEffect(() => {
    if (p && Date.now() - p.updatedAt > 3600000) connect(p.username, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = async () => {
    if (!p || !onSync) return;
    setBusy(true);
    onSync({ name: p.name, username: p.username, bio: p.bio, avatar: await toDataUrl(p.avatar) });
    setBusy(false);
    setMsg('Profil sudah disamakan dengan TikTok.');
  };

  const disconnect = () => {
    localStorage.removeItem(KEY);
    setP(null);
    setMsg('');
  };

  const stats: [string, number][] = p
    ? [
        ['Pengikut', p.followers],
        ['Mengikuti', p.following],
        ['Suka', p.likes],
        ['Video', p.videos],
      ]
    : [];

  return (
    <section className="border-b border-gray-500/30 p-4">
      <div className="mb-1 flex items-center gap-2">
        <Music2 size={20} />
        <h3 className="text-lg font-bold">Hubungkan TikTok</h3>
      </div>

      {!p ? (
        <>
          <p className="mb-3 text-sm text-gray-500">
            Masukkan username TikTok untuk menampilkan pengikut dan mengikuti di profilmu.
          </p>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && input.trim() && connect(input)}
              placeholder="@username atau link TikTok"
              className="min-w-0 flex-1 rounded-full border border-gray-500/40 bg-transparent px-4 py-2 text-sm outline-none focus:border-sky-500"
            />
            <button
              onClick={() => connect(input)}
              disabled={busy || !input.trim()}
              className="rounded-full bg-sky-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : 'Hubungkan'}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-3 rounded-2xl border border-gray-500/30 p-4">
          <div className="flex items-center gap-3">
            <img
              src={p.avatar}
              alt=""
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
              }}
              className="h-14 w-14 shrink-0 rounded-full bg-gray-500/20 object-cover"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1 font-bold">
                <span className="truncate">{p.name}</span>
                {p.verified && <BadgeCheck size={16} className="shrink-0 text-sky-500" />}
              </div>
              <div className="truncate text-sm text-gray-500">@{p.username}</div>
            </div>
          </div>

          {p.bio && <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm">{p.bio}</p>}

          <div className="mt-3 grid grid-cols-4 text-center">
            {stats.map(([label, val]) => (
              <div key={label}>
                <div className="font-bold">{fmt(val)}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {onSync && (
              <button
                onClick={sync}
                disabled={busy}
                className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-bold text-white disabled:opacity-50"
              >
                Samakan profil dengan TikTok
              </button>
            )}
            <a
              href={'https://www.tiktok.com/@' + p.username}
              target="_blank"
              rel="noreferrer"
              className={outline}
            >
              <ExternalLink size={14} /> TikTok
            </a>
            <button
              onClick={() => connect(p.username)}
              disabled={busy}
              className={outline}
              aria-label="Perbarui data"
            >
              <RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
            </button>
            <button onClick={disconnect} className={outline} aria-label="Putuskan TikTok">
              <Unlink size={14} />
            </button>
          </div>
        </div>
      )}

      {msg && <p className="mt-2 text-sm text-gray-500">{msg}</p>}
    </section>
  );
}
