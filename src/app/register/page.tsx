'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '~/app/_components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

interface RegisterResponse {
  message?: string;
}

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json() as RegisterResponse;

      if (res.ok) {
        alert('Registration successful! Please log in.');
        router.push('/login');
      } else {
        setError(data.message ?? `Error: ${res.status} ${res.statusText}`);
        console.error('Registration failed:', data);
      }
    } catch (err) {
      console.error('Network or parsing error during registration:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const mockUser = null;

  return (
    <>
      <Navbar currentPage={-1} isLoggedIn={false} user={mockUser} />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
          <h1 className="text-center mb-4">Register</h1>
          <form onSubmit={handleRegister}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
