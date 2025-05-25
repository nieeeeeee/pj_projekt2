import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth/config';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { rentalId, startDate, endDate } = await req.json();

  if (!rentalId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const booking = await db.rentalBooking.create({
    data: {
      rentalId,
      userId: user.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      confirmed: false,
    },
  });

  return NextResponse.json(booking);
}
