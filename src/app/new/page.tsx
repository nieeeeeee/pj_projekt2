"use client";

import { useState } from "react";

export default function RentPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [rent, setRent] = useState("");
  const [rooms, setRooms] = useState("");
  const [meterage, setMeterage] = useState("");
  const [images, setImages] = useState<string[]>([]); // base64 strings

  const [message, setMessage] = useState<string | null>(null);

  // Convert uploaded files to base64 strings
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result!]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: title || null,
      description: description || null,
      location: location || null,
      price: price ? Number(price) : null,
      rent: rent ? Number(rent) : null,
      rooms: rooms ? Number(rooms) : null,
      meterage: meterage ? Number(meterage) : null,
      images, // base64 encoded images
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
        // Reset form
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
      setMessage("Failed to create rental listing");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Rental Listing</h1>
      {message && (
        <div className="mb-4 p-2 bg-blue-200 text-blue-900 rounded">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-2 py-1"
            maxLength={511}
            placeholder="Listing title"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="Description of the rental"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-2 py-1"
            maxLength={511}
            placeholder="Location"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-2 py-1"
            step="0.01"
            min="0"
            placeholder="Price (decimal)"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Rent</label>
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            className="w-full border rounded px-2 py-1"
            step="0.01"
            min="0"
            placeholder="Rent (decimal)"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Rooms</label>
          <input
            type="number"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="w-full border rounded px-2 py-1"
            min="0"
            placeholder="Number of rooms"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Meterage (m²)</label>
          <input
            type="number"
            value={meterage}
            onChange={(e) => setMeterage(e.target.value)}
            className="w-full border rounded px-2 py-1"
            min="0"
            placeholder="Area in square meters"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  alt={`upload-${i}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}
