// src/pages/Favorite.jsx
import React from 'react';
import { ResepMakanan } from '../data/makanan';
import { ResepMinuman } from '../data/minuman';

export default function Favorite({ favorites = { makanan: [], minuman: [] }, toggleFavorite, onSelect }) {
  const makananList = Object.values(ResepMakanan.resep).filter(r => (favorites.makanan || []).map(Number).includes(Number(r.id)));
  const minumanList = Object.values(ResepMinuman.resep).filter(r => (favorites.minuman || []).map(Number).includes(Number(r.id)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Favorit</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Makanan Favorit</h2>
        {makananList.length === 0 ? (
          <p className="text-slate-500">Belum ada makanan favorit.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {makananList.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelect && onSelect('makanan', r.id)}
                className="p-4 bg-white shadow rounded-lg flex items-center justify-between cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  {r.image_url && (
                    <img src={r.image_url} alt={r.name} className="w-20 h-20 object-cover rounded-md" />
                  )}
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-sm text-slate-500">{r.ingredients.length} bahan</div>
                  </div>
                </div>
                <div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite && toggleFavorite('makanan', r.id); }} className="text-sm text-red-500">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Minuman Favorit</h2>
        {minumanList.length === 0 ? (
          <p className="text-slate-500">Belum ada minuman favorit.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {minumanList.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelect && onSelect('minuman', r.id)}
                className="p-4 bg-white shadow rounded-lg flex items-center justify-between cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  {r.image_url && (
                    <img src={r.image_url} alt={r.name} className="w-20 h-20 object-cover rounded-md" />
                  )}
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-sm text-slate-500">{r.ingredients.length} bahan</div>
                  </div>
                </div>
                <div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite && toggleFavorite('minuman', r.id); }} className="text-sm text-red-500">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
