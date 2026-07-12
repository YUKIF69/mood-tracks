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

  if (!user) return NextResponse.json({ streak: 0, loggedToday: false });

  const entries = await prisma.moodEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    select: { date: true },
  });

  if (entries.length === 0) return NextResponse.json({ streak: 0, loggedToday: false });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDays = [
    ...new Set(
      entries.map((e) => {
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }),
    ),
  ].sort((a, b) => b - a);

  const loggedToday = uniqueDays[0] === today.getTime();

  let streak = 0;
  let current = today.getTime();

  if (!loggedToday) {
    current = today.getTime() - 86400000;
  }

  for (const day of uniqueDays) {
    if (day === current) {
      streak++;
      current -= 86400000;
    } else {
      break;
    }
  }

  return NextResponse.json({ streak, loggedToday });
}
