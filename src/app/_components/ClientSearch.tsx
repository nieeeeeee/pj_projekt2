'use client';

import { useState } from 'react';

interface Props {
  cities: string[];
}

export default function ClientSearch({ cities }: Props) {
  const [category, setCategory] = useState('Domy');
  const [location, setLocation] = useState('Wrocław');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sizeMin, setSizeMin] = useState('');
  const [sizeMax, setSizeMax] = useState('');
  const [rooms, setRooms] = useState<(string | number)[]>([]);

  return (
    <header className="bg-gray-100 p-4 shadow-md">
      <div className="container mx-auto flex flex-wrap gap-2 items-center">
        <select className="p-2 border rounded" value={category}
                onChange={(e) => setCategory(e.target.value)}>
          <option>Domy</option>
          <option>Mieszkania</option>
          <option>Działki</option>
        </select>

        <select className="p-2 border rounded w-48" value={location}
                onChange={(e) => setLocation(e.target.value)}>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input type="number" className="p-2 border rounded w-20" placeholder="Cena od"
               value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
        <input type="number" className="p-2 border rounded w-20" placeholder="Cena do"
               value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />

        <input type="number" className="p-2 border rounded w-20" placeholder="m² od"
               value={sizeMin} onChange={(e) => setSizeMin(e.target.value)} />
        <input type="number" className="p-2 border rounded w-20" placeholder="m² do"
               value={sizeMax} onChange={(e) => setSizeMax(e.target.value)} />

        <div className="flex flex-col gap-2">
          <span className="font-medium">liczba pokoji:</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, '6+'].map((num) => (
              <button
                key={num}
                className={`p-2 border rounded ${rooms.includes(num) ? 'bg-blue-500 text-white' : 'bg-white'}`}
                onClick={() =>
                  setRooms((prev) =>
                    prev.includes(num) ? prev.filter((r) => r !== num) : [...prev, num]
                  )
                }
              >
                {num}
              </button>
            ))}
            <button className="p-2 border rounded bg-black text-white">Wyszukaj</button>
          </div>
        </div>
      </div>
    </header>
  );
}
