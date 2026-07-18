import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return NextResponse.json({ correlations: [] });

  const entries = await prisma.moodEntry.findMany({
    where: { userId: user.id },
    include: { tracks: true },
  });

  // рахуємо avg mood по артистах
  const artistMoods: Record<string, { total: number; count: number; image: string | null }> = {};

  entries.forEach((entry) => {
    entry.tracks.forEach((track) => {
      if (!artistMoods[track.artist]) {
        artistMoods[track.artist] = { total: 0, count: 0, image: track.albumCover };
      }
      artistMoods[track.artist].total += entry.mood;
      artistMoods[track.artist].count++;
    });
  });

  const correlations = Object.entries(artistMoods)
    .filter(([, data]) => data.count >= 2) // тільки артисти з 2+ записами
    .map(([artist, data]) => ({
      artist,
      avgMood: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
      image: data.image,
    }))
    .sort((a, b) => b.avgMood - a.avgMood)
    .slice(0, 10);

  return NextResponse.json({ correlations });
}
