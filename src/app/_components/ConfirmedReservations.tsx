// components/ConfirmedReservations.tsx
"use client";

import React from "react";
import Image from "next/image";

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
}

const ConfirmedReservations: React.FC<Props> = ({ reservations }) => {
  const formatDate = (date: Date) => date.toLocaleDateString("pl-PL");

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

  if (reservations.length === 0) {
    return <div className="alert alert-info">Nie masz żadnych aktywnych rezerwacji.</div>;
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
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ConfirmedReservations;
