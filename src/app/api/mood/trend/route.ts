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

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const entries = await prisma.moodEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: sevenDaysAgo },
    },
    orderBy: { date: 'asc' },
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dataMap: Record<string, number[]> = {};

  entries.forEach((entry) => {
    const day = days[new Date(entry.date).getDay() === 0 ? 6 : new Date(entry.date).getDay() - 1];
    if (!dataMap[day]) dataMap[day] = [];
    dataMap[day].push(entry.mood);
  });

  const data = days.map((day) => ({
    day,
    mood: dataMap[day]
      ? Math.round((dataMap[day].reduce((a, b) => a + b, 0) / dataMap[day].length) * 10) / 10
      : null,
  }));

  const allMoods = entries.map((e) => e.mood);
  const avg = allMoods.length
    ? Math.round((allMoods.reduce((a, b) => a + b, 0) / allMoods.length) * 10) / 10
    : null;

  const bestDay = entries.length
    ? days[
        new Date(entries.reduce((a, b) => (a.mood > b.mood ? a : b)).date).getDay() === 0
          ? 6
          : new Date(entries.reduce((a, b) => (a.mood > b.mood ? a : b)).date).getDay() - 1
      ]
    : null;

  return NextResponse.json({ data, avg, bestDay });
}
