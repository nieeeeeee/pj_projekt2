import Navbar from '~/app/_components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApartmentCard from "~/app/_components/ApartmentCard";
import { db } from "~/server/db";
import ClientSearch from "~/app/_components/ClientSearch";
import { getServerSession } from "next-auth"; // ✅
import { authOptions } from "~/server/auth"; // ✅

async function getRentals() {
  const rentals = await db.rental.findMany();

  return rentals.map((rental) => ({
    ...rental,
    price: rental.price?.toNumber() ?? null,
    rent: rental.rent?.toNumber() ?? null,
  }));
}

export default async function SearchPage() {
  const rentalsWithNumbers = await getRentals();
  const session = await getServerSession(authOptions); // ✅ Get user session on server
  const isLoggedIn = !!session?.user;

  const cities = [
    'Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań',
    'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'
  ];

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} /> {/* ✅ Pass to Navbar */}
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
