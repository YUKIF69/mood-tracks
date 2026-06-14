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

  if (!user?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 });
  }

  const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
    headers: { Authorization: `Bearer ${user.spotifyAccessToken}` },
  });

  const data = await res.json();
  if (!data.items) return NextResponse.json({ artists: [] });

  const countMap: Record<string, { name: string; count: number }> = {};
  data.items.forEach((item: { track: { artists: { id: string; name: string }[] } }) => {
    item.track.artists.forEach((artist) => {
      if (countMap[artist.id]) {
        countMap[artist.id].count++;
      } else {
        countMap[artist.id] = { name: artist.name, count: 1 };
      }
    });
  });

  const top = Object.entries(countMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  //   const ids = top.map(([id]) => id).join(',');
  //   const artistRes = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, {
  //     headers: { Authorization: `Bearer ${user.spotifyAccessToken}` },
  //   });
  //   const artistData = await artistRes.json();

  const artistImages: Record<string, string> = {};
  data.items.forEach(
    (item: { track: { artists: { id: string }[]; album: { images: { url: string }[] } } }) => {
      item.track.artists.forEach((artist) => {
        if (!artistImages[artist.id] && item.track.album.images?.[1]?.url) {
          artistImages[artist.id] = item.track.album.images[1].url;
        }
      });
    },
  );

  const artists = top.map(([id, info]) => ({
    id,
    name: info.name,
    count: info.count,
    image: artistImages[id] ?? null,
  }));

  return NextResponse.json({ artists });
}
