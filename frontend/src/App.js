import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatBot from './components/ChatBot';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DonationsPage from './pages/DonationsPage';
import Blog from './pages/Blog';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import NonprofitsPage from './pages/NonprofitsPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import CompaniesPage from './pages/CompaniesPage';
import DisastersPage from './pages/DisastersPage';
import GiftCardsPage from './pages/GiftCardsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import EventsPage from './pages/EventsPage';
import PastEventsPage from './pages/PastEventsPage';
import HostEventPage from './pages/HostEventPage';
import AccountSettingsPage from './pages/AccountSettingsPage';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Box component="main" flexGrow={1}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/donations" element={<DonationsPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/gift-cards" element={<GiftCardsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/past-events" element={<PastEventsPage />} />
                <Route path="/host-event" element={<HostEventPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/dashboard/*" element={<DashboardPage />} />
                <Route path="/nonprofits" element={<NonprofitsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/disasters" element={<DisastersPage />} />
                <Route path="/application-form" element={<ApplicationFormPage />} />
                <Route path="/account-settings" element={<AccountSettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Box>
            <Footer />
            <ChatBot />
          </Box>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App; 