'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumCover: string | null;
}

interface Entry {
  id: string;
  date: string;
  mood: number;
  note: string | null;
  tracks: Track[];
}

function moodColor(mood: number) {
  if (mood >= 4) return 'text-accent';
  if (mood <= 2) return 'text-low';
  return 'text-foreground';
}

function moodLabel(mood: number) {
  const labels: Record<number, string> = {
    1: 'Heavy',
    2: 'Low',
    3: 'Neutral',
    4: 'Good',
    5: 'Great',
  };
  return labels[mood] ?? '—';
}

export default function RecentEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mood/entries')
      .then((r) => r.json())
      .then((data) => {
        if (data.entries) setEntries(data.entries);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Recent entries
        </span>
        <a
          href="#"
          className="font-mono text-xs text-text-dim underline underline-offset-4 hover:text-accent"
        >
          see all →
        </a>
      </div>
      {loading ? (
        <div className="text-sm text-text-dim font-mono py-4">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-sm text-text-dim font-mono py-4">
          No entries yet — log your first mood above
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-line hover:border-text-dim transition-colors"
            >
              <div className="flex flex-col items-center justify-center w-12 flex-shrink-0">
                <span
                  className={`font-display text-3xl font-light leading-none ${moodColor(e.mood)}`}
                >
                  {e.mood}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider mt-1 ${moodColor(e.mood)}`}
                >
                  {moodLabel(e.mood)}
                </span>
              </div>

              <div className="w-px h-10 bg-line flex-shrink-0" />

              <div className="flex items-center gap-3 flex-1 min-w-0">
                {e.tracks.length > 0 && e.tracks[0].albumCover ? (
                  <Image
                    src={e.tracks[0].albumCover}
                    alt={e.tracks[0].title}
                    width={40}
                    height={40}
                    className="rounded-lg flex-shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-surface border border-line flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  {e.tracks.length > 0 ? (
                    <div className="text-sm font-medium truncate">
                      {e.tracks[0].title}
                      <span className="text-text-dim font-normal"> — {e.tracks[0].artist}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-text-dim">No track logged</div>
                  )}
                  {e.note && <div className="text-xs text-text-dim mt-0.5 truncate">{e.note}</div>}
                </div>
              </div>

              <div className="font-mono text-xs text-text-dim flex-shrink-0">
                {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
