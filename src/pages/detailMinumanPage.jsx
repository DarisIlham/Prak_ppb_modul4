// src/pages/detailMinumanPage.jsx
import React from 'react';
import { ResepMinuman } from '../data/minuman';

export default function DetailMinumanPage({ id, onBack }) {
  const all = Object.values(ResepMinuman.resep);
  const recipe = all.find((r) => Number(r.id) === Number(id)) || null;

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <button onClick={() => onBack && onBack()} className="mb-4 text-sm text-blue-600">← Kembali</button>
        <p>Resep tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={() => onBack && onBack()} className="mb-4 text-sm text-blue-600">← Kembali</button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {recipe.image_url && (
          <img src={recipe.image_url} alt={recipe.name} className="w-full h-64 object-cover" />
        )}

        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-2">{recipe.name}</h1>

          <section className="mb-4">
            <h2 className="text-lg font-medium mb-2">Bahan-bahan</h2>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2">Langkah</h2>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
