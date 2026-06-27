import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Link from 'next/link';
import Image from 'next/image';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function InsightsPage() {
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

  // статистика
  const totalEntries = entries.length;
  const avgMood = totalEntries
    ? Math.round((entries.reduce((a, b) => a + b.mood, 0) / totalEntries) * 10) / 10
    : null;

  const bestMood = totalEntries ? Math.max(...entries.map((e) => e.mood)) : null;
  const worstMood = totalEntries ? Math.min(...entries.map((e) => e.mood)) : null;

  // топ артисти
  const artistData: Record<string, { count: number; image: string | null }> = {};
  entries.forEach((e) => {
    e.tracks.forEach((t) => {
      if (!artistData[t.artist]) {
        artistData[t.artist] = { count: 0, image: t.albumCover };
      }
      artistData[t.artist].count++;
    });
  });
  const topArtists = Object.entries(artistData)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  // настрій по днях тижня
  const dayMoods: Record<string, number[]> = {};
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  entries.forEach((e) => {
    const day = days[new Date(e.date).getDay()];
    if (!dayMoods[day]) dayMoods[day] = [];
    dayMoods[day].push(e.mood);
  });
  const avgByDay = days.map((day) => ({
    day,
    avg: dayMoods[day]
      ? Math.round((dayMoods[day].reduce((a, b) => a + b, 0) / dayMoods[day].length) * 10) / 10
      : null,
  }));

  // найкращий день
  const bestDay = avgByDay.reduce(
    (best, curr) => (curr.avg && (!best.avg || curr.avg > best.avg) ? curr : best),
    avgByDay[0],
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
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
            className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg text-text-mid hover:bg-surface hover:text-foreground mb-0.5"
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
            className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg text-text-mid hover:bg-surface hover:text-foreground mb-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
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
            className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg bg-surface text-foreground mb-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent)">
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

      <main className="flex-1 p-9 max-w-[1180px]">
        <div className="mb-10">
          <h1 className="font-display font-light text-3xl tracking-tight mb-2">Insights</h1>
          <p className="text-sm text-text-mid">Patterns from your {totalEntries} entries</p>
        </div>

        {totalEntries === 0 ? (
          <div className="text-sm text-text-dim font-mono">
            No entries yet — start logging your mood on the dashboard.
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-5 mb-5">
              {[
                { label: 'Total entries', value: totalEntries },
                { label: 'Avg mood', value: avgMood },
                { label: 'Best mood', value: bestMood },
                { label: 'Best day', value: bestDay?.avg ? bestDay.day : '—' },
              ].map((s) => (
                <div key={s.label} className="bg-surface border border-line rounded-2xl p-6">
                  <div className="font-display text-4xl font-light mb-2 text-accent">{s.value}</div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Mood by day of week */}
            <div className="bg-surface border border-line rounded-2xl p-7 mb-5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-6">
                Avg mood by day of week
              </div>
              <div className="flex items-end gap-3" style={{ height: '120px' }}>
                {avgByDay.map((d) => (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                  >
                    <div className="font-mono text-xs text-text-dim">{d.avg ?? '—'}</div>
                    <div
                      className="w-full rounded-md transition-all"
                      style={{
                        height: d.avg ? `${(d.avg / 5) * 80}px` : '3px',
                        background: d.avg
                          ? `rgba(212,255,110,${0.3 + (d.avg / 5) * 0.7})`
                          : 'var(--line)',
                      }}
                    />
                    <div className="font-mono text-[10px] text-text-dim">{d.day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top artists */}
            <div className="bg-surface border border-line rounded-2xl p-7">
              <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-6">
                Top artists — all time
              </div>
              <div className="flex flex-col gap-2">
                {topArtists.map(([name, data], i) => (
                  <div
                    key={name}
                    className="flex items-center gap-4 py-3 border-b border-line last:border-0"
                  >
                    <span className="font-display text-xl font-light text-text-dim w-7">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {data.image ? (
                      <Image
                        src={data.image}
                        alt={name}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-surface-2 border border-line flex-shrink-0" />
                    )}
                    <span className="flex-1 text-sm font-medium">{name}</span>
                    <span className="font-mono text-xs text-text-dim">{data.count} tracks</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
