import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Sidebar from '@/components/Sidebar';
import ProfileContent from '@/components/ProfileContent';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect('/');

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? '' },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      spotifyAccessToken: true,
      _count: { select: { moodEntries: true } },
    },
  });

  if (!user) redirect('/');

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="dashboard" />
      <main className="flex-1 p-9 max-w-[1180px]">
        <ProfileContent user={user} session={session} />
      </main>
    </div>
  );
}
