import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getValidSpotifyToken } from '@/lib/spotify';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { mood, note } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const lastEntry = await prisma.moodEntry.findFirst({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });

  const since = lastEntry ? new Date(lastEntry.date) : new Date(Date.now() - 24 * 60 * 60 * 1000);

  let tracks: {
    title: string;
    artist: string;
    albumCover: string | null;
    spotifyId: string;
  }[] = [];

  const token = await getValidSpotifyToken(user.id);

  if (token) {
    const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.items) {
      const seen = new Set<string>();
      tracks = data.items
        .filter((item: { played_at: string }) => new Date(item.played_at) >= since)
        .filter((item: { track: { id: string } }) => {
          if (seen.has(item.track.id)) return false;
          seen.add(item.track.id);
          return true;
        })
        .map(
          (item: {
            track: {
              id: string;
              name: string;
              artists: { name: string }[];
              album: { images: { url: string }[] };
            };
          }) => ({
            title: item.track.name,
            artist: item.track.artists[0].name,
            albumCover: item.track.album.images?.[1]?.url ?? null,
            spotifyId: item.track.id,
          }),
        );
    }
  }

  const entry = await prisma.moodEntry.create({
    data: {
      userId: user.id,
      date: new Date(),
      mood,
      note: note || null,
      tracks: tracks.length > 0 ? { create: tracks } : undefined,
    },
    include: { tracks: true },
  });

  return NextResponse.json({ success: true, entry });
}
