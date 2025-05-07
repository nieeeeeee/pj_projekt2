// app/detail-view/[id]/page.tsx
import PropertyListingPage from '~/app/_components/PropertyListingPage';
import { db } from '~/server/db';

export default async function DetailPage(context: { params: { id: string } }) {
    const id = parseInt(context.params.id);

    if (isNaN(id)) {
        return <div>Invalid ID</div>;
    }

    const rental = await db.rental.findUnique({
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
        images: Array.isArray(rental.images) ? rental.images as string[] : [],
    };

    return <PropertyListingPage data={apartmentData} />;
}
