// src/app/detail-view/[id]/ClientDetailPage.tsx
'use client';

import React from 'react';
import Navbar from '~/app/_components/Navbar';
import PropertyListingPage from '~/app/_components/PropertyListingPage';

interface ClientDetailPageProps {
  data: any;        // You can replace with your exact type
  user: any | null; // session user object
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
