import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';

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

  // топ артисти зі Spotify
  const userWithSpotify = await prisma.user.findUnique({
    where: { email: session.user?.email ?? '' },
    select: { id: true, spotifyAccessToken: true },
  });

  let topArtists: { id: string; name: string; image: string | null }[] = [];

  if (userWithSpotify?.spotifyAccessToken) {
    const { getValidSpotifyToken } = await import('@/lib/spotify');
    const token = await getValidSpotifyToken(userWithSpotify.id);
    if (token) {
      const res = await fetch(
        'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (data.items) {
        topArtists = data.items.map(
          (a: { id: string; name: string; images: { url: string }[] }) => ({
            id: a.id,
            name: a.name,
            image: a.images?.[1]?.url ?? a.images?.[0]?.url ?? null,
          }),
        );
      }
    }
  }

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
      <Sidebar activePage="insights" />
      <main className="flex-1 p-5 md:p-9 max-w-[1180px]">
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
                {topArtists.map((a, i) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 py-3 border-b border-line last:border-0"
                  >
                    <span className="font-display text-xl font-light text-text-dim w-7">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {a.image ? (
                      <Image
                        src={a.image}
                        alt={a.name}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-surface-2 border border-line flex-shrink-0" />
                    )}
                    <span className="flex-1 text-sm font-medium">{a.name}</span>
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
