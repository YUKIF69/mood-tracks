import { auth, signIn, signOut } from '@/auth';
import MoodCalendar from '@/components/MoodCalendar';
import MoodCard from '@/components/MoodCard';
import MoodTrendChart from '@/components/MoodTrendChart';
import MostPlayed from '@/components/MostPlayed';
import RecentEntries from '@/components/RecentEntries';
import TopArtists from '@/components/TopArtists';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StreakCard from '@/components/StreakCard';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function Home() {
  const session = await auth();

  const dbUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { spotifyAccessToken: true },
      })
    : null;

  const spotifyConnected = !!dbUser?.spotifyAccessToken;

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-display font-medium mb-4">MoodTracks</h1>
          <p className="text-text-mid mb-6">Track your mood and music</p>
          <form
            action={async () => {
              'use server';
              await signIn('google');
            }}
          >
            <button className="bg-accent text-[#14180A] px-6 py-3 rounded-full font-semibold hover:bg-[#c2f25a]">
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar activePage="dashboard" />

      {/* Main */}
      <main className="flex-1 p-5 md:p-9 max-w-[1180px] pb-24 md:pb-0">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-1 md:mb-2">
              Good evening, <span className="text-accent">{session.user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-sm text-text-mid">
              Your mood climbed this week — let&apos;s see why.
            </p>
          </div>
          <div className="hidden md:flex font-mono text-xs text-text-dim border border-line rounded-full px-4 py-2 items-center gap-2 mt-0">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor">
              <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" strokeWidth="1.3" />
              <path d="M1.5 5.5H12.5M4 1V3M10 1V3" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {new Date()
              .toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
              .toLowerCase()}
          </div>
        </div>

        {/* Grid: mood today + insight */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 md:gap-5 mb-4 md:mb-5">
          {/* Mood today */}
          <MoodCard />

          <div className="flex flex-col gap-5">
            {/* Streak */}
            <StreakCard />

            {/* AI Insight */}
            <div className="bg-surface border border-line rounded-2xl p-7 flex flex-col relative overflow-hidden flex-1">
              <div className="absolute -top-1/4 -right-1/4 w-56 h-56 rounded-full bg-accent/[0.07] blur-3xl" />
              <div className="font-mono text-[11px] uppercase tracking-wider text-accent mb-4">
                ✦ Latest insight
              </div>
              <div className="font-display font-light text-2xl leading-snug mb-3">
                You&apos;re more <span className="text-accent font-semibold">you</span> on weekends.
              </div>
              <p className="text-sm text-text-mid leading-relaxed mb-6 flex-1">
                Your mood runs about 30% higher on Saturdays and Sundays — and your library shifts
                toward calmer, more melodic tracks on those same days.
              </p>
              <button className="font-mono text-xs text-text-dim underline underline-offset-4 hover:text-accent text-left">
                Generate new insight →
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 md:gap-5 mb-4 md:mb-5 items-start">
          <MoodTrendChart />
          <MoodCalendar />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 md:gap-5 mb-4 md:mb-5">
          <MostPlayed />
          <TopArtists />
        </div>
        <RecentEntries />
      </main>
    </div>
  );
}
