import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getValidSpotifyToken } from '@/lib/spotify';

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

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const token = await getValidSpotifyToken(user.id);
  if (!token) return NextResponse.json({ playing: false });

  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) return NextResponse.json({ playing: false });

  const data = await res.json();
  return NextResponse.json({
    playing: data.is_playing,
    track: {
      name: data.item?.name,
      artist: data.item?.artists?.[0]?.name,
      albumCover: data.item?.album?.images?.[1]?.url,
      spotifyId: data.item?.id,
    },
  });
}
