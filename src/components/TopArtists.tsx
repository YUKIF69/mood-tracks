'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Artist {
  id: string;
  name: string;
  count: number | null;
  image: string | null;
}

export default function TopArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/spotify/top-artists')
      .then((r) => r.json())
      .then((data) => {
        if (data.artists) setArtists(data.artists);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 md:p-7 flex flex-col">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Top artists
        </span>
        <a
          href="/profile"
          className="font-mono text-xs text-text-dim underline underline-offset-4 hover:text-accent"
        >
          see all →
        </a>
      </div>
      {loading ? (
        <div className="text-sm text-text-dim font-mono py-4">Loading...</div>
      ) : artists.length === 0 ? (
        <div className="text-sm text-text-dim font-mono py-4">No data yet</div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {artists.map((a, i) => (
            <div key={a.id} className="flex items-center gap-3 flex-1">
              {a.image ? (
                <Image
                  src={a.image}
                  alt={a.name}
                  width={48}
                  height={48}
                  className="rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-surface-2 border border-line flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{a.name}</div>
                <div className="font-mono text-xs text-text-dim">#{i + 1} this month</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
