import Navbar from "~/app/_components/Navbar";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export default function FaqPage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;
  
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} />
      <div className="container py-5">
        <h5>FAQ</h5>
        <ul style={{ listStyleType: "none" }}>
          <li>
            <h6>Jak mogę zmienić zdjęcie profilowe?</h6>
            <p>Naciśnij na konto w prawym górnym rogu, pod nazwą użytkownika kliknąć przycisk "Zmień ikonę" -> wgraj zdjęcie</p>
          </li>
          <li>
            <h6>Jak stworzyć nową ofertę?</h6>
            <p>Naciśnij na konto w prawym górnym rogu, pod nazwą użytkownika kliknąć szeroki, niebieski przycisk "Stwórz nowe ogłoszenie".</p>
          </li>
          <li>
            <h6>Jak mogę się skontaktować z pomocą techniczną?</h6>
            <p>Żeby skontakować się z pomocą techniczną należy pisać na adres <a href="mailto:example@email.com">example@email.com</a>. Zapytania biznesowe należy kierować na adres <a
              href="mailto:example2@email.com">example2@email.com</a></p>
          </li>
        </ul>
      </div>
    </>
);
}

