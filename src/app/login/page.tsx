'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '~/app/_components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/');
      } else {
        setError(data.message || `Error: ${res.status} ${res.statusText}`);
        console.error('Login failed:', data);
      }
    } catch (err) {
      console.error('Login error:', err);
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
        <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
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
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-3 text-center">
            Don’t have an account?{' '}
            <a href="/register" className="text-decoration-none">Register</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
