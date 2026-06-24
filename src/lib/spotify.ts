import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function getValidSpotifyToken(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      spotifyAccessToken: true,
      spotifyRefreshToken: true,
      spotifyTokenExpiry: true,
    },
  });

  if (!user?.spotifyAccessToken) return null;

  // якщо токен ще живий — повертаємо його
  const isExpired = user.spotifyTokenExpiry ? new Date() > new Date(user.spotifyTokenExpiry) : true;

  if (!isExpired) return user.spotifyAccessToken;

  // токен протух — оновлюємо
  if (!user.spotifyRefreshToken) return null;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`,
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.spotifyRefreshToken,
    }),
  });

  const tokens = await res.json();

  if (!tokens.access_token) return null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      spotifyAccessToken: tokens.access_token,
      spotifyRefreshToken: tokens.refresh_token ?? user.spotifyRefreshToken,
      spotifyTokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
    },
  });

  return tokens.access_token;
}
