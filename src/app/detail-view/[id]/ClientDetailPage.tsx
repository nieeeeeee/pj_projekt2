'use client';

import React, { useState } from 'react';
import Navbar from '~/app/_components/Navbar';
import PropertyListingPage from '~/app/_components/PropertyListingPage';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';  // don't forget to import the styles!
import { addDays } from 'date-fns';
import { toast } from 'sonner';  // If you don't use this, just replace with alert()

interface Booking {
  startDate: string;
  endDate: string;
}

interface ApartmentData {
  id: number;
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
  bookings: Booking[];
}

interface ClientDetailPageProps {
  data: ApartmentData;
  isLoggedIn: boolean;
  user: any | null;
}

export default function ClientDetailPage({ data, user, isLoggedIn }: ClientDetailPageProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handleReservation = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error ? toast.error('Proszę wybrać daty.') : alert('Proszę wybrać daty.');
      return;
    }

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId: data.id,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Rezerwacja nie powiodła się.');

      toast.success ? toast.success('Rezerwacja zapisana!') : alert('Rezerwacja zapisana!');
    } catch (err: any) {
      toast.error ? toast.error(err.message || 'Błąd podczas rezerwacji.') : alert(err.message || 'Błąd podczas rezerwacji.');
    }
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      <main className="p-4 max-w-4xl mx-auto">
        <PropertyListingPage data={data} />

      </main>
    </>
  );
}
