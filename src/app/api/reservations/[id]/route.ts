import { NextResponse } from 'next/server';
import { db } from "~/server/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  try {
    const bookingId = parseInt(id);
    await db.rentalBooking.delete({
      where: { id: bookingId },
    });
    return NextResponse.json({ message: 'Booking cancelled' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error cancelling booking' }, { status: 500 });
  }
}
