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

function EntryRow({ e }: { e: Entry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-surface-2 border border-line hover:border-text-dim transition-colors overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => e.tracks.length > 1 && setExpanded(!expanded)}
      >
        <div className="flex flex-col items-center justify-center w-12 flex-shrink-0">
          <span className={`font-display text-3xl font-light leading-none ${moodColor(e.mood)}`}>
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
          {e.tracks.length > 0 ? (
            <div className="flex items-center flex-shrink-0">
              {e.tracks.slice(0, 3).map((t, idx) => (
                <div
                  key={t.id}
                  className="w-10 h-10 rounded-lg border-2 border-surface-2 overflow-hidden flex-shrink-0"
                  style={{ marginLeft: idx === 0 ? 0 : -10, zIndex: 3 - idx }}
                >
                  {t.albumCover ? (
                    <Image
                      src={t.albumCover}
                      alt={t.title}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-surface border border-line flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            {e.tracks.length > 0 ? (
              <>
                <div className="text-sm font-medium truncate">
                  {e.tracks[0].title}
                  <span className="text-text-dim font-normal"> — {e.tracks[0].artist}</span>
                </div>
                {e.tracks.length > 1 && (
                  <div className="text-xs text-text-dim mt-0.5">
                    +{e.tracks.length - 1} more tracks
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-text-dim">No track logged</div>
            )}
            {e.note && <div className="text-xs text-text-dim mt-0.5 truncate">{e.note}</div>}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-mono text-xs text-text-dim">
            {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {e.tracks.length > 1 && (
            <span
              className="text-text-dim text-xs transition-transform duration-200"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'inline-block',
              }}
            >
              ↓
            </span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-line px-4 pb-4 pt-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-3">
            All tracks — {e.tracks.length}
          </div>
          <div className="flex flex-col gap-2">
            {e.tracks.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                {t.albumCover ? (
                  <Image
                    src={t.albumCover}
                    alt={t.title}
                    width={32}
                    height={32}
                    className="rounded-md flex-shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-md bg-surface flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{t.title}</div>
                  <div className="text-xs font-mono text-text-dim">{t.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setExpanded(false)}
        className="mt-4 w-full font-mono text-xs text-text-dim border border-line rounded-lg py-2 hover:border-text-mid hover:text-foreground transition-colors"
      >
        ↑ collapse
      </button>
    </div>
  );
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
          href="/history"
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
            <EntryRow key={e.id} e={e} />
          ))}
        </div>
      )}
    </div>
  );
}
