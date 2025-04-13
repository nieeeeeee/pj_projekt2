'use client';
import Link from "next/link";
import { User } from "next-auth";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar(props: { currentPage: number; isLoggedIn: boolean; user: User }) {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    <img src="/favicon.ico" alt="Logo" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/rent">
                                Wynajem
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/sell">
                                Sprzedaż
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/about-us">
                                O nas
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {props.isLoggedIn ? (
                            <li className="nav-item">
                                <Link className="nav-link" href="/account">
                                    Witaj, {props.user.name}
                                </Link>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-primary" href="/login">
                                    Zaloguj się
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}