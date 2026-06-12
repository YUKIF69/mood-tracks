'use client';

import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const data = [
  { day: 'Mon', mood: 2.0 },
  { day: 'Tue', mood: 1.9 },
  { day: 'Wed', mood: 2.8 },
  { day: 'Thu', mood: 3.6 },
  { day: 'Fri', mood: 4.0 },
  { day: 'Sat', mood: 4.5 },
  { day: 'Sun', mood: 4.8 },
];

export default function MoodTrendChart() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Mood trend
        </span>
        <span className="font-mono text-xs text-text-dim">last 7 days</span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={[1, 5]} hide />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#D4FF6E"
              strokeWidth={2.5}
              dot={{ fill: '#D4FF6E', r: 3.5 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-5 pt-5 border-t border-line">
        <div>
          <div className="font-display text-2xl font-light text-accent mb-1">3.6</div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
            Average
          </div>
        </div>
        <div>
          <div className="font-display text-2xl font-light mb-1">Sun</div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
            Best day
          </div>
        </div>
        <div>
          <div className="font-display text-2xl font-light mb-1">Wed</div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
            Most active
          </div>
        </div>
      </div>
    </div>
  );
}
