"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "~/app/_components/Navbar";
import Link from "next/link";
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

const AccountPage = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        setIsLoading(true);

        const savedDates = Cookies.get('selectedDates');
        if (savedDates) {
            try {
                const parsed = JSON.parse(savedDates) as [string, string];
                if (Array.isArray(parsed) && parsed.length === 2 && typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
                    const [start, end] = parsed;

                    const mockReservation: Reservation = {
                        id: '1',
                        propertyId: 'sample-1',
                        propertyTitle: 'Dom 6 pokoi Wrocław Ołtaszyn, Ułańska bezpośrednio',
                        startDate: new Date(start),
                        endDate: new Date(end),
                        price: 6000,
                        location: 'Ołtaszyn, Krzyki, Wrocław, dolnośląskie',
                        image: 'https://tinyurl.com/4457spk8'
                    };

                    setReservations([mockReservation]);
                }
            } catch (error) {
                console.error("Error parsing saved dates:", error);
            }
        }

        setIsLoading(false);
    }, []);

    const handleCancelReservation = (id: string) => {
        setReservations(reservations.filter(res => res.id !== id));
        Cookies.remove('selectedDates');
        alert('Rezerwacja została anulowana.');
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pl-PL');
    };

    const calculateTotalDays = (startDate: Date, endDate: Date) => {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <>
            <Navbar currentPage={3} isLoggedIn={true} user={{name: 'User', email: 'user@example.com'}} />
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-3">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <div className="position-relative" style={{ width: '150px', height: '150px' }}>
                                        <Image
                                            src="https://tinyurl.com/yfx35v7h"
                                            alt="User"
                                            className="rounded-circle"
                                            fill
                                            sizes="150px"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <h4>User</h4>
                                        <p className="text-muted font-size-sm">user@example.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="list-group list-group-flush">
                                <a href="#" className="list-group-item list-group-item-action active">
                                    Moje rezerwacje
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    Ustawienia konta
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    Historia płatności
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    Wyloguj się
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">Moje rezerwacje</h4>
                            </div>
                            <div className="card-body">
                                {isLoading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : reservations.length === 0 ? (
                                    <div className="alert alert-info">
                                        Nie masz żadnych aktywnych rezerwacji.
                                    </div>
                                ) : (
                                    reservations.map(reservation => (
                                        <div key={reservation.id} className="card mb-3">
                                            <div className="row g-0">
                                                <div className="col-md-4">
                                                    <div className="position-relative" style={{ height: '200px' }}>
                                                        <Image
                                                            src={reservation.image}
                                                            alt={reservation.propertyTitle}
                                                            className="rounded-start"
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, 33vw"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{reservation.propertyTitle}</h5>
                                                        <p className="card-text">
                                                            <small className="text-muted">{reservation.location}</small>
                                                        </p>
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="badge bg-primary">
                                {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                              </span>
                                                            <span className="text-primary fw-bold">
                                {calculateTotalDays(reservation.startDate, reservation.endDate)} dni
                              </span>
                                                        </div>
                                                        <p className="card-text fw-bold text-success mb-3">
                                                            {reservation.price} zł / miesiąc
                                                        </p>
                                                        <div className="d-flex justify-content-between">
                                                            <Link className="btn btn-outline-primary" aria-current="page" href="/detail-view">
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountPage;
