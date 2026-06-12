const moodLevels: Record<number, string> = {
  1: 'bg-[rgba(201,123,99,0.35)] border-[rgba(201,123,99,0.4)] text-foreground',
  2: 'bg-[rgba(201,123,99,0.18)] border-[rgba(201,123,99,0.25)] text-text-mid',
  3: 'bg-surface-2 border-line text-text-dim',
  4: 'bg-[rgba(212,255,110,0.28)] border-[rgba(212,255,110,0.4)] text-foreground',
  5: 'bg-accent border-accent text-[#14180A] font-semibold',
};

// day -> mood level (1-5), 0 = empty/future
const days: number[] = [0, 3, 4, 5, 4, 2, 1, 1, 2, 4, 5, 4, 3, 5];

export default function MoodCalendar() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Mood calendar
        </span>
        <span className="font-mono text-xs text-text-dim">june 2026</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="font-mono text-[10px] uppercase text-text-dim text-center pb-1">
            {d}
          </div>
        ))}
        {days.map((level, i) => {
          const dayNum = i; // index 0 is empty cell for offset, day 1 starts at i=1
          if (level === 0) return <div key={i} />;
          const isToday = dayNum === 13;
          return (
            <div
              key={i}
              className={`aspect-square rounded-md border flex items-center justify-center font-mono text-[10px] ${moodLevels[level]} ${
                isToday ? 'ring-1 ring-accent' : ''
              }`}
            >
              {dayNum}
            </div>
          );
        })}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
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
    </div>
  );
}
