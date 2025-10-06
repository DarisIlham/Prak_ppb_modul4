// src/main.jsx
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
// MakananPage and MinumanPage replaced by RecipesPage
import RecipesPage from './pages/RecipesPage';
import DetailMakananPage from './pages/detailMakananPage';
import DetailMinumanPage from './pages/detailMinumanPage';
import ProfilePage from './pages/ProfilePage';
import Favorite from './pages/Favorite';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css'
import PWABadge from './PWABadge';

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useState({ makanan: [], minuman: [] });

  useEffect(() => {
    try {
      const m = JSON.parse(localStorage.getItem('favorites:makanan') || '[]');
      const n = JSON.parse(localStorage.getItem('favorites:minuman') || '[]');
      setFavorites({ makanan: Array.isArray(m) ? m : [], minuman: Array.isArray(n) ? n : [] });
    } catch {
      setFavorites({ makanan: [], minuman: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites:makanan', JSON.stringify(favorites.makanan));
    localStorage.setItem('favorites:minuman', JSON.stringify(favorites.minuman));
  }, [favorites]);

  const toggleFavorite = (type, id) => {
    setFavorites((prev) => {
      const list = Array.isArray(prev[type]) ? prev[type].map(Number) : [];
      const exists = list.includes(Number(id));
      const updated = exists ? list.filter((v) => v !== Number(id)) : [...list, Number(id)];
      return { ...prev, [type]: updated };
    });
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleSelectRecipe = (type, id) => {
    setSelectedType(type);
    setSelectedId(id);
    setCurrentPage(type === 'makanan' ? 'makanan-detail' : 'minuman-detail');
  };

  const handleBackFromDetail = () => {
    // go back to the list page for the selected type
    setCurrentPage(selectedType || 'home');
    setSelectedType(null);
    setSelectedId(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'makanan':
        return (
          <RecipesPage
            initialType="makanan"
            onSelect={(id) => handleSelectRecipe('makanan', id)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'minuman':
        return (
          <RecipesPage
            initialType="minuman"
            onSelect={(id) => handleSelectRecipe('minuman', id)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'profile':
        return <ProfilePage />;
      case 'makanan-detail':
        return (
          <DetailMakananPage
            id={selectedId}
            onBack={handleBackFromDetail}
            isFavorited={favorites.makanan.map(Number).includes(Number(selectedId))}
            onToggleFavorite={() => toggleFavorite('makanan', selectedId)}
          />
        );
      case 'minuman-detail':
        return (
          <DetailMinumanPage
            id={selectedId}
            onBack={handleBackFromDetail}
            isFavorited={favorites.minuman.map(Number).includes(Number(selectedId))}
            onToggleFavorite={() => toggleFavorite('minuman', selectedId)}
          />
        );
      case 'favorites':
        return (
          <Favorite
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onSelect={(type, id) => handleSelectRecipe(type, id)}
          />
        );
      default:
        return <HomePage />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navbar */}
      <DesktopNavbar currentPage={currentPage} onNavigate={handleNavigation} />
      
      {/* Main Content */}
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>
      
      {/* Mobile Navbar */}
      <MobileNavbar currentPage={currentPage} onNavigate={handleNavigation} />

      <PWABadge />
    </div>
  );
}

export default AppRoot;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)