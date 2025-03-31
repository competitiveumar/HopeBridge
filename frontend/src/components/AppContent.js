import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import '../App.css';

// Layout components
import Header from './layout/Header';
import Footer from './layout/Footer';
import ChatBot from './ChatBot';
import AccessibilityWidget from './AccessibilityWidget';
import TranslationWrapper from './TranslationWrapper';
import { DonationProvider } from '../contexts/DonationContext';

// Pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import DonationsPage from '../pages/DonationsPage';
import Blog from '../pages/Blog';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import NonprofitsPage from '../pages/NonprofitsPage';
import ApplicationFormPage from '../pages/ApplicationFormPage';
import CompaniesPage from '../pages/CompaniesPage';
import DisastersPage from '../pages/DisastersPage';
import GiftCardsPage from '../pages/GiftCardsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import EventsPage from '../pages/EventsPage';
import PastEventsPage from '../pages/PastEventsPage';
import HostEventPage from '../pages/HostEventPage';
import AccountSettingsPage from '../pages/AccountSettingsPage';
import TrainingResourcesPage from '../pages/TrainingResourcesPage';
import MentorshipProgramPage from '../pages/MentorshipProgramPage';
import VolunteerRegisterPage from '../pages/VolunteerRegisterPage';
import DonorRegisterPage from '../pages/DonorRegisterPage';
import VolunteerDashboardPage from '../pages/VolunteerDashboardPage';

// Hooks and Utils
import useVoiceCommands from '../hooks/useVoiceCommands';
import { enhanceMediaAccessibility } from '../utils/accessibilityUtils';

function AppContent() {
  const [loading, setLoading] = useState(true);

  // Initialize voice commands for the whole app
  const { isEnabled } = useVoiceCommands();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Apply media accessibility enhancements when component mounts or settings change
  useEffect(() => {
    // Enhance all media elements for accessibility
    const cleanup = enhanceMediaAccessibility(true);
    
    return cleanup;
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
        <span className="screen-reader-only" data-i18n="general.loading">Loading...</span>
      </Box>
    );
  }

  return (
    <TranslationWrapper>
      <Box 
        display="flex" 
        flexDirection="column" 
        minHeight="100vh"
        sx={{
          overflow: 'hidden', // Prevent horizontal scrolling on mobile
          width: '100%'
        }}
      >
        <a href="#main-content" className="skip-link screen-reader-only" data-i18n="accessibility.skipLink">
          Skip to main content
        </a>
        <Header />
        <Box 
          component="main" 
          id="main-content" 
          flexGrow={1}
          sx={{
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
        >
          <DonationProvider>
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
              <Route path="/register-volunteer" element={<VolunteerRegisterPage />} />
              <Route path="/register-donor" element={<DonorRegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/dashboard/*" element={<DashboardPage />} />
              <Route path="/volunteer-dashboard" element={<VolunteerDashboardPage />} />
              <Route path="/nonprofits" element={<NonprofitsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/disasters" element={<DisastersPage />} />
              <Route path="/application-form" element={<ApplicationFormPage />} />
              <Route path="/account-settings" element={<AccountSettingsPage />} />
              <Route path="/training-resources" element={<TrainingResourcesPage />} />
              <Route path="/mentorship-program" element={<MentorshipProgramPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </DonationProvider>
        </Box>
        <Footer />
        <ChatBot />
        <AccessibilityWidget />
      </Box>
    </TranslationWrapper>
  );
}

export default AppContent; 