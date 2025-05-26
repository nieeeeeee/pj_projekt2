import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/server/auth/config';
import ClientDetailPage from './ClientDetailPage';
import { db } from '~/server/db';
import { notFound } from 'next/navigation';

interface DetailPageProps {
    params: Promise<{ id: string }>; // ✅ this fixes the runtime issue
}

export default async function DetailPage({ params }: DetailPageProps) {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) return <div>Invalid ID</div>;

    const session = await getServerSession(authOptions);
    const isLoggedIn = !!session?.user;

    const rental = await db.rental.findUnique({
        where: { id },
        include: {
            images: true,
            rentalBookings: true,
        },
    });

    if (!rental) {
        notFound();
    }

    const apartmentData = {
        id: rental.id,
        price: rental.rent?.toNumber() ?? 0,
        title: rental.title,
        location: rental.location,
        size: `${rental.meterage} m²`,
        rooms: rental.rooms,
        type: 'Mieszkanie',
        status: 'Wolne',
        heating: 'Gazowe',
        landlord: 'Właściciel',
        images: Array.isArray(rental.images)
          ? rental.images.map((img) =>
            typeof img === 'string' ? img : img.image ?? '',
          )
          : [],
        bookings:
          rental.rentalBookings?.map((b) => ({
              startDate: b.startDate.toISOString(),
              endDate: b.endDate.toISOString(),
          })) ?? [],
    };

    return (
      <ClientDetailPage
        data={apartmentData}
        isLoggedIn={isLoggedIn}
        user={session?.user ?? null}
      />
    );
}
