// app/detail-view/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import PropertyListingPage from '~/app/_components/PropertyListingPage';

const prisma = new PrismaClient();

export default async function DetailPage(context: { params: { id: string } }) {
    const id = parseInt(context.params.id);

    if (isNaN(id)) {
        return <div>Invalid ID</div>;
    }

    const rental = await prisma.rental.findUnique({
        where: { id },
    });

    if (!rental) {
        return <div>Rental not found</div>;
    }

    const apartmentData = {
        price: rental.rent?.toNumber() ?? 0,
        title: rental.title,
        location: rental.location,
        size: `${rental.meterage} m²`,
        rooms: rental.rooms,
        type: "Mieszkanie",
        status: "Wolne",
        heating: "Gazowe",
        landlord: "Właściciel",
        images: rental.images ?? [],
    };

    return <PropertyListingPage data={apartmentData} />;
}
