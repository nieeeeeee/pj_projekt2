"use client";

import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "~/app/_components/Navbar";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import ConfirmedReservations from "~/app/_components/ConfirmedReservations";
import UnconfirmedReservations from "~/app/_components/UnconfirmedReservations";

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
  const [confirmedReservations, setConfirmedReservations] = useState<Reservation[]>([]);
  const [unconfirmedReservations, setUnconfirmedReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch("/api/reservations");
        if (!res.ok) throw new Error("Failed to fetch reservations");

        const data = await res.json();

        const format = (r: any): Reservation => ({
          id: r.id.toString(),
          propertyId: r.rental.id.toString(),
          propertyTitle: r.rental.title || "Brak tytułu",
          startDate: new Date(r.startDate),
          endDate: new Date(r.endDate),
          price: Number(r.rental.price) || 0,
          location: r.rental.location || "Brak lokalizacji",
          image: addImagePrefixIfMissing(r.rental.images?.[0]?.image || ""),
        });

        setConfirmedReservations(data.confirmed.map(format));
        setUnconfirmedReservations(data.unconfirmed.map(format));
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReservations();
  }, [session]);

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

      setUnconfirmedReservations((prev) =>
        prev.filter((r) => r.id !== reservation.id)
      );

      const refreshed = await fetch("/api/reservations");
      if (refreshed.ok) {
        const data = await refreshed.json();
        const format = (r: any): Reservation => ({
          id: r.id.toString(),
          propertyId: r.rental.id.toString(),
          propertyTitle: r.rental.title || "Brak tytułu",
          startDate: new Date(r.startDate),
          endDate: new Date(r.endDate),
          price: Number(r.rental.price) || 0,
          location: r.rental.location || "Brak lokalizacji",
          image: addImagePrefixIfMissing(r.rental.images?.[0]?.image || ""),
        });
        setConfirmedReservations(data.confirmed.map(format));
      }
    } catch (error) {
      console.error("Error confirming purchase:", error);
      alert("Błąd sieci, spróbuj ponownie.");
    }
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} />
      <div className="container py-5">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card text-center mb-4 p-3">
              <div className="mx-auto position-relative" style={{ width: "140px", height: "140px" }}>
                <img
                  src={addImagePrefixIfMissing(userImage)}
                  alt=""
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ccc"
                  }}
                />
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
            ) : (
              <ConfirmedReservations reservations={confirmedReservations} />
            )}

            <hr />

            <h3>Twoje niezrealizowane zakupy</h3>
            <UnconfirmedReservations
              reservations={unconfirmedReservations}
              onConfirm={handleConfirmPurchase}
              onCancel={(id: string) =>
                setUnconfirmedReservations((prev) =>
                  prev.filter((r) => r.id !== id)
                )
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
