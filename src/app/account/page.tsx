// Updated AccountPage.tsx with working layout and functionality

"use client";

import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "~/app/_components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

interface Reservation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  startDate: Date;
  endDate: Date;
  price: number;
  location: string;
  image: string;
}

const AccountPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [userImage, setUserImage] = useState<string>(
    session?.user?.image || "/favicon.ico"
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [unconfirmedReservations, setUnconfirmedReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("unconfirmedReservations");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Reservation[];
        parsed.forEach((r) => {
          r.startDate = new Date(r.startDate);
          r.endDate = new Date(r.endDate);
        });
        setUnconfirmedReservations(parsed);
      } catch {
        console.warn("Invalid unconfirmed reservation data.");
      }
    }

    const savedDates = Cookies.get("selectedDates");
    if (savedDates) {
      try {
        const parsed = JSON.parse(savedDates) as [string, string];
        const [start, end] = parsed;
        const mockReservation: Reservation = {
          id: `cookie-${Date.now()}`,
          propertyId: "1",
          propertyTitle: "Dom 6 pokoi Wrocław Ołtaszyn",
          startDate: new Date(start),
          endDate: new Date(end),
          price: 6000,
          location: "Ołtaszyn, Wrocław",
          image: "",
        };
        setUnconfirmedReservations((prev) => [...prev, mockReservation]);
        Cookies.remove("selectedDates");
      } catch (error) {
        console.error("Error parsing saved dates:", error);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("unconfirmedReservations", JSON.stringify(unconfirmedReservations));
  }, [unconfirmedReservations]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      if (typeof base64 === "string") {
        const res = await fetch("/api/upload-profile-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Image: base64 }),
        });

        if (res.ok) {
          setUserImage(base64);
        } else {
          alert("Błąd podczas zapisywania zdjęcia.");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (date: Date) => date.toLocaleDateString("pl-PL");

  const handleConfirmPurchase = async (reservation: Reservation) => {
    try {
      const res = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rentalId: parseInt(reservation.propertyId),
          startDate: reservation.startDate,
          endDate: reservation.endDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Błąd: ${data.message || "Nie udało się potwierdzić zakupu."}`);
        return;
      }

      alert("Zakup potwierdzony!");
      setUnconfirmedReservations((prev) => prev.filter((r) => r.id !== reservation.id));
      setReservations((prev) => [...prev, reservation]);
    } catch (error) {
      console.error("Error confirming purchase:", error);
      alert("Błąd sieci, spróbuj ponownie.");
    }
  };

  const renderImageOrFallback = (src: string, alt: string) =>
    src ? (
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-start"
        style={{ objectFit: "cover", height: "200px", width: "100%" }}
      />
    ) : (
      <div
        className="d-flex align-items-center justify-content-center bg-secondary text-white"
        style={{ height: "200px", width: "100%" }}
      >
        Brak zdjęcia
      </div>
    );

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} />
      <div className="container py-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="card mb-4">
              <div className="card-body text-center">
                <div className="position-relative" style={{ width: "150px", height: "150px" }}>
                  <Image
                    src={userImage}
                    alt="User"
                    fill
                    className="rounded-circle"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h4 className="mt-3">{session?.user?.name || "Użytkownik"}</h4>
                <p className="text-muted">{session?.user?.email}</p>
                <div ref={dropdownRef} className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-secondary dropdown-toggle w-100"
                    onClick={toggleDropdown}
                  >
                    Zmień ikonę
                  </button>
                  <ul className={`dropdown-menu p-2${dropdownOpen ? " show" : ""}`}>
                    <li>
                      <label className="form-label btn btn-light w-100 m-0">
                        Wgraj zdjęcie
                        <input
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleImageChange}
                        />
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="list-group list-group-flush">
                <a className="list-group-item list-group-item-action">Ustawienia konta</a>
                <a className="list-group-item list-group-item-action">Historia płatności</a>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="list-group-item list-group-item-action text-start"
                >
                  Wyloguj się
                </button>
              </div>
            </div>
            <div className="mt-3 text-center">
              <Link href="/new" className="btn btn-primary w-100">
                Dodaj ogłoszenie
              </Link>
            </div>
          </div>

          {/* Main Section */}
          <div className="col-md-9">
            <div className="card mb-4">
              <div className="card-header">
                <h4>Twoje nierozpatrzone zakupy</h4>
              </div>
              <div className="card-body">
                {unconfirmedReservations.length === 0 ? (
                  <div className="alert alert-info">Brak nierozpatrzonych zakupów.</div>
                ) : (
                  unconfirmedReservations.map((reservation) => (
                    <div key={reservation.id} className="card mb-3">
                      <div className="row g-0">
                        <div className="col-md-4 position-relative">
                          {renderImageOrFallback(reservation.image, reservation.propertyTitle)}
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5>{reservation.propertyTitle}</h5>
                            <p className="text-muted">{reservation.location}</p>
                            <span className="badge bg-primary mb-2">
                              {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                            </span>
                            <p className="fw-bold text-success">
                              {reservation.price} zł / miesiąc
                            </p>
                            <button
                              className="btn btn-success me-2"
                              onClick={() => handleConfirmPurchase(reservation)}
                            >
                              Potwierdź
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => setUnconfirmedReservations(prev => prev.filter(r => r.id !== reservation.id))}
                            >
                              Anuluj
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Twoje rezerwacje</h4>
              </div>
              <div className="card-body">
                {reservations.length === 0 ? (
                  <div className="alert alert-info">
                    Nie masz żadnych aktywnych rezerwacji.
                  </div>
                ) : (
                  reservations.map((reservation) => (
                    <div key={reservation.id} className="card mb-3">
                      <div className="row g-0">
                        <div className="col-md-4 position-relative">
                          {renderImageOrFallback(reservation.image, reservation.propertyTitle)}
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5>{reservation.propertyTitle}</h5>
                            <p className="text-muted">{reservation.location}</p>
                            <span className="badge bg-primary mb-2">
                              {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                            </span>
                            <p className="fw-bold text-success">
                              {reservation.price} zł / miesiąc
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
