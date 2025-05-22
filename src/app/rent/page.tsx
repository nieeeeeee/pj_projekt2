import Navbar from '~/app/_components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApartmentCard from "~/app/_components/ApartmentCard";
import { db } from "~/server/db";
import ClientSearch from "~/app/_components/ClientSearch";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

function sanitizeBase64Image(image: string) {
  if (!image) return "";
  // Remove any repeated data:image/...;base64, prefixes
  return image.replace(/^(data:image\/[a-z]+;base64,)+/, "data:image/jpeg;base64,");
}

async function getRentals() {
  const rentals = await db.rental.findMany({
    include: {
      images: true,
    },
  });

  return rentals.map((rental) => {
    const images = rental.images.map((img) => {
      if (!img.image) return "";
      if (img.image.startsWith("data:image/")) {
        return sanitizeBase64Image(img.image);
      }
      return `data:image/jpeg;base64,${img.image}`;
    });

    return {
      ...rental,
      price: rental.price?.toNumber() ?? null,
      rent: rental.rent?.toNumber() ?? null,
      images,
    };
  });
}

export default async function SearchPage() {
  const rentalsWithNumbers = await getRentals();
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  const cities = [
    'Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań',
    'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'
  ];

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} />
      <ClientSearch cities={cities} />
      {rentalsWithNumbers.map((p) => (
        <ApartmentCard
          key={p.id}
          apartment={{
            id: p.id,
            price: p.price,
            rent: p.rent,
            title: p.title,
            location: p.location,
            rooms: p.rooms,
            meterage: p.meterage,
            longDescription: typeof p.longDescription === 'string' ? p.longDescription : 'No description available',
            images: Array.isArray(p.images) ? p.images : [],
          }}
        />
      ))}
    </div>
  );
}