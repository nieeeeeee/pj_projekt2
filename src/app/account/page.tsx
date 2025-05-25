"use client";

import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "~/app/_components/Navbar";
import Link from "next/link";
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

const addImagePrefixIfMissing = (img: string) => {
  if (!img) return "";
  if (img.startsWith("data:")) return img;
  return `data:image/jpeg;base64,${img}`;
};

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

  // Load unconfirmed reservations from localStorage and cookies
  useEffect(() => {
    const stored = localStorage.getItem("unconfirmedReservations");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Reservation[];
        parsed.forEach((r) => {
          r.startDate = new Date(r.startDate);
          r.endDate = new Date(r.endDate);
          r.image = addImagePrefixIfMissing(r.image);
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
          image: "", // no image for this mock
        };
        setUnconfirmedReservations((prev) => [...prev, mockReservation]);
        Cookies.remove("selectedDates");
      } catch (error) {
        console.error("Error parsing saved dates:", error);
      }
    }

    setIsLoading(false);
  }, []);

  // Fetch confirmed reservations from the backend
  useEffect(() => {
    async function fetchConfirmedReservations() {
      if (!session?.user) return;

      try {
        const res = await fetch("/api/reservations");
        if (!res.ok) throw new Error("Failed to fetch confirmed reservations");
        const data = await res.json();

        const formatted = data.map((r: any) => ({
          ...r,
          startDate: new Date(r.startDate),
          endDate: new Date(r.endDate),
          image: addImagePrefixIfMissing(r.image),
        }));

        setReservations(formatted);
      } catch (error) {
        console.error("Error fetching confirmed reservations:", error);
      }
    }

    fetchConfirmedReservations();
  }, [session]);

  // Save unconfirmed reservations to localStorage
  useEffect(() => {
    localStorage.setItem("unconfirmedReservations", JSON.stringify(unconfirmedReservations));
  }, [unconfirmedReservations]);

  // Close dropdown on outside click
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

      // Remove from unconfirmed
      setUnconfirmedReservations((prev) =>
        prev.filter((r) => r.id !== reservation.id)
      );

      // Refresh confirmed reservations from API
      const confirmedRes = await fetch("/api/reservations");
      if (confirmedRes.ok) {
        const data = await confirmedRes.json();
        const formatted = data.map((r: any) => ({
          ...r,
          startDate: new Date(r.startDate),
          endDate: new Date(r.endDate),
          image: addImagePrefixIfMissing(r.image),
        }));
        setReservations(formatted);
      }
    } catch (error) {
      console.error("Error confirming purchase:", error);
      alert("Błąd sieci, spróbuj ponownie.");
    }
  };

  const renderImageOrFallback = (src: string, alt: string) =>
    src ? (
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "0.25rem 0 0 0.25rem" }}
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
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card text-center mb-4 p-3">
              <div className="mx-auto position-relative" style={{ width: "140px", height: "140px" }}>
                {/* Use img for user image as well if base64 */}
                {userImage.startsWith("data:") || userImage.startsWith("/") ? (
                  <img
                    src={userImage}
                    alt="User"
                    style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
                  />
                ) : (
                  <img
                    src={addImagePrefixIfMissing(userImage)}
                    alt="User"
                    style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
                  />
                )}
              </div>
              <h5 className="mt-3">{session?.user?.name || "Użytkownik"}</h5>
              <p className="text-muted">{session?.user?.email}</p>

              <div ref={dropdownRef} className="dropdown w-100">
                <button
                  className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                  onClick={toggleDropdown}
                >
                  Zmień ikonę
                </button>
                <ul className={`dropdown-menu p-2${dropdownOpen ? " show" : ""}`}>
                  <li>
                    <label className="btn btn-light w-100 mb-0">
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

            <div className="card mb-4">
              <div className="list-group list-group-flush">
                <button className="list-group-item list-group-item-action">Ustawienia konta</button>
                <button className="list-group-item list-group-item-action">Historia płatności</button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="list-group-item list-group-item-action text-start text-danger"
                >
                  Wyloguj się
                </button>
              </div>
            </div>

            <Link href="/new" className="btn btn-primary w-100">
              Stwórz nowe ogłoszenie
            </Link>
          </div>

          {/* Main content */}
          <div className="col-lg-9">
            <h3>Twoje rezerwacje</h3>
            {isLoading ? (
              <p>Ładowanie...</p>
            ) : reservations.length === 0 ? (
              <p>Brak potwierdzonych rezerwacji.</p>
            ) : (
              <div className="row g-3">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="col-md-6">
                    <div className="card d-flex flex-row">
                      <div style={{ width: "40%" }}>
                        {renderImageOrFallback(reservation.image, reservation.propertyTitle)}
                      </div>
                      <div className="card-body d-flex flex-column justify-content-between">
                        <h5 className="card-title">{reservation.propertyTitle}</h5>
                        <p className="card-text">
                          Lokalizacja: {reservation.location} <br />
                          Cena: {reservation.price} PLN <br />
                          Termin: {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <hr />

            <h3>Twoje niezrealizowane zakupy</h3>
            {unconfirmedReservations.length === 0 ? (
              <p>Brak niezrealizowanych zakupów.</p>
            ) : (
              <div className="row g-3">
                {unconfirmedReservations.map((reservation) => (
                  <div key={reservation.id} className="col-md-6">
                    <div className="card d-flex flex-row">
                      <div style={{ width: "40%" }}>
                        {renderImageOrFallback(reservation.image, reservation.propertyTitle)}
                      </div>
                      <div className="card-body d-flex flex-column justify-content-between">
                        <h5 className="card-title">{reservation.propertyTitle}</h5>
                        <p className="card-text">
                          Lokalizacja: {reservation.location} <br />
                          Cena: {reservation.price} PLN <br />
                          Termin: {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                        </p>
                        <button
                          className="btn btn-success"
                          onClick={() => handleConfirmPurchase(reservation)}
                        >
                          Potwierdź zakup
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
