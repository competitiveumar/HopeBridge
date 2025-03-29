import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import './styles/googleTranslate.css'; // Import Google Translate styles
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme';
import './i18n'; // Import i18n configuration

// Add react-axe for accessibility testing in development
if (process.env.NODE_ENV !== 'production') {
  const axe = require('react-axe');
  axe(React, ReactDOM, 1000, {
    rules: [
      // Include specific rules or disable some
      { id: 'color-contrast', enabled: true },
      { id: 'aria-roles', enabled: true },
      { id: 'aria-valid-attr', enabled: true },
      { id: 'image-alt', enabled: true },
      { id: 'label', enabled: true },
    ]
  });
}

// Add comment for screen readers when app is focused
document.addEventListener('focusin', () => {
  const focusedElement = document.activeElement;
  if (focusedElement && focusedElement.tagName !== 'BODY') {
    const ariaLabel = focusedElement.getAttribute('aria-label');
    const text = focusedElement.textContent || '';
    const description = ariaLabel || text;
    if (description && description.trim()) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('screen-reader-only');
      announcement.textContent = `Focused: ${description.trim()}`;
      document.body.appendChild(announcement);
      
      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 