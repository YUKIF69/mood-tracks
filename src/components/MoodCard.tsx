'use client';

import { useState } from 'react';

const moodWords: Record<number, string> = {
  1: 'Heavy day',
  2: 'Low',
  3: 'Neutral',
  4: 'Good — keep going',
  5: 'Great day',
};

export default function MoodCard() {
  const [mood, setMood] = useState(4);

  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Mood today
        </span>
        <span className="font-mono text-xs text-text-dim">tap to log</span>
      </div>
      <div className="font-display font-light text-[88px] leading-none tracking-tight mb-1">
        {mood}
        <span className="text-3xl text-text-dim">/5</span>
      </div>
      <div className="font-mono text-[13px] uppercase tracking-wider text-accent mb-3.5">
        {moodWords[mood]}
      </div>
      <div className="flex gap-2 mt-5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setMood(n)}
            className={`flex-1 font-mono text-sm border rounded-lg py-3 transition-colors ${
              n === mood
                ? 'border-accent text-accent bg-accent-dim'
                : 'border-line bg-surface-2 text-text-mid hover:border-text-mid hover:text-foreground'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
