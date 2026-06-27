import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import HistoryList from '@/components/HistoryList';
import Link from 'next/link';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function HistoryPage() {
  const session = await auth();
  if (!session) redirect('/');

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? '' },
  });

  if (!user) redirect('/');

  const entries = await prisma.moodEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    include: { tracks: true },
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar — той самий що в page.tsx */}
      <aside className="w-[220px] flex-shrink-0 border-r border-line p-5 flex flex-col sticky top-0 h-screen">
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
        <nav className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-3">
            Menu
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg text-text-mid hover:bg-surface hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" strokeWidth="1.4" />
              <rect x="8.5" y="1.5" width="6" height="9" rx="1.5" strokeWidth="1.4" />
              <rect x="1.5" y="9.5" width="6" height="5" rx="1.5" strokeWidth="1.4" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg bg-surface text-foreground mb-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent)">
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
            className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg text-text-mid hover:bg-surface hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path
                d="M2 13.5V9M6 13.5V5M10 13.5V7M14 13.5V2.5"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Insights
          </Link>
        </nav>
        <div className="mt-auto pt-5 border-t border-line flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center text-xs text-text-mid">
            {session.user?.name?.[0] ?? 'U'}
          </div>
          <div className="text-[13px]">{session.user?.name}</div>
        </div>
      </aside>

      <main className="flex-1 p-9">
        <div className="mb-8">
          <h1 className="font-display font-light text-3xl tracking-tight mb-2">History</h1>
          <p className="text-sm text-text-mid">{entries.length} entries total</p>
        </div>
        <HistoryList entries={entries} />
      </main>
    </div>
  );
}
