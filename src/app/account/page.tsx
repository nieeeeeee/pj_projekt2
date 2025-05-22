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

  // Load confirmed reservation (mock from cookie)
  useEffect(() => {
    setIsLoading(true);

    const savedDates = Cookies.get("selectedDates");
    if (savedDates) {
      try {
        const parsed = JSON.parse(savedDates) as [string, string];
        if (
          Array.isArray(parsed) &&
          parsed.length === 2 &&
          typeof parsed[0] === "string" &&
          typeof parsed[1] === "string"
        ) {
          const [start, end] = parsed;

          const mockReservation: Reservation = {
            id: "1",
            propertyId: "sample-1",
            propertyTitle:
              "Dom 6 pokoi Wrocław Ołtaszyn, Ułańska bezpośrednio",
            startDate: new Date(start),
            endDate: new Date(end),
            price: 6000,
            location: "Ołtaszyn, Krzyki, Wrocław, dolnośląskie",
            image: "/placeholder.jpg",
          };

          setReservations([mockReservation]);
        }
      } catch (error) {
        console.error("Error parsing saved dates:", error);
      }
    }

    setIsLoading(false);
  }, []);

  // Load unconfirmed from localStorage
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
    } else {
      // First-time default
      const defaultReservation: Reservation = {
        id: "u1",
        propertyId: "sample-2",
        propertyTitle: "Nowe mieszkanie do potwierdzenia",
        startDate: new Date(),
        endDate: new Date(),
        price: 4500,
        location: "Warszawa, mazowieckie",
        image: "/placeholder.jpg",
      };
      setUnconfirmedReservations([defaultReservation]);
    }
  }, []);

  // Save unconfirmed to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      "unconfirmedReservations",
      JSON.stringify(unconfirmedReservations)
    );
  }, [unconfirmedReservations]);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCancelReservation = (id: string) => {
    setReservations(reservations.filter((res) => res.id !== id));
    Cookies.remove("selectedDates");
    alert("Rezerwacja została anulowana.");
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
  const calculateTotalDays = (startDate: Date, endDate: Date) =>
    Math.ceil(
      Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} />
      <div className="container py-5">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3">
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <div
                    className="position-relative"
                    style={{ width: "150px", height: "150px" }}
                  >
                    <Image
                      src={userImage}
                      alt="User"
                      className="rounded-circle"
                      fill
                      sizes="150px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <h4 className="mt-3">{session?.user?.name || "Użytkownik"}</h4>
                  <p className="text-muted font-size-sm mb-3">
                    {session?.user?.email}
                  </p>

                  <div
                    ref={dropdownRef}
                    className="dropdown"
                    style={{ width: "150px" }}
                  >
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle w-100"
                      type="button"
                      onClick={toggleDropdown}
                      aria-expanded={dropdownOpen}
                    >
                      Zmień ikonę
                    </button>
                    <ul
                      className={`dropdown-menu p-2${dropdownOpen ? " show" : ""}`}
                      style={{ minWidth: "150px" }}
                    >
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
            </div>

            <div className="card">
              <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action">
                  Ustawienia konta
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                  Historia płatności
                </a>
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

          {/* MAIN */}
          <div className="col-md-9">
            {/* Confirmed Reservations */}
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Twoje rezerwacje</h4>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="py-4 text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="alert alert-info">
                    Nie masz żadnych aktywnych rezerwacji.
                  </div>
                ) : (
                  reservations.map((reservation) => (
                    <div key={reservation.id} className="card mb-3">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <div
                            className="position-relative"
                            style={{ height: "200px" }}
                          >
                            <Image
                              src={reservation.image}
                              alt={reservation.propertyTitle}
                              className="rounded-start"
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{reservation.propertyTitle}</h5>
                            <p className="card-text">
                              <small className="text-muted">
                                {reservation.location}
                              </small>
                            </p>
                            <span className="badge bg-primary mb-2">
                              {formatDate(reservation.startDate)} -{" "}
                              {formatDate(reservation.endDate)}
                            </span>
                            <p className="card-text fw-bold text-success mb-3">
                              {reservation.price} zł / miesiąc
                            </p>
                            <div className="d-flex justify-content-between">
                              <Link
                                className="btn btn-outline-primary"
                                href="/detail-view"
                              >
                                Zobacz szczegóły
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleCancelReservation(reservation.id)}
                              >
                                Anuluj rezerwację
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Unconfirmed Purchases */}
            <div className="card mt-4">
              <div className="card-header">
                <h4 className="mb-0">Twoje niezrealizowane zakupy</h4>
              </div>
              <div className="card-body">
                {unconfirmedReservations.length === 0 ? (
                  <div className="alert alert-info">
                    Brak niezrealizowanych zakupów.
                  </div>
                ) : (
                  unconfirmedReservations.map((reservation) => (
                    <div key={reservation.id} className="card mb-3">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <div
                            className="position-relative"
                            style={{ height: "200px" }}
                          >
                            <Image
                              src={reservation.image}
                              alt={reservation.propertyTitle}
                              className="rounded-start"
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{reservation.propertyTitle}</h5>
                            <p className="card-text">
                              <small className="text-muted">
                                {reservation.location}
                              </small>
                            </p>
                            <span className="badge bg-warning text-dark mb-2">
                              W oczekiwaniu na potwierdzenie
                            </span>
                            <p className="card-text fw-bold text-success mb-3">
                              {reservation.price} zł / miesiąc
                            </p>
                            <div className="d-flex justify-content-between">
                              <button
                                className="btn btn-success"
                                onClick={() => {
                                  alert("Zakup potwierdzony!");
                                  setUnconfirmedReservations((prev) =>
                                    prev.filter((r) => r.id !== reservation.id)
                                  );
                                }}
                              >
                                Potwierdź zakup
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() =>
                                  setUnconfirmedReservations((prev) =>
                                    prev.filter((r) => r.id !== reservation.id)
                                  )
                                }
                              >
                                Anuluj
                              </button>
                            </div>
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
