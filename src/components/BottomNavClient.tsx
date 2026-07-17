'use client';

import { usePathname } from 'next/navigation';
import BottomProfileMenu from './BottomProfileMenu';

interface Props {
  name: string | null | undefined;
  image: string | null | undefined;
  spotifyConnected: boolean;
}

export default function BottomNavClient({ name, image, spotifyConnected }: Props) {
  const pathname = usePathname();

  const items = [
    {
      href: '/',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" strokeWidth="1.4" />
          <rect x="8.5" y="1.5" width="6" height="9" rx="1.5" strokeWidth="1.4" />
          <rect x="1.5" y="9.5" width="6" height="5" rx="1.5" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      href: '/history',
      label: 'History',
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <circle cx="8" cy="8" r="6.5" strokeWidth="1.4" />
          <path
            d="M8 4.5V8L10.5 9.5"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      href: '/insights',
      label: 'Insights',
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <path
            d="M2 13.5V9M6 13.5V5M10 13.5V7M14 13.5V2.5"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-line z-50 md:hidden overflow-visible">
      <div className="flex items-center justify-around px-2 py-2 overflow-visible">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
                active ? 'text-accent' : 'text-text-dim'
              }`}
            >
              {item.icon}
              <span className="font-mono text-[10px]">{item.label}</span>
            </a>
          );
        })}
        <BottomProfileMenu name={name} image={image} spotifyConnected={spotifyConnected} />
      </div>
    </nav>
  );
}
