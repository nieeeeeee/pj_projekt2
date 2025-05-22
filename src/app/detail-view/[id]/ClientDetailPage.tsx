'use client';

import React from 'react';
import Navbar from '~/app/_components/Navbar';
import PropertyListingPage from '~/app/_components/PropertyListingPage';

interface ClientDetailPageProps {
  data: any;
  user: any | null;
  isLoggedIn: boolean;
}

export default function ClientDetailPage({ data, user, isLoggedIn }: ClientDetailPageProps) {
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      <main className="p-4">
        <PropertyListingPage data={data} />
      </main>
    </>
  );
}
