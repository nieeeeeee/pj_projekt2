"use client";

import React from "react";

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

interface Props {
  reservations: Reservation[];
  onConfirm: (r: Reservation) => void;
  onCancel: (id: string) => void;
}

const UnconfirmedReservations: React.FC<Props> = ({ reservations, onConfirm, onCancel }) => {
  const formatDate = (date: Date) => new Date(date).toLocaleDateString("pl-PL");

  const renderImageOrFallback = (src: string, alt: string) => {
    const isValidBase64Image = src && src.startsWith("data:image/");

    return isValidBase64Image ? (
      <img
        src={src}
        alt={alt}
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
  };

  const handleConfirm = async (r: Reservation) => {
    try {
      const res = await fetch(`/api/reservations/${r.id}/confirm`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Błąd przy potwierdzeniu: ${data.message || "Spróbuj ponownie."}`);
        return;
      }

      alert("Rezerwacja potwierdzona!");
      onConfirm(r);
    } catch (error) {
      console.error("Błąd sieci:", error);
      alert("Błąd sieci. Spróbuj ponownie.");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Błąd przy anulowaniu: ${data.message || "Spróbuj ponownie."}`);
        return;
      }

      alert("Rezerwacja anulowana.");
      onCancel(id);
    } catch (error) {
      console.error("Błąd sieci:", error);
      alert("Błąd sieci. Spróbuj ponownie.");
    }
  };

  if (reservations.length === 0) {
    return <div className="alert alert-info">Brak nierozpatrzonych zakupów.</div>;
  }

  return (
    <>
      {reservations.map((reservation) => (
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
                <p className="fw-bold text-success">{reservation.price} zł / miesiąc</p>
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleConfirm(reservation)}
                >
                  Potwierdź
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleCancel(reservation.id)}
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UnconfirmedReservations;
