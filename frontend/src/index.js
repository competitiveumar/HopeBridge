import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { enhanceKeyboardNavigation, enhanceFormAccessibility, createSkipLink } from './utils/accessibilityUtils';

// Setup accessibility enhancements
enhanceKeyboardNavigation();
enhanceFormAccessibility();
createSkipLink();

// Add global error handler for Chrome extension errors
const originalConsoleError = console.error;
console.error = function(message, ...args) {
  // Check for the specific Chrome extension error
  if (typeof message === 'string' && message.includes('Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist')) {
    // Suppress this specific error from console output
    console.log('Suppressed Chrome extension error');
    return;
  }
  
  // For all other errors, use the original console.error
  originalConsoleError.apply(console, [message, ...args]);
};

// Handle unhandled promise rejections related to extension errors
window.addEventListener('unhandledrejection', event => {
  if (event.reason && event.reason.message && 
      event.reason.message.includes('Receiving end does not exist')) {
    // Prevent the default handling of the error
    event.preventDefault();
    console.log('Suppressed unhandled Chrome extension promise rejection');
  }
});

// Create a component to wrap all providers
const Providers = ({ children }) => (
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <NotificationProvider>
                <CartProvider>
                  <SearchProvider>
                    <AccessibilityProvider>
                      <CssBaseline />
                      {children}
                    </AccessibilityProvider>
                  </SearchProvider>
                </CartProvider>
              </NotificationProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </MuiThemeProvider>
    </I18nextProvider>
  </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Providers>
    <App />
  </Providers>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 