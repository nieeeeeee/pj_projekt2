"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "~/app/_components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage: React.FC = () => {
    const { data: session, status } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/dashboard",
        });

        if (result?.error) {
            alert("Login failed: " + result.error);
        } else {
            router.push("/dashboard");
        }
    };

    return (
      <>
          <Navbar
            currentPage={1}
            isLoggedIn={!!session}
            user={session?.user ?? { name: "Guest", email: "" }}
          />
          <div className="container d-flex justify-content-center align-items-center vh-100">
              <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                  <h1 className="text-center mb-4">Login</h1>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                      </div>
                      <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                          Login
                      </button>
                  </form>

                  <hr className="my-4" />

                  <button
                    onClick={() => router.push("/register")}
                    className="btn btn-outline-secondary w-100"
                  >
                      Register
                  </button>
              </div>
          </div>
      </>
    );
};

export default LoginPage;
