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
      <div className="flex items-end gap-8 mb-12 pb-8 border-b border-line">
        <div className="relative group w-28 h-28 flex-shrink-0">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-line">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={user.name ?? ''}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-surface-2 flex items-center justify-center font-display text-4xl font-light text-text-mid">
                {user.name?.[0] ?? 'U'}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-2">
            Profile
          </div>
          <h1 className="font-display font-light text-5xl tracking-tight mb-3">{user.name}</h1>
          <div className="flex items-center gap-4 font-mono text-xs text-text-dim">
            <span>{user._count.moodEntries} mood entries</span>
            <span>·</span>
            <span>Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* Time range selector */}
      <div className="flex gap-2 mb-8">
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
        <div className="grid grid-cols-2 gap-8">
          {/* Top artists */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-6">
              Top artists
            </div>
            <div className="flex flex-col gap-3">
              {artists.map((a, i) => (
                <div key={a.id} className="flex items-center gap-4">
                  <span className="font-display text-xl font-light text-text-dim w-7">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {a.images?.[0]?.url ? (
                    <Image
                      src={a.images[0].url}
                      alt={a.name}
                      width={44}
                      height={44}
                      className="rounded-full flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-surface-2 border border-line flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    {a.genres?.[0] && (
                      <div className="text-xs font-mono text-text-dim truncate">{a.genres[0]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top tracks */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-6">
              Top tracks
            </div>
            <div className="flex flex-col gap-3">
              {tracks.map((t, i) => (
                <div key={t.id} className="flex items-center gap-4">
                  <span className="font-display text-xl font-light text-text-dim w-7">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t.album.images?.[1]?.url ? (
                    <Image
                      src={t.album.images[1].url}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="rounded-lg flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-surface-2 border border-line flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
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
