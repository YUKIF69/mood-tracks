'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

interface BottomProfileMenuProps {
  name: string | null | undefined;
  image: string | null | undefined;
  spotifyConnected: boolean;
}

export default function BottomProfileMenu({
  name,
  image,
  spotifyConnected,
}: BottomProfileMenuProps) {
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
        className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-text-dim"
      >
        <div className="w-6 h-6 rounded-full overflow-hidden border border-line flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt={name ?? 'User'}
              width={24}
              height={24}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-surface-2 flex items-center justify-center text-[10px]">
              {name?.[0] ?? 'U'}
            </div>
          )}
        </div>
        <span className="font-mono text-[10px]">Profile</span>
      </button>

      {open && (
        <div className="fixed bottom-16 right-4 w-52 bg-surface border border-line rounded-xl overflow-hidden shadow-lg z-50">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              {image ? (
                <Image
                  src={image}
                  alt={name ?? ''}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-surface-2 flex items-center justify-center text-xs">
                  {name?.[0]}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{name}</div>
            </div>
          </div>
          <a
            href="/profile"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-mid hover:bg-surface-2 hover:text-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <circle cx="8" cy="5.5" r="2.5" strokeWidth="1.4" />
              <path
                d="M2.5 13.5c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Profile
          </a>
          {spotifyConnected ? (
            <a
              href="/api/spotify/disconnect"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-mid hover:bg-surface-2 hover:text-foreground transition-colors border-t border-line"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1ED760">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.223-2.722a.779.779 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.779.779 0 01-.972-.519.78.78 0 01.52-.972c3.632-1.102 8.147-.568 11.233 1.328a.779.779 0 01.256 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.337a.935.935 0 01-.955 1.61z" />
              </svg>
              Disconnect Spotify
            </a>
          ) : (
            <a
              href="/api/spotify/connect"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-mid hover:bg-surface-2 hover:text-foreground transition-colors border-t border-line"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.223-2.722a.779.779 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.779.779 0 01-.972-.519.78.78 0 01.52-.972c3.632-1.102 8.147-.568 11.233 1.328a.779.779 0 01.256 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.337a.935.935 0 01-.955 1.61z" />
              </svg>
              Connect Spotify
            </a>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-low hover:bg-surface-2 transition-colors border-t border-line"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path
                d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
