import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import BottomNavClient from './BottomNavClient';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function BottomNavWrapper() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { spotifyAccessToken: true },
  });

  return (
    <BottomNavClient
      name={session.user.name}
      image={session.user.image}
      spotifyConnected={!!dbUser?.spotifyAccessToken}
    />
  );
}
