import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CartProvider } from './contexts/CartContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import AppContent from './components/AppContent';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <AccessibilityProvider>
            <AppContent />
          </AccessibilityProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App; 