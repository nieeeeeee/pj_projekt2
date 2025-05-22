"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Navbar from "~/app/_components/Navbar";
export default function RentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [rent, setRent] = useState("");
  const [rooms, setRooms] = useState("");
  const [meterage, setMeterage] = useState("");
  const [images, setImages] = useState([]);

  const [message, setMessage] = useState(null);



  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);



  // Convert uploaded files to base64 strings
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: title || null,
      description: description || null,
      location: location || null,
      price: price ? Number(price) : null,
      rent: rent ? Number(rent) : null,
      rooms: rooms ? Number(rooms) : null,
      meterage: meterage ? Number(meterage) : null,
      images,
    };

    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Rental listing created successfully!");
        setTitle("");
        setDescription("");
        setLocation("");
        setPrice("");
        setRent("");
        setRooms("");
        setMeterage("");
        setImages([]);
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage('Failed to create rental listing');
    }
  };


  if (status === "loading") {
    return <div className="text-center my-5">Loading...</div>;
  }


  return (
    <main className="container my-4">
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} /> {/* ✅ Pass session */}

      <h1 className="mb-4">Create Rental Listing</h1>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titleInput" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="titleInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={511}
            placeholder="Listing title"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descriptionTextarea" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="descriptionTextarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of the rental"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="locationInput" className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            id="locationInput"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={511}
            placeholder="Location"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="priceInput" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="priceInput"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            placeholder="Price (decimal)"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rentInput" className="form-label">Rent</label>
          <input
            type="number"
            className="form-control"
            id="rentInput"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            step="0.01"
            min="0"
            placeholder="Rent (decimal)"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="roomsInput" className="form-label">Rooms</label>
          <input
            type="number"
            className="form-control"
            id="roomsInput"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            min="0"
            placeholder="Number of rooms"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="meterageInput" className="form-label">Meterage (m²)</label>
          <input
            type="number"
            className="form-control"
            id="meterageInput"
            value={meterage}
            onChange={(e) => setMeterage(e.target.value)}
            min="0"
            placeholder="Area in square meters"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imageUpload" className="form-label">Upload Images</label>
          <input
            type="file"
            className="form-control"
            id="imageUpload"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <div className="d-flex flex-wrap gap-2 mt-2">
            {images.map((img, i) => (
              <div key={i} className="position-relative">
                <img
                  src={img}
                  alt={`upload-${i}`}
                  className="img-thumbnail"
                  style={{ width: '96px', height: '96px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle"
                  style={{ borderRadius: '50%', width: '24px', height: '24px', padding: '0', fontSize: '0.75rem', lineHeight: '1' }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}