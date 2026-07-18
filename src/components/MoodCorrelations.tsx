'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Correlation {
  artist: string;
  avgMood: number;
  count: number;
  image: string | null;
}

function moodColor(mood: number) {
  if (mood >= 4) return 'text-accent';
  if (mood <= 2) return 'text-low';
  return 'text-foreground';
}

function moodLabel(mood: number) {
  if (mood >= 4.5) return 'Great';
  if (mood >= 3.5) return 'Good';
  if (mood >= 2.5) return 'Neutral';
  if (mood >= 1.5) return 'Low';
  return 'Heavy';
}

export default function MoodCorrelations() {
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mood/correlations')
      .then((r) => r.json())
      .then((data) => {
        if (data.correlations) setCorrelations(data.correlations);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 md:p-7">
      <div className="font-mono text-[13px] uppercase tracking-wider text-text-dim mb-2">
        Music × Mood correlation
      </div>
      <p className="text-xs text-text-dim font-mono mb-6">
        Artists you listen to and your average mood when doing so
      </p>

      {loading ? (
        <div className="text-sm text-text-dim font-mono py-4">Loading...</div>
      ) : correlations.length === 0 ? (
        <div className="text-sm text-text-dim font-mono py-4">
          Log more moods with tracks to see correlations
        </div>
      ) : (
        <div className="flex flex-col">
          {correlations.map((c, i) => (
            <div
              key={c.artist}
              className={`flex items-center gap-4 py-3.5 ${i !== correlations.length - 1 ? 'border-b border-line' : ''}`}
            >
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.artist}
                  width={44}
                  height={44}
                  className="rounded-full flex-shrink-0 object-cover w-11 h-11"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-surface-2 border border-line flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{c.artist}</div>
                <div className="font-mono text-xs text-text-dim">{c.count} entries</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-display text-2xl font-light ${moodColor(c.avgMood)}`}>
                  {c.avgMood}
                </div>
                <div className={`font-mono text-[10px] uppercase ${moodColor(c.avgMood)}`}>
                  {moodLabel(c.avgMood)}
                </div>
              </div>

              {/* mood bar */}
              <div className="w-20 h-1.5 bg-surface-2 rounded-full flex-shrink-0">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(c.avgMood / 5) * 100}%`,
                    background:
                      c.avgMood >= 4
                        ? 'var(--accent)'
                        : c.avgMood <= 2
                          ? 'var(--low)'
                          : 'var(--text-mid)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
