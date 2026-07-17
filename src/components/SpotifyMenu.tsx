'use client';

import { useState, useRef, useEffect } from 'react';

export default function SpotifyMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg w-full hover:bg-surface transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1ED760">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.223-2.722a.779.779 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.779.779 0 01-.972-.519.78.78 0 01.52-.972c3.632-1.102 8.147-.568 11.233 1.328a.779.779 0 01.256 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.337a.935.935 0 01-.955 1.61z" />
        </svg>
        <span className="text-[#1ED760] text-xs font-mono">Spotify connected</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-surface-2 border border-line rounded-xl overflow-hidden shadow-lg z-10">
          <div className="px-4 py-3 border-b border-line">
            <div className="text-xs font-mono text-text-dim">Connected account</div>
          </div>
          <a
            href="/api/spotify/disconnect"
            className="block w-full text-left px-4 py-2.5 text-sm text-low hover:bg-surface transition-colors"
            onClick={() => setOpen(false)}
          >
            Disconnect Spotify
          </a>
        </div>
      )}
    </div>
  );
}
