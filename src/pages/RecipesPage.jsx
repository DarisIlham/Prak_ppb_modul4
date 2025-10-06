// src/pages/RecipesPage.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { ResepMakanan } from '../data/makanan';
import { ResepMinuman } from '../data/minuman';
import RecipeGridMakanan from '../components/makanan/RecipeGrid';
import RecipeGridMinuman from '../components/minuman/RecipeGrid';

export default function RecipesPage({ initialType = 'makanan', onSelect, favorites, toggleFavorite }) {
  const [type, setType] = useState(initialType || 'makanan');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setPage(1);
  }, [type, searchQuery]);

  const allMakanan = useMemo(() => Object.values(ResepMakanan.resep), []);
  const allMinuman = useMemo(() => Object.values(ResepMinuman.resep), []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filterList = (list) => list.filter((r) => r.name.toLowerCase().includes(q) || r.ingredients.join(' ').toLowerCase().includes(q));

    if (type === 'makanan') return filterList(allMakanan);
    if (type === 'minuman') return filterList(allMinuman);
    // both
    return [...filterList(allMakanan), ...filterList(allMinuman)];
  }, [type, searchQuery, allMakanan, allMinuman]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setType('makanan')}
              className={`px-3 py-2 rounded-md ${type === 'makanan' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
            >Makanan</button>
            <button
              onClick={() => setType('minuman')}
              className={`px-3 py-2 rounded-md ${type === 'minuman' ? 'bg-green-600 text-white' : 'bg-white text-slate-700'}`}
            >Minuman</button>
            <button
              onClick={() => setType('both')}
              className={`px-3 py-2 rounded-md ${type === 'both' ? 'bg-gray-700 text-white' : 'bg-white text-slate-700'}`}
            >Semua</button>
          </div>

          <div className="w-80">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari resep..."
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Grid */}
        {type === 'makanan' && (
          <RecipeGridMakanan recipes={paginated} onSelect={onSelect} favorites={favorites} toggleFavorite={toggleFavorite} />
        )}

        {type === 'minuman' && (
          <RecipeGridMinuman recipes={paginated} onSelect={onSelect} favorites={favorites} toggleFavorite={toggleFavorite} />
        )}

        {type === 'both' && (
          // For 'both' we render makanan grid first then minuman grid; pagination already applied across combined list
          // Determine whether items are makanan or minuman by id lookup
          (() => {
            const makananIds = new Set(allMakanan.map((r) => Number(r.id)));
            const makananItems = paginated.filter((r) => makananIds.has(Number(r.id)));
            const minumanItems = paginated.filter((r) => !makananIds.has(Number(r.id)));
            return (
              <>
                {makananItems.length > 0 && (
                  <RecipeGridMakanan recipes={makananItems} onSelect={onSelect} favorites={favorites} toggleFavorite={toggleFavorite} />
                )}
                {minumanItems.length > 0 && (
                  <RecipeGridMinuman recipes={minumanItems} onSelect={onSelect} favorites={favorites} toggleFavorite={toggleFavorite} />
                )}
              </>
            );
          })()
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center mt-8 space-x-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-white border rounded disabled:opacity-50"
          >Sebelumnya</button>
          <div className="px-3 py-2 bg-white border rounded">{page} / {totalPages}</div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 bg-white border rounded disabled:opacity-50"
          >Berikutnya</button>
        </div>
      </main>
    </div>
  );
}
