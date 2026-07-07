import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';

const scopes = ['user-read-recently-played', 'user-read-currently-playing', 'user-top-read'].join(
  ' ',
);

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const params = new URLSearchParams({
    client_id: process.env.AUTH_SPOTIFY_ID!,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: scopes,
    state: session.user.email,
  });

  return NextResponse.redirect(`${SPOTIFY_AUTH_URL}?${params.toString()}`);
}
