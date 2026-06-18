import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { mood, note, track } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const entry = await prisma.moodEntry.create({
    data: {
      userId: user.id,
      date: new Date(),
      mood,
      note: note || null,
      tracks: track
        ? {
            create: {
              title: track.name,
              artist: track.artist,
              albumCover: track.albumCover,
              spotifyId: track.spotifyId,
            },
          }
        : undefined,
    },
  });

  return NextResponse.json({ success: true, entry });
}
