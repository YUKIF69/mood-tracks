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

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const entries = await prisma.moodEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: firstDay, lte: lastDay },
    },
  });

  // групуємо по днях і беремо середнє
  const dayMap: Record<number, number[]> = {};
  entries.forEach((e) => {
    const day = new Date(e.date).getDate();
    if (!dayMap[day]) dayMap[day] = [];
    dayMap[day].push(e.mood);
  });

  const days: Record<number, number> = {};
  Object.entries(dayMap).forEach(([day, moods]) => {
    days[Number(day)] = Math.round(moods.reduce((a, b) => a + b, 0) / moods.length);
  });

  const monthName = now
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    .toLowerCase();
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // 0=Mon

  return NextResponse.json({ days, monthName, firstDayOfWeek, totalDays: lastDay.getDate() });
}
