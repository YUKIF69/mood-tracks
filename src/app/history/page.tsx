import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import HistoryList from '@/components/HistoryList';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

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
      <Sidebar activePage="history" />

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
