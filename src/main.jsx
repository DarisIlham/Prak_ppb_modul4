// src/main.jsx
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import DetailMakananPage from './pages/detailMakananPage';
import DetailMinumanPage from './pages/detailMinumanPage';
import ProfilePage from './pages/ProfilePage';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css'
import PWABadge from './PWABadge';

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

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
        return <MakananPage onSelect={(id) => handleSelectRecipe('makanan', id)} />;
      case 'minuman':
        return <MinumanPage onSelect={(id) => handleSelectRecipe('minuman', id)} />;
      case 'profile':
        return <ProfilePage />;
      case 'makanan-detail':
        return <DetailMakananPage id={selectedId} onBack={handleBackFromDetail} />;
      case 'minuman-detail':
        return <DetailMinumanPage id={selectedId} onBack={handleBackFromDetail} />;
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