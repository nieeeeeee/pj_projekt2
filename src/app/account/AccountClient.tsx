'use client';

import React, { useState } from 'react';

type Rental = {
  id: number;
  price: number | null;
  rent: number | null;
  title?: string | null;
  location?: string | null;
  description?: string | null;
};

type Booking = {
  id: number;
  rentalId: number;
  startDate: string;
  endDate: string;
  confirmed: boolean;
  rental: Rental;
};

interface Props {
  bookings: Booking[];
}

export default function AccountClient({ bookings: initialBookings }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  async function confirmBooking(id: number) {
    try {
      const res = await fetch(`/api/reservations/${id}/confirm`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to confirm booking');

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, confirmed: true } : b))
      );
    } catch (error) {
      alert('Błąd przy potwierdzaniu rezerwacji.');
      console.error(error);
    }
  }

  async function cancelBooking(id: number) {
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to cancel booking');

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      alert('Błąd przy anulowaniu rezerwacji.');
      console.error(error);
    }
  }


  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Twoje rezerwacje</h2>
      {bookings.length === 0 ? (
        <p>Nie masz żadnych rezerwacji.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border rounded-md p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold mb-1">{booking.rental.title ?? 'Brak tytułu'}</h3>
              <p className="text-gray-700 mb-1">
                Lokalizacja: {booking.rental.location ?? 'Brak danych'}
              </p>
              <p className="mb-1">
                Cena: {booking.rental.price != null ? `${booking.rental.price} PLN` : 'Brak danych'}
              </p>
              <p className="mb-1">
                Termin: {new Date(booking.startDate).toLocaleDateString()} –{' '}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <p className="mb-2">
                Status:{" "}
                <span className={booking.confirmed ? "text-green-600" : "text-yellow-600"}>
                  {booking.confirmed ? 'Potwierdzona' : 'Oczekująca'}
                </span>
              </p>

              <div className="flex gap-4">
                {!booking.confirmed && (
                  <button
                    onClick={() => confirmBooking(booking.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Potwierdź
                  </button>
                )}
                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Anuluj
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
