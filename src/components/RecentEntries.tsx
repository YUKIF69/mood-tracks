const entries = [
  {
    date: 'May 18',
    mood: 4,
    tracks: 'Mac Miller, Frank Ocean, Tame Impala',
    note: 'Great day, went for a long walk and felt calm',
  },
  {
    date: 'May 17',
    mood: 5,
    tracks: 'Frank Ocean, Joji, The 1975',
    note: 'Beach and good music — perfect combo',
  },
  {
    date: 'May 16',
    mood: 3,
    tracks: 'Radiohead, The Smile',
    note: 'Productive but a bit overwhelming',
  },
  {
    date: 'May 15',
    mood: 2,
    tracks: 'Slipknot, Linkin Park',
    note: 'Tough day at work, needed heavy music',
  },
  { date: 'May 14', mood: 2, tracks: 'Metallica, System of a Down', note: 'Feeling drained' },
];

function moodColor(mood: number) {
  if (mood >= 4) return 'text-accent';
  if (mood <= 2) return 'text-low';
  return 'text-foreground';
}

export default function RecentEntries() {
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
      <div className="flex flex-col">
        {entries.map((e, i) => (
          <div
            key={e.date}
            className={`grid grid-cols-[90px_50px_1fr_1fr] items-center gap-4 py-3.5 ${
              i !== entries.length - 1 ? 'border-b border-line' : ''
            }`}
          >
            <span className="font-mono text-xs text-text-dim">{e.date}</span>
            <span className={`font-display text-xl font-light ${moodColor(e.mood)}`}>{e.mood}</span>
            <span className="text-sm text-text-mid truncate">{e.tracks}</span>
            <span className="text-sm text-text-dim truncate hidden md:block">{e.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
