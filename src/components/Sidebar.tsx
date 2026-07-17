import Link from 'next/link';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import ProfileMenu from './ProfileMenu';
import SpotifyMenu from './SpotifyMenu';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function Sidebar({
  activePage,
}: {
  activePage: 'dashboard' | 'history' | 'insights';
}) {
  const session = await auth();

  const dbUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { spotifyAccessToken: true },
      })
    : null;

  const spotifyConnected = !!dbUser?.spotifyAccessToken;

  return (
    <aside className="hidden md:flex w-[220px] flex-shrink-0 border-r border-line p-5 flex-col sticky top-0 h-screen">
      <div className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-wider mb-12">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M1 9H3.5L5.5 3L8.5 15L11 6L13 12L15 9H17"
            stroke="#D4FF6E"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        MoodTracks
      </div>
      <nav className="mb-3 flex-shrink-0">
        <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-3">
          Menu
        </div>
        <Link
          href="/"
          className={`flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg mb-0.5 ${
            activePage === 'dashboard'
              ? 'bg-surface text-foreground'
              : 'text-text-mid hover:bg-surface hover:text-foreground'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke={activePage === 'dashboard' ? 'var(--accent)' : 'currentColor'}
          >
            <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" strokeWidth="1.4" />
            <rect x="8.5" y="1.5" width="6" height="9" rx="1.5" strokeWidth="1.4" />
            <rect x="1.5" y="9.5" width="6" height="5" rx="1.5" strokeWidth="1.4" />
          </svg>
          Dashboard
        </Link>
        <Link
          href="/history"
          className={`flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg mb-0.5 ${
            activePage === 'history'
              ? 'bg-surface text-foreground'
              : 'text-text-mid hover:bg-surface hover:text-foreground'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke={activePage === 'history' ? 'var(--accent)' : 'currentColor'}
          >
            <circle cx="8" cy="8" r="6.5" strokeWidth="1.4" />
            <path
              d="M8 4.5V8L10.5 9.5"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          History
        </Link>
        <Link
          href="/insights"
          className={`flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg mb-0.5 ${
            activePage === 'insights'
              ? 'bg-surface text-foreground'
              : 'text-text-mid hover:bg-surface hover:text-foreground'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke={activePage === 'insights' ? 'var(--accent)' : 'currentColor'}
          >
            <path
              d="M2 13.5V9M6 13.5V5M10 13.5V7M14 13.5V2.5"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          Insights
        </Link>
      </nav>
      <div className="mb-4 flex-shrink-0">
        <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-3">
          Integrations
        </div>
        {spotifyConnected ? <SpotifyMenu /> : <a href="/api/spotify/connect">Connect Spotify</a>}
      </div>
      <div className="mt-auto pt-5 border-t border-line flex-shrink-0">
        <ProfileMenu name={session?.user?.name} image={session?.user?.image} />
      </div>
    </aside>
  );
}
