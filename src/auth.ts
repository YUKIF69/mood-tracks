import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Spotify from 'next-auth/providers/spotify';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { AdapterUser } from '@auth/core/adapters';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const baseAdapter = PrismaAdapter(prisma);

const customAdapter = {
  ...baseAdapter,
  async updateUser(data: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
    const existing = await prisma.user.findUnique({
      where: { id: data.id },
      select: { image: true },
    });

    const updated = await prisma.user.update({
      where: { id: data.id },
      data: {
        ...data,
        image: existing?.image ?? data.image,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email!, // AdapterUser вимагає string, не null
      emailVerified: updated.emailVerified,
      image: updated.image,
    };
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: customAdapter,
  providers: [
    Google({
      checks: ['state'],
    }),
    Spotify({
      authorization: {
        params: {
          scope: 'user-read-recently-played user-read-currently-playing',
        },
      },
    }),
  ],
  callbacks: {
    async redirect() {
      return '/';
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { image: true },
        });
        if (dbUser?.image) {
          session.user.image = dbUser.image;
        }
      }
      return session;
    },
  },
});
