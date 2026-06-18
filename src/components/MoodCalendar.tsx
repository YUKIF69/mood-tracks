'use client';

import { useEffect, useState } from 'react';

interface CalendarData {
  days: Record<number, number>;
  monthName: string;
  firstDayOfWeek: number;
  totalDays: number;
}

function moodClass(mood: number) {
  if (mood === 1) return 'bg-[rgba(201,123,99,0.35)] border-[rgba(201,123,99,0.4)] text-foreground';
  if (mood === 2) return 'bg-[rgba(201,123,99,0.18)] border-[rgba(201,123,99,0.25)] text-text-mid';
  if (mood === 3) return 'bg-surface-2 border-line text-text-dim';
  if (mood === 4)
    return 'bg-[rgba(212,255,110,0.28)] border-[rgba(212,255,110,0.4)] text-foreground';
  if (mood === 5) return 'bg-accent border-accent text-[#14180A] font-semibold';
  return 'bg-surface-2 border-line text-text-dim';
}

export default function MoodCalendar() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().getDate();

  useEffect(() => {
    fetch('/api/mood/calendar')
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Mood calendar
        </span>
        <span className="font-mono text-xs text-text-dim">{data?.monthName ?? ''}</span>
      </div>

      {loading ? (
        <div className="text-sm text-text-dim font-mono py-4">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1.5">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div
                key={i}
                className="font-mono text-[10px] uppercase text-text-dim text-center pb-1"
              >
                {d}
              </div>
            ))}

            {/* empty cells for offset */}
            {Array.from({ length: data?.firstDayOfWeek ?? 0 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* day cells */}
            {Array.from({ length: data?.totalDays ?? 0 }).map((_, i) => {
              const day = i + 1;
              const mood = data?.days[day];
              const isToday = day === today;

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-md border flex items-center justify-center font-mono text-[10px] transition-colors ${
                    mood ? moodClass(mood) : 'bg-surface-2 border-line text-text-dim'
                  } ${isToday ? 'ring-1 ring-accent' : ''}`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-4 font-mono text-[11px] text-text-dim">
            <span>low</span>
            <span className="w-3 h-3 rounded-[3px] border border-line bg-[rgba(201,123,99,0.35)]" />
            <span className="w-3 h-3 rounded-[3px] border border-line bg-[rgba(201,123,99,0.18)]" />
            <span className="w-3 h-3 rounded-[3px] border border-line bg-surface-2" />
            <span className="w-3 h-3 rounded-[3px] border border-line bg-[rgba(212,255,110,0.28)]" />
            <span className="w-3 h-3 rounded-[3px] border border-line bg-accent" />
            <span>high</span>
          </div>
        </>
      )}
    </div>
  );
}
