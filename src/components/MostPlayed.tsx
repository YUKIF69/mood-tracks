'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Period = 'today' | 'week' | 'month' | 'all';

interface Track {
  name: string;
  artist: string;
  albumCover: string;
  count: number;
}

interface SpotifyItem {
  played_at: string;
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
  };
}

const periodLabels: Record<Period, string> = {
  today: 'Today',
  week: 'Week',
  month: 'Month',
  all: 'All',
};

function getPeriodStart(period: Period): Date {
  switch (period) {
    case 'today': {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    case 'week':
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
    case 'all':
      return new Date(0);
  }
}

function getTopTracks(items: SpotifyItem[], period: Period): Track[] {
  const start = getPeriodStart(period);
  const filtered = items.filter((item) => new Date(item.played_at) > start);

  const countMap: Record<string, Track> = {};
  filtered.forEach((item) => {
    const id = item.track.id;
    if (countMap[id]) {
      countMap[id].count++;
    } else {
      countMap[id] = {
        name: item.track.name,
        artist: item.track.artists[0].name,
        albumCover: item.track.album.images[1]?.url ?? '',
        count: 1,
      };
    }
  });

  return Object.values(countMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

export default function MostPlayed() {
  const [allItems, setAllItems] = useState<SpotifyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('week');

  useEffect(() => {
    fetch('/api/spotify/recently-played')
      .then((r) => r.json())
      .then((data) => {
        if (data.items) setAllItems(data.items);
        setLoading(false);
      });
  }, []);

  const tracks = getTopTracks(allItems, period);

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 md:p-7">
      <div className="flex justify-between items-baseline mb-4">
        <span className="font-mono text-[13px] uppercase tracking-wider text-text-dim">
          Most played
        </span>
        <a
          href="/history"
          className="font-mono text-xs text-text-dim underline underline-offset-4 hover:text-accent transition-colors duration-250"
        >
          see all →
        </a>
      </div>
      <div className="flex gap-1 mb-6">
        {(Object.keys(periodLabels) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`font-mono text-[12px] px-2.5 py-1 rounded-md transition-colors ${
              period === p
                ? 'bg-accent-dim text-accent border border-accent'
                : 'text-text-dim border border-line hover:border-text-mid hover:text-foreground'
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        {loading ? (
          <div className="text-sm text-text-dim font-mono py-4">Loading...</div>
        ) : tracks.length === 0 ? (
          <div className="text-sm text-text-dim font-mono py-4">No tracks for this period</div>
        ) : (
          tracks.map((t, i) => (
            <div
              key={t.name}
              className={`flex items-center gap-4 py-3.5 ${i !== tracks.length - 1 ? 'border-b border-line' : ''}`}
            >
              <span className="font-display text-xl font-light text-text-dim w-7">
                {String(i + 1).padStart(2, '0')}
              </span>
              {t.albumCover ? (
                <Image
                  src={t.albumCover}
                  alt={t.name}
                  width={52}
                  height={52}
                  className="rounded-lg flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-surface-2" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{t.name}</div>
                <div className="text-xs font-mono text-text-dim">{t.artist}</div>
              </div>
              <span className="font-mono text-xs text-text-dim">
                {t.count} {t.count === 1 ? 'play' : 'plays'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
