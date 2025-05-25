import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const bookings = await db.rentalBooking.findMany({
    where: { userId: user.id },
    include: {
      rental: {
        include: {
          images: true,
        },
      },
    },
    orderBy: { startDate: "desc" },
  });

  const reservations = bookings.map((b) => ({
    id: b.id,
    propertyId: b.rentalId.toString(),
    propertyTitle: b.rental.title,
    startDate: b.startDate,
    endDate: b.endDate,
    price: b.rental.rent?.toNumber() ?? 0,
    location: b.rental.location,
    image: b.rental.images?.[0]?.image ?? "",
    confirmed: b.confirmed,
  }));

  return NextResponse.json({ reservations });
}
