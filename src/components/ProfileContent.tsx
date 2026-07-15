// components/ProfileContent.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  spotifyAccessToken: string | null;
  _count: { moodEntries: number };
}

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

const timeRangeLabels: Record<TimeRange, string> = {
  short_term: 'Last month',
  medium_term: '6 months',
  long_term: 'All time',
};

export default function ProfileContent({ user, session }: { user: User; session: Session }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);

  function handleTimeRangeChange(range: TimeRange) {
    setTimeRange(range);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/spotify/top?time_range=${timeRange}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setArtists(data.artists ?? []);
        setTracks(data.tracks ?? []);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [timeRange]);

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      {/* Profile header */}
      <div className="flex items-center md:items-end gap-5 md:gap-8 mb-8 md:mb-12 pb-6 md:pb-8 border-b border-line">
        <div className="relative group w-20 h-20 md:w-28 md:h-28 flex-shrink-0">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-line">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? ''}
                width={112}
                height={112}
                priority
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-surface-2 flex items-center justify-center font-display text-3xl md:text-4xl font-light text-text-mid">
                {user.name?.[0] ?? 'U'}
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-1 md:mb-2">
            Profile
          </div>
          <h1 className="font-display font-light text-3xl md:text-5xl tracking-tight mb-2 md:mb-3 truncate">
            {user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 font-mono text-xs text-text-dim">
            <span>{user._count.moodEntries} mood entries</span>
            <span className="hidden md:inline">·</span>
            <span>Since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* Time range selector */}
      <div className="flex gap-2 mb-6 md:mb-8">
        {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => handleTimeRangeChange(range)}
            className={`font-mono text-[11px] px-3 py-1.5 rounded-md transition-colors ${
              timeRange === range
                ? 'bg-accent-dim text-accent border border-accent'
                : 'text-text-dim border border-line hover:border-text-mid hover:text-foreground'
            }`}
          >
            {timeRangeLabels[range]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-text-dim font-mono">Loading...</div>
      ) : (
        <div className="flex flex-col gap-10 md:gap-12">
          {/* Top artists */}
          <div>
            <div className="font-mono text-[11px] md:text-[14px] uppercase tracking-wider text-text-dim mb-4 md:mb-6">
              Top artists
            </div>
            {/* мобільний — список, десктоп — сітка */}
            <div className="flex flex-col gap-3 md:hidden">
              {artists.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="font-mono text-sm text-text-dim w-5 text-right flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {a.images?.[0]?.url ? (
                    <Image
                      src={a.images[0].url}
                      alt={a.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover w-11 h-11 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-surface-2 border border-line flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    {a.genres?.[0] && (
                      <div className="text-xs font-mono text-text-dim truncate">{a.genres[0]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:grid grid-cols-5 gap-4">
              {artists.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col items-center gap-3 text-center max-w-[142px] mx-auto w-full"
                >
                  {a.images?.[0]?.url ? (
                    <Image
                      src={a.images[0].url}
                      alt={a.name}
                      width={160}
                      height={160}
                      className="rounded-full object-cover w-full aspect-square"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-full bg-surface-2 border border-line" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs font-mono text-text-dim mt-0.5">Artist</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top tracks */}
          <div>
            <div className="font-mono text-[11px] md:text-[14px] uppercase tracking-wider text-text-dim mb-4 md:mb-6">
              Top tracks
            </div>
            {/* мобільний — список, десктоп — сітка */}
            <div className="flex flex-col gap-3 md:hidden">
              {tracks.map((t, i) => (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="font-mono text-sm text-text-dim w-5 text-right flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t.album.images?.[0]?.url ? (
                    <Image
                      src={t.album.images[0].url}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="rounded-lg object-cover w-11 h-11 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-surface-2 border border-line flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.name}</div>
                    <div className="text-xs font-mono text-text-dim truncate">
                      {t.artists.map((a) => a.name).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:grid grid-cols-5 gap-4">
              {tracks.map((t) => (
                <div key={t.id} className="flex flex-col gap-3 max-w-[142px] mx-auto w-full">
                  {t.album.images?.[0]?.url ? (
                    <Image
                      src={t.album.images[0].url}
                      alt={t.name}
                      width={160}
                      height={160}
                      className="rounded-lg object-cover w-full aspect-square"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-lg bg-surface-2 border border-line" />
                  )}
                  <div>
                    <div className="text-sm font-medium truncate">{t.name}</div>
                    <div className="text-xs font-mono text-text-dim truncate">
                      {t.artists.map((a) => a.name).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
