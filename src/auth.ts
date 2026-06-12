import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    async redirect() {
      return '/';
    },
  },
});
