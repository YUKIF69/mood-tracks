'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

interface ProfileMenuProps {
  name: string | null | undefined;
  image: string | null | undefined;
}

export default function ProfileMenu({ name, image }: ProfileMenuProps) {
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
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2.5 w-full text-left">
        <div className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center text-xs text-text-mid flex-shrink-0 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name ?? 'User'}
              width={36}
              height={36}
              className="w-9 h-9 object-cover cursor-pointer"
            />
          ) : (
            (name?.[0] ?? 'U')
          )}
        </div>
        <div className="text-[14px] truncate">{name}</div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-surface border border-line rounded-xl overflow-hidden shadow-lg z-10">
          <a
            href="/profile"
            className="flex items-center content-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-text-mid hover:bg-surface-2 hover:text-foreground transition-colors"
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
          <div className="border-t border-line" />
          <a
            href="#"
            className="flex items-center content-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-text-mid hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <circle cx="8" cy="8" r="6.5" strokeWidth="1.4" />
              <path d="M8 5v3l2 1" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Settings
          </a>
          <div className="border-t border-line" />
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-low hover:bg-surface-2 cursor-pointer transition-colors duration-200 "
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
