'use client';

import { useEffect, useState } from 'react';

export default function StreakCard() {
  const [streak, setStreak] = useState<number | null>(null);
  const [loggedToday, setLoggedToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mood/streak')
      .then((r) => r.json())
      .then((data) => {
        setStreak(data.streak);
        setLoggedToday(data.loggedToday);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface border border-line rounded-2xl p-7 flex items-center gap-6">
      <div className="text-5xl flex-shrink-0">🔥</div>
      <div className="flex-1">
        <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-1">
          Current streak
        </div>
        {loading ? (
          <div className="font-display text-4xl font-light text-text-dim">—</div>
        ) : (
          <>
            <div className="font-display text-4xl font-light">
              <span className="text-accent">{streak}</span>
              <span className="text-text-dim text-xl font-light ml-2">
                {streak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="font-mono text-xs text-text-dim mt-1">
              {loggedToday
                ? '✓ logged today — keep it up'
                : streak === 0
                  ? 'log your mood to start a streak'
                  : 'log today to keep your streak'}
            </div>
          </>
        )}
      </div>
      {!loading && streak !== null && streak > 0 && (
        <div className="flex-shrink-0 text-right">
          <div className="font-display text-2xl font-light text-text-dim">
            {streak >= 7 ? '🏆' : streak >= 3 ? '⚡' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
