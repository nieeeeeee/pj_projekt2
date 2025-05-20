'use client';

import { useState } from 'react';
import Navbar from "~/app/_components/Navbar";
import { useSession } from "next-auth/react"; // ✅ Import

export default function RegisterPage() {
  const { data: session } = useSession();  // ✅ Get session
  const isLoggedIn = !!session?.user;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password }),
    });

    if (res.status === 201) {
      setSuccess('Account created successfully. You can now log in.');
      setEmail('');
      setName('');
      setPassword('');
    } else if (res.status === 409) {
      setError('This email is already registered. Try logging in instead.');
    } else if (res.status === 400) {
      setError('Please fill out all required fields.');
    } else {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} /> {/* ✅ Pass session */}
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {success && <p className="mt-4 text-green-600">{success}</p>}
    </div>
  );
}
