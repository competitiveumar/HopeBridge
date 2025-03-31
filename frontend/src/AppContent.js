import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAccessibility } from './contexts/AccessibilityContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AccessibilityWidget from './components/AccessibilityWidget';
import Home from './pages/Home';
import About from './pages/About';
import Donations from './pages/Donations';
import Events from './pages/Events';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerRegisterPage from './pages/VolunteerRegisterPage';
import DonorRegisterPage from './pages/DonorRegisterPage';
import DashboardPage from './pages/DashboardPage';
import VolunteerDashboardPage from './pages/VolunteerDashboardPage';
import Cart from './pages/Cart';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import { initGoogleTranslate, translatePage } from './utils/googleTranslateUtils';
import { TranslationWrapper } from './components/TranslationWrapper';

const AppContent = () => {
  const location = useLocation();
  const { settings } = useAccessibility();

  // Initialize Google Translate when component mounts
  useEffect(() => {
    initGoogleTranslate();
  }, []);

  // Apply translation when navigation happens or settings change
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedTranslateLanguage');
    if (settings.googleTranslate && savedLanguage && savedLanguage !== 'en') {
      // Wait for content to load before applying translation
      setTimeout(() => {
        translatePage(savedLanguage);
      }, 500);
    }
  }, [location.pathname, settings.googleTranslate]);

  // Handle translation of dynamic content
  useEffect(() => {
    const handleDOMChanges = () => {
      const savedLanguage = localStorage.getItem('selectedTranslateLanguage');
      if (settings.googleTranslate && savedLanguage && savedLanguage !== 'en') {
        // Update the custom translate dropdown if it exists
        const select = document.getElementById('custom-google-translate-selector');
        if (select && select.value !== savedLanguage) {
          select.value = savedLanguage;
        }
      }
    };

    // Create observer for content changes
    const observer = new MutationObserver(handleDOMChanges);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: true 
    });

    return () => {
      observer.disconnect();
    };
  }, [settings.googleTranslate]);

  return (
    <TranslationWrapper>
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-volunteer" element={<VolunteerRegisterPage />} />
          <Route path="/register-donor" element={<DonorRegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboardPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AccessibilityWidget />
    </TranslationWrapper>
  );
};

export default AppContent; 