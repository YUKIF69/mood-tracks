'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';

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
        <div className="w-8 h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center text-xs text-text-mid flex-shrink-0 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name ?? 'User'}
              className="w-full h-full object-cover cursor-pointer"
            />
          ) : (
            (name?.[0] ?? 'U')
          )}
        </div>
        <div className="text-[13px] truncate">{name}</div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-surface border border-line rounded-xl overflow-hidden shadow-lg z-10">
          <a
            href="/profile"
            className="block w-full text-left px-4 py-2.5 text-sm text-text-mid hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            Profile
          </a>
          <div className="border-t border-line" />
          <a
            href="#"
            className="block w-full text-left px-4 py-2.5 text-sm text-text-mid hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            Settings
          </a>
          <div className="border-t border-line" />
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2.5 text-sm text-text-dim hover:bg-surface-2 hover:text-foreground transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
