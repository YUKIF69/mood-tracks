import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getValidSpotifyToken } from '@/lib/spotify';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const token = await getValidSpotifyToken(user.id);
  if (!token) return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 });

  const timeRange = req.nextUrl.searchParams.get('time_range') ?? 'short_term';

  const [artistsRes, tracksRes] = await Promise.all([
    fetch(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const [artists, tracks] = await Promise.all([artistsRes.json(), tracksRes.json()]);

  return NextResponse.json({ artists: artists.items ?? [], tracks: tracks.items ?? [] });
}
