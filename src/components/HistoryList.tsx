'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumCover: string | null;
}

interface Entry {
  id: string;
  date: Date;
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
    <div className="rounded-xl bg-surface border border-line hover:border-text-dim transition-colors overflow-hidden">
      <div
        className="flex items-center gap-3 p-3 md:p-4 cursor-pointer"
        onClick={() => e.tracks.length > 0 && setExpanded(!expanded)}
      >
        <div className="flex flex-col items-center justify-center w-10 md:w-12 flex-shrink-0">
          <span
            className={`font-display text-2xl md:text-3xl font-light leading-none ${moodColor(e.mood)}`}
          >
            {e.mood}
          </span>
          <span
            className={`font-mono text-[9px] md:text-[10px] uppercase tracking-wider mt-1 ${moodColor(e.mood)}`}
          >
            {moodLabel(e.mood)}
          </span>
        </div>

        <div className="w-px h-8 bg-line flex-shrink-0" />

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {e.tracks.length > 0 ? (
            <div className="flex items-center flex-shrink-0">
              {e.tracks.slice(0, 2).map((t, idx) => (
                <div
                  key={t.id}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 border-surface overflow-hidden flex-shrink-0"
                  style={{ marginLeft: idx === 0 ? 0 : -8, zIndex: 2 - idx }}
                >
                  {t.albumCover ? (
                    <Image
                      src={t.albumCover}
                      alt={t.title}
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-2" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-surface-2 border border-line flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            {e.tracks.length > 0 ? (
              <>
                <div className="text-xs md:text-sm font-medium truncate">
                  {e.tracks[0].title}
                  <span className="text-text-dim font-normal"> — {e.tracks[0].artist}</span>
                </div>
                {e.tracks.length > 1 && (
                  <div className="text-[10px] md:text-xs text-text-dim">
                    +{e.tracks.length - 1} more
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-text-dim">No track logged</div>
            )}
            {e.note && <div className="text-[10px] text-text-dim truncate">{e.note}</div>}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          <span className="font-mono text-[10px] md:text-xs text-text-dim">
            {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {e.tracks.length > 0 && (
            <span
              className="text-text-dim text-xs"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'inline-block',
                transition: 'transform 0.2s',
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
                    width={42}
                    height={42}
                    className="rounded-md flex-shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-md bg-surface-2 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{t.title}</div>
                  <div className="text-xs font-mono text-text-dim">{t.artist}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="mt-4 w-full font-mono text-xs text-text-dim border border-line rounded-lg py-2 hover:border-text-mid hover:text-foreground transition-colors"
          >
            ↑ collapse
          </button>
        </div>
      )}
    </div>
  );
}

export default function HistoryList({ entries }: { entries: Entry[] }) {
  return (
    <div className="flex flex-col gap-2">
      {entries.length === 0 ? (
        <div className="text-sm text-text-dim font-mono py-4">No entries yet</div>
      ) : (
        entries.map((e) => <EntryRow key={e.id} e={e} />)
      )}
    </div>
  );
}
