import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

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

    const confirmedReservation = await prisma.reservation.create({
      data: {
        propertyId,
        propertyTitle,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price,
        location,
        image,
      },
    });

    return res.status(200).json({ success: true, reservation: confirmedReservation });
  } catch (error) {
    console.error("Error confirming reservation:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
