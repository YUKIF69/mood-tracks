const tracks = [
  {
    rank: '01',
    name: 'Self Care',
    artist: 'Mac Miller',
    plays: 4,
    gradient: 'from-[#4a3f2e] to-[#1f1a12]',
  },
  {
    rank: '02',
    name: 'Ivy',
    artist: 'Frank Ocean',
    plays: 3,
    gradient: 'from-[#3a4a3f] to-[#141f1a]',
  },
  {
    rank: '03',
    name: 'The Less I Know The Better',
    artist: 'Tame Impala',
    plays: 2,
    gradient: 'from-[#2e2e4a] to-[#12121f]',
  },
  {
    rank: '04',
    name: 'Sad But True',
    artist: 'Metallica',
    plays: 2,
    gradient: 'from-[#4a2e2e] to-[#1f1212]',
  },
];

export default function MostPlayed() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Most played this week
        </span>
        <a
          href="#"
          className="font-mono text-xs text-text-dim underline underline-offset-4 hover:text-accent"
        >
          see all →
        </a>
      </div>
      <div className="flex flex-col">
        {tracks.map((t, i) => (
          <div
            key={t.rank}
            className={`flex items-center gap-4 py-3.5 ${i !== tracks.length - 1 ? 'border-b border-line' : ''}`}
          >
            <span className="font-display text-xl font-light text-text-dim w-7">{t.rank}</span>
            <div className={`w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br ${t.gradient}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{t.name}</div>
              <div className="text-xs font-mono text-text-dim">{t.artist}</div>
            </div>
            <span className="font-mono text-xs text-text-dim">{t.plays} plays</span>
          </div>
        ))}
      </div>
    </div>
  );
}
