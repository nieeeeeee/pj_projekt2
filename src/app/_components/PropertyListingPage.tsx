"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import DatePicker from "react-datepicker";
import Cookies from "js-cookie";
import "react-datepicker/dist/react-datepicker.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "~/styles/calendar.css";

interface Booking {
  startDate: string;
  endDate: string;
}

interface PropertyData {
  price: number;
  title: string;
  location: string;
  size: string;
  rooms: number;
  type: string;
  status: string;
  heating: string;
  landlord: string;
  images: string[];
  bookings?: Booking[]; // Add bookings here
}

export default function PropertyListingPage({ data }: { data: PropertyData }) {
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [rentedDates, setRentedDates] = useState<Date[]>([]);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  useEffect(() => {
    // Helper to get all dates between start and end inclusive
    const getDatesInRange = (start: Date, end: Date) => {
      const dates = [];
      const curr = new Date(start);
      while (curr <= end) {
        dates.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
      }
      return dates;
    };

    // Convert bookings into array of disabled dates
    if (data.bookings && data.bookings.length > 0) {
      const disabledDates = data.bookings.flatMap((b) =>
        getDatesInRange(new Date(b.startDate), new Date(b.endDate))
      );
      setRentedDates(disabledDates);
    } else {
      setRentedDates([]);
    }

    // Restore selected dates from cookies if present
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
          setSelectedDates([new Date(start), new Date(end)]);
        }
      } catch (error) {
        console.error("Error parsing saved dates:", error);
      }
    }
  }, [data.bookings]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setSelectionError(null);

    if (start && end) {
      // Check if any rented date falls within the selected range
      const isRentedDateInRange = rentedDates.some(
        (rentedDate) => rentedDate >= start && rentedDate <= end
      );

      if (isRentedDateInRange) {
        setSelectedDates([start, null]);
        setSelectionError(
          "Wybrana data zawiera już zarezerwowane dni. Proszę wybrać inny zakres."
        );
        return;
      }

      Cookies.set(
        "selectedDates",
        JSON.stringify([start.toISOString(), end.toISOString()]),
        { expires: 7 }
      );
    }

    setSelectedDates(dates);
  };

  const handleSaveDates = () => {
    if (selectedDates[0] && selectedDates[1]) {
      Cookies.set(
        "selectedDates",
        JSON.stringify([
          selectedDates[0].toISOString(),
          selectedDates[1].toISOString(),
        ]),
        { expires: 7 }
      );
      alert("Termin został zarezerwowany pomyślnie!");
    }
  };

  const renderDayContents = (day: number, date: Date) => {
    const isRented = rentedDates.some(
      (rentedDate) =>
        rentedDate.getDate() === date.getDate() &&
        rentedDate.getMonth() === date.getMonth() &&
        rentedDate.getFullYear() === date.getFullYear()
    );

    return (
      <div className="day-content-wrapper">
        {day}
        {isRented && <div className="rented-date-indicator" />}
      </div>
    );
  };

  return (
    <div className="container py-5 bg-light">
      <div className="d-flex justify-content-center mb-4">
        <div className="w-75 rounded overflow-hidden">
          <Carousel showThumbs={false} infiniteLoop autoPlay>
            {data.images.map((img, idx) => (
              <div
                key={idx}
                style={{ height: "400px" }}
                className="d-flex justify-content-center align-items-center"
              >
                <Image
                  src={img}
                  alt={`Zdjęcie nieruchomości ${idx + 1}`}
                  width={800}
                  height={600}
                  unoptimized
                  className="img-fluid rounded"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <h1 className="display-5 fw-bold mb-3">{data.title}</h1>
      <p className="h4 text-primary fw-semibold mb-4">{data.price} zł / miesiąc</p>
      <p className="text-muted mb-4">{data.location}</p>

      <div className="bg-white p-4 rounded mb-4">
        <h2 className="h4 fw-bold mb-3">Dom na wynajem</h2>
        <div className="row">
          <div className="col-6">
            <strong>Powierzchnia:</strong> {data.size}
          </div>
          <div className="col-6">
            <strong>Pokoje:</strong> {data.rooms} pokoi
          </div>
          <div className="col-6">
            <strong>Rodzaj zabudowy:</strong> {data.type}
          </div>
          <div className="col-6">
            <strong>Stan:</strong> {data.status}
          </div>
          <div className="col-6">
            <strong>Ogrzewanie:</strong> {data.heating}
          </div>
          <div className="col-6">
            <strong>Ogłoszeniodawca:</strong> {data.landlord}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded mb-4">
        <h2 className="h4 fw-bold mb-3">Wybierz termin</h2>
        <div className="mb-3 d-flex justify-content-center">
          <div className="calendar-container">
            <DatePicker
              selected={selectedDates[0]}
              onChange={handleDateChange}
              startDate={selectedDates[0]}
              endDate={selectedDates[1]}
              selectsRange
              inline
              minDate={new Date()}
              excludeDates={rentedDates}
              dateFormat="dd/MM/yyyy"
              renderDayContents={renderDayContents}
              dayClassName={(date) => {
                const isRented = rentedDates.some(
                  (rentedDate) =>
                    rentedDate.getDate() === date.getDate() &&
                    rentedDate.getMonth() === date.getMonth() &&
                    rentedDate.getFullYear() === date.getFullYear()
                );
                return isRented ? "rented-date" : undefined;
              }}
              monthsShown={1}
              showPopperArrow={false}
              formatWeekDay={(nameOfDay) =>
                nameOfDay.substr(0, 2).toUpperCase()
              }
            />
          </div>
        </div>
        {selectionError && (
          <div
            className="alert alert-warning mt-2 text-center"
            role="alert"
          >
            {selectionError}
          </div>
        )}
        {selectedDates[0] && selectedDates[1] && (
          <div
            className="alert alert-info mt-2 text-center"
            role="alert"
          >
            Wybrano termin:{" "}
            {selectedDates[0].toLocaleDateString("pl-PL")} -{" "}
            {selectedDates[1].toLocaleDateString("pl-PL")}
          </div>
        )}
        <div className="d-flex justify-content-center">
          <button
            onClick={handleSaveDates}
            className="btn btn-primary px-4 py-2 reserve-button"
            disabled={!selectedDates[0] || !selectedDates[1]}
          >
            Zarezerwuj termin
          </button>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2 className="h4 fw-bold mb-4">Skontaktuj się</h2>
        <form className="d-flex flex-column gap-2">
          <input type="text" placeholder="Imię" className="form-control" required />
          <input type="email" placeholder="Email" className="form-control" required />
          <input type="tel" placeholder="Telefon" className="form-control" required />
          <textarea placeholder="Wiadomość" className="form-control" rows={4} required></textarea>
          <button type="submit" className="btn btn-primary">Wyślij wiadomość</button>
        </form>
      </div>
    </div>
  );
}
