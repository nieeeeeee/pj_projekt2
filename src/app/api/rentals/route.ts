import { NextResponse } from 'next/server';
import { db } from '~/server/db';

interface RentalCreateRequest {
  title: string;
  description?: string;
  location: string;
  price?: number | null;
  rent?: number | null;
  rooms?: number | null;
  meterage?: number | null;
  images?: string[]; // array of image URLs
}

export async function POST(req: Request) {
  try {
    const body: RentalCreateRequest = await req.json();

    const { title, description, location, price, rent, rooms, meterage, images } = body;

    if (!title || !location) {
      return NextResponse.json({ message: 'Title and location are required' }, { status: 400 });
    }

    // Create rental and related images in one transaction
    const newRental = await db.rental.create({
      data: {
        title,
        description,
        location,
        price: price ?? null,
        rent: rent ?? null,
        rooms: rooms ?? null,
        meterage: meterage ?? null,
        images: images && images.length > 0
          ? {
            create: images.map((imgUrl) => ({
              image: imgUrl,
            })),
          }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ message: 'Rental listing created', rental: newRental }, { status: 201 });
  } catch (error) {
    console.error('Error creating rental listing:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
