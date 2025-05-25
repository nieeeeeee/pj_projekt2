"use client";

import React, { useState } from "react";

interface BookingSelectorProps {
  rentalId: number;
  rentalTitle: string;
  rentalPrice: number;
  rentalLocation: string;
  rentalImage?: string;
}

const BookingSelector: React.FC<BookingSelectorProps> = ({
                                                           rentalId,
                                                           rentalTitle,
                                                           rentalPrice,
                                                           rentalLocation,
                                                           rentalImage = "",
                                                         }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleAddToBasket = () => {
    if (!startDate || !endDate) {
      alert("Proszę wybrać datę rozpoczęcia i zakończenia rezerwacji.");
      return;
    }

    const newBooking = {
      rentalId,
      rentalTitle,
      rentalPrice,
      rentalLocation,
      rentalImage,
      startDate,
      endDate,
    };

    // Retrieve existing bookings from localStorage
    const existing = localStorage.getItem("unconfirmedBookings");
    const bookings = existing ? JSON.parse(existing) : [];

    bookings.push(newBooking);
    localStorage.setItem("unconfirmedBookings", JSON.stringify(bookings));

    alert("Dodano rezerwację do koszyka! Przejdź do strony konta, aby potwierdzić.");
  };

  return (
    <div className="p-4 rounded-xl shadow-md border w-fit space-y-2 bg-white">
      <h3 className="text-lg font-semibold">Wybierz daty rezerwacji</h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="flex flex-col text-sm font-medium">
          Od:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col text-sm font-medium">
          Do:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split("T")[0]}
            className="border rounded px-2 py-1"
          />
        </label>
        <button
          onClick={handleAddToBasket}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj do koszyka
        </button>
      </div>
    </div>
  );
};

export default BookingSelector;
