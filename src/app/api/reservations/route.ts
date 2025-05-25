import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const reservations = await db.rentalBooking.findMany({
      where: { user: { email: session.user.email } },
      include: { rental: true },
    });

    const formatted = reservations.map((r) => ({
      id: r.id,
      propertyId: String(r.rentalId),
      propertyTitle: r.rental.title,
      startDate: r.startDate,
      endDate: r.endDate,
      price: r.rental.price,
      location: r.rental.location,
      image: r.rental.images?.[0]?.url || "",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to get reservations:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
