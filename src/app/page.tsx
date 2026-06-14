import { auth, signIn, signOut } from '@/auth';
import MoodCalendar from '@/components/MoodCalendar';
import MoodCard from '@/components/MoodCard';
import MoodTrendChart from '@/components/MoodTrendChart';
import MostPlayed from '@/components/MostPlayed';
import RecentEntries from '@/components/RecentEntries';
import TopArtists from '@/components/TopArtists';

export default async function Home() {
  const session = await auth();

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
      <aside className="w-[220px] flex-shrink-0 border-r border-line p-5 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-wider mb-12">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
          <div className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg bg-surface mb-0.5 cursor-pointer">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="var(--accent)"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" strokeWidth="1.4" />
              <rect x="8.5" y="1.5" width="6" height="9" rx="1.5" strokeWidth="1.4" />
              <rect x="1.5" y="9.5" width="6" height="5" rx="1.5" strokeWidth="1.4" />
            </svg>
            Dashboard
          </div>
          <div className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg text-text-mid hover:bg-surface hover:text-foreground cursor-pointer">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
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
          </div>
          <div className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg text-text-mid hover:bg-surface hover:text-foreground cursor-pointer">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 13.5V9M6 13.5V5M10 13.5V7M14 13.5V2.5"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Insights
          </div>
          <div className="mb-4">
            <div className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-3 mt-3.5">
              Integrations
            </div>
            <a
              href="/api/spotify/connect"
              className="flex items-center gap-3 text-sm px-2.5 py-2.5 rounded-lg text-text-mid hover:bg-surface hover:text-foreground cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.223-2.722a.779.779 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.779.779 0 01-.972-.519.78.78 0 01.52-.972c3.632-1.102 8.147-.568 11.233 1.328a.779.779 0 01.256 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.337a.935.935 0 01-.955 1.61z" />
              </svg>
              Connect Spotify
            </a>
          </div>
        </nav>

        <div className="mt-auto pt-5 border-t border-line flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center text-xs text-text-mid flex-shrink-0">
            {session.user?.name?.[0] ?? 'U'}
          </div>
          <div>
            <div className="text-[13px]">{session.user?.name}</div>
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <button className="text-[11px] font-mono text-text-dim hover:text-foreground">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-9 max-w-[1180px]">
        {/* Top row */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-display font-medium tracking-tight mb-2">
              Good evening, <span className="text-accent">{session.user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-sm text-text-mid">
              Your mood climbed this week — let&apos;s see why.
            </p>
          </div>
          <div className="font-mono text-xs text-text-dim border border-line rounded-full px-4 py-2 flex items-center gap-2">
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" strokeWidth="1.3" />
              <path d="M1.5 5.5H12.5M4 1V3M10 1V3" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {new Date()
              .toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
              .toLowerCase()}
          </div>
        </div>

        {/* Grid: mood today + insight */}
        <div className="grid grid-cols-[1.6fr_1fr] gap-5 mb-5">
          {/* Mood today */}
          <MoodCard />

          {/* AI Insight */}
          <div className="bg-surface border border-line rounded-2xl p-7 flex flex-col relative overflow-hidden">
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
        <div className="grid grid-cols-[1.6fr_1fr] gap-5 mb-5">
          <MoodTrendChart />
          <MoodCalendar />
        </div>
        <div className="grid grid-cols-[1.6fr_1fr] gap-5 mb-5">
          <MostPlayed />
          <TopArtists />
        </div>
        <RecentEntries />
      </main>
    </div>
  );
}
