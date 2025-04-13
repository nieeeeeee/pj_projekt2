import Navbar from '~/app/_components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApartmentCard from "~/app/_components/ApartmentCard";
import { PrismaClient } from "@prisma/client";
import ClientSearch from "~/app/_components/ClientSearch";

async function getRentals() {
  const prisma = new PrismaClient();
  const rentals = await prisma.rental.findMany();

  const rentalsWithNumbers = rentals.map((rental) => ({
    ...rental,
    price: rental.price ? rental.price.toNumber() : null,
    rent: rental.rent ? rental.rent.toNumber() : null,
  }));
  // console.log("Rentals:", rentalsWithNumbers);
  return rentalsWithNumbers;
}

export default async function SearchPage() {
  const rentalsWithNumbers = await getRentals();

  console.log('Rentals:', rentalsWithNumbers);

  const cities = [
    'Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'
  ];

  return (
    <div>
      <Navbar currentPage={1} isLoggedIn={false} user={{ name: 'Guest', email: '' }} />
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
            longDescription: p.longDescription || 'No description available',
            images: p.images || [],
          }}
        />
      ))}
    </div>
  );
}
