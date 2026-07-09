import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const email = req.nextUrl.searchParams.get('state');

  if (!code || !email) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`,
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokens.access_token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // тягнемо профіль зі Spotify
  const profileRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const profile = await profileRes.json();
  console.log('FULL Spotify profile:', JSON.stringify(profile, null, 2)); // ← ось тут
  const spotifyImage = profile.images?.[0]?.url ?? null;
  console.log('Spotify image:', spotifyImage);

  await prisma.user.update({
    where: { email },
    data: {
      spotifyAccessToken: tokens.access_token,
      spotifyRefreshToken: tokens.refresh_token,
      spotifyTokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
      image: spotifyImage ?? undefined,
    },
  });

  return NextResponse.redirect(new URL('/', req.url));
}
