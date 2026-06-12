const artists = [
  { rank: '01', name: 'Mac Miller', plays: 18 },
  { rank: '02', name: 'Frank Ocean', plays: 14 },
  { rank: '03', name: 'Radiohead', plays: 11 },
  { rank: '04', name: 'The 1975', plays: 7 },
];

export default function TopArtists() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Top artists
        </span>
        <a
          href="#"
          className="font-mono text-xs text-text-dim underline underline-offset-4 hover:text-accent"
        >
          see all →
        </a>
      </div>
      <div className="flex flex-col">
        {artists.map((a, i) => (
          <div
            key={a.rank}
            className={`flex items-center gap-4 py-3.5 ${i !== artists.length - 1 ? 'border-b border-line' : ''}`}
          >
            <span className="font-display text-xl font-light text-text-dim w-7">{a.rank}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{a.name}</div>
            </div>
            <span className="font-mono text-xs text-text-dim">{a.plays} plays</span>
          </div>
        ))}
      </div>
    </div>
  );
}
