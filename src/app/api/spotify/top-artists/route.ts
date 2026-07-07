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

  if (!user) return NextResponse.json({ artists: [] });

  const token = await getValidSpotifyToken(user.id);
  if (!token) return NextResponse.json({ artists: [] });

  const res = await fetch(
    'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term',
    { headers: { Authorization: `Bearer ${token}` } },
  );

  const data = await res.json();
  if (!data.items) return NextResponse.json({ artists: [] });

  const artists = data.items.map((a: { id: string; name: string; images: { url: string }[] }) => ({
    id: a.id,
    name: a.name,
    count: null,
    image: a.images?.[1]?.url ?? a.images?.[0]?.url ?? null,
  }));

  return NextResponse.json({ artists });
}
