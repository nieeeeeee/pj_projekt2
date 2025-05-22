import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db"; // adjust import path to your Prisma client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id, propertyId, propertyTitle, startDate, endDate, price, location, image } = req.body;

    if (!propertyId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save the confirmed reservation to your database
    const confirmedReservation = await prisma.reservation.create({
      data: {
        // If your Prisma schema uses auto-increment, omit id here or adjust accordingly
        propertyId,
        propertyTitle,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price,
        location,
        image,
        // If you have user auth session, attach userId here:
        // userId: req.session?.user?.id || null,
      },
    });

    return res.status(200).json({ success: true, reservation: confirmedReservation });
  } catch (error) {
    console.error("Error confirming reservation:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
