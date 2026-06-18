'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';

interface TrendData {
  day: string;
  mood: number | null;
}

export default function MoodTrendChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [bestDay, setBestDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mood/trend')
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setData(res.data);
        if (res.avg) setAvg(res.avg);
        if (res.bestDay) setBestDay(res.bestDay);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Mood trend
        </span>
        <span className="font-mono text-xs text-text-dim">last 7 days</span>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-sm text-text-dim font-mono">
          Loading...
        </div>
      ) : data.every((d) => d.mood === null) ? (
        <div className="h-40 flex items-center justify-center text-sm text-text-dim font-mono">
          Log more moods to see your trend
        </div>
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis domain={[1, 5]} hide />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6F6A63', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#141316',
                  border: '1px solid #232228',
                  borderRadius: '8px',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: '12px',
                  color: '#E8E6E3',
                }}
                formatter={(value) => [value, 'mood']}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#D4FF6E"
                strokeWidth={2.5}
                dot={{ fill: '#D4FF6E', r: 3.5 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex justify-between mt-5 pt-5 border-t border-line text-center items-center">
        <div>
          <div
            className={`font-display text-2xl font-light mb-1 ${avg ? 'text-accent' : 'text-text-dim'}`}
          >
            {avg ?? '—'}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
            Average
          </div>
        </div>
        <div>
          <div className="font-display text-2xl font-light mb-1">{bestDay ?? '—'}</div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
            Best day
          </div>
        </div>
        <div>
          <div className="font-display text-2xl font-light mb-1">
            {data.filter((d) => d.mood !== null).length}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
            Days logged
          </div>
        </div>
      </div>
    </div>
  );
}
