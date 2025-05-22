'use client';

import Navbar from "~/app/_components/Navbar";
import React from "react";
import { useSession } from "next-auth/react"; // ✅ Import this

export default function AboutUs() {
    const { data: session, status } = useSession(); // ✅ Get session
    const isLoggedIn = status === "authenticated";  // ✅ Determine auth state

    return (
      <>
          <Navbar isLoggedIn={isLoggedIn} user={session?.user} currentPage={-1} /> {/* ✅ Use session */}
          <div className="container d-flex flex-column justify-content-between min-vh-100 py-5">
              {/* About Us Content */}
              <div className="card shadow-lg p-5 mx-auto" style={{ maxWidth: "800px" }}>
                  <h1 className="text-center text-primary mb-4">O nas</h1>
                  <p className="text-muted">
                      Witamy na naszej platformie wynajmu nieruchomości! Jesteśmy zespołem
                      pasjonatów, których celem jest uproszczenie procesu wynajmu domów i mieszkań.
                      Łączymy nowoczesną technologię z rynkiem nieruchomości, aby każdy mógł szybko i
                      wygodnie znaleźć idealne miejsce do życia.
                  </p>
                  <h2 className="text-secondary mt-4">Nasza misja</h2>
                  <p className="text-muted">
                      Naszym celem jest stworzenie przejrzystej i intuicyjnej platformy, gdzie
                      właściciele nieruchomości mogą łatwo publikować oferty, a najemcy mogą bez
                      stresu przeglądać dostępne mieszkania i domy. Wierzymy, że wynajem powinien
                      być prosty, szybki i bezpieczny.
                  </p>
              </div>

              {/* Footer */}
              <footer className="bg-light text-center py-3 mt-5 shadow-sm">
                  <h5 className="text-dark mb-3">Kontakt</h5>
                  <ul className="list-unstyled text-muted">
                      <li><strong>Email:</strong> kontakt@najemnieruchomosci.pl</li>
                      <li><strong>Telefon:</strong> +48 123 456 789</li>
                      <li><strong>Adres:</strong> ul. Przykładowa 10, 00-001 Warszawa</li>
                  </ul>
              </footer>
          </div>
      </>
    );
}
