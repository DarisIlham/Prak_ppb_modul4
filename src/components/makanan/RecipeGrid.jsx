// src/components/makanan/RecipeGrid.jsx
import { Clock, Star, ChefHat } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Pagination from '../shared/Pagination';

function RecipeGrid({ recipes = [], onSelect, favorites = {}, toggleFavorite }) {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;
  const cardRefs = useRef([]);

  const totalPages = Math.max(1, Math.ceil(recipes.length / cardsPerPage));
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentRecipes = recipes.slice(startIndex, endIndex);

  useEffect(() => setCurrentPage(1), [recipes]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, currentRecipes.length);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.index);
          setTimeout(() => setVisibleCards(prev => new Set(prev).add(idx)), (idx % 3) * 150);
        }
      });
    }, { threshold: 0.1 });

    cardRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.dataset.index = String(startIndex + i);
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [currentRecipes, startIndex]);

  return (
    <section className="container mx-auto px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-slate-800 text-center mb-4">Jelajahi Resep Makanan</h1>
      <p className="text-center text-slate-500 max-w-2xl mx-auto mb-8">Temukan inspirasi masakan Nusantara favoritmu. Dari hidangan utama hingga camilan, semua ada di sini.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRecipes.map((recipe, i) => {
          const absoluteIndex = startIndex + i;
          return (
            <div key={recipe.id} ref={el => cardRefs.current[i] = el} onClick={() => onSelect && onSelect(recipe.id)} className={`group transform transition-all duration-700 ${visibleCards.has(absoluteIndex) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/15 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-32 md:h-56 overflow-hidden">
                  <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <div className="relative z-10 p-4 md:p-8">
                  <div className="absolute top-3 right-3 z-20">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite && toggleFavorite('makanan', recipe.id); }} className="p-1 rounded-full bg-white/80 hover:bg-white text-red-500 transition-colors" aria-label="toggle favorite">
                      {favorites && Array.isArray(favorites.makanan) && favorites.makanan.map(Number).includes(Number(recipe.id)) ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-100/90 px-2 md:px-3 py-1 md:py-1.5 rounded-full">Makanan</span>
                    <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                      <span className="text-xs md:text-sm font-semibold text-slate-700">4.8</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-xl group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">{recipe.name}</h3>

                  <div className="flex items-center justify-between text-xs md:text-sm text-slate-600">
                    <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="font-medium">{recipe.ingredients.length} bahan</span>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                      <ChefHat className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="font-medium">{recipe.steps.length} langkah</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recipes.length === 0 && <p className="text-center text-gray-500 col-span-full">No recipes found</p>}

      {recipes.length > cardsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

RecipeGrid.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      image_url: PropTypes.string,
      ingredients: PropTypes.array,
      steps: PropTypes.array,
    })
  ).isRequired,
  onSelect: PropTypes.func,
  favorites: PropTypes.shape({
    makanan: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  }),
  toggleFavorite: PropTypes.func,
};

export default RecipeGrid;