'use client'; // This is a client component because we are using hooks like useSession and useRouter

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div>

        <div className="container d-flex justify-content-center align-items-center vh-100">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  // If authenticated, display the dashboard content
  if (status === 'authenticated') {
    return (
      <div>
        <div className="container mt-5">
          <h1 className="text-center">Dashboard</h1>
          {session?.user?.name && (
            <p className="text-center">Welcome, {session.user.name}!</p>
          )}
          {session?.user?.email && (
            <p className="text-center">Your email is: {session.user.email}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default DashboardPage;