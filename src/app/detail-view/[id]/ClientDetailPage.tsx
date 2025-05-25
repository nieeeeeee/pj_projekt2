'use client';

import React, { useState } from 'react';
interface ClientDetailPageProps {
  data: {
    price: number;
    title: string;
    location: string;
    size: string;
    rooms: number;
    type: string;
    status: string;
    heating: string;
    landlord: string;
    images: string[];
    bookings: { startDate: string; endDate: string }[];
  };
  isLoggedIn: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ data, isLoggedIn, user }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleReserve = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/reservations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId: data?.id ?? null, // You'll fix this below
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 days
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(`Błąd: ${result.error}`);
      } else {
        alert('Rezerwacja została zapisana!');
      }
    } catch (err) {
      console.error(err);
      alert('Wystąpił błąd przy rezerwacji.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="text-gray-600">{data.location}</p>
      <p className="text-gray-800">{data.size}</p>
      <p className="text-gray-800">{data.rooms} pokoje</p>
      {/* ...more UI */}

      {isLoggedIn ? (
        <button
          onClick={handleReserve}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Rezerwuję...' : 'Zarezerwuj'}
        </button>
      ) : (
        <p className="text-red-500 mt-4">Zaloguj się, aby zarezerwować.</p>
      )}
    </div>
  );
};

export default ClientDetailPage;
