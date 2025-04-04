import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  addMissingAltText,
  enhanceFormAccessibility,
  enhanceKeyboardNavigation,
  enhanceMediaAccessibility,
  improveTextContrast,
  restoreTextContrast,
  createSkipLink
} from '../utils/accessibilityUtils';

export const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    grayscale: false,
    textSize: 100,
    screenReader: false,
    captions: false,
    keyboardNav: true,
    voiceCommands: false
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading accessibility settings", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Apply data attributes to the document for CSS targeting
    document.documentElement.setAttribute('data-grayscale', settings.grayscale);
    
    // Apply text size
    if (settings.textSize !== 100) {
      document.documentElement.style.fontSize = `${settings.textSize}%`;
    } else {
      document.documentElement.style.fontSize = '';
    }
  }, [settings]);

  // Apply accessibility enhancements based on settings
  useEffect(() => {
    // Add skip link for keyboard navigation
    createSkipLink();
    
    // Add alt text to all images that don't have it
    addMissingAltText();
    
    // Enhance form accessibility
    enhanceFormAccessibility();
    
    // Apply keyboard navigation enhancements if enabled
    if (settings.keyboardNav) {
      enhanceKeyboardNavigation();
    }
    
    // Apply media captions if enabled
    if (settings.captions) {
      enhanceMediaAccessibility(true);
    } else {
      enhanceMediaAccessibility(false);
    }
    
    // Apply grayscale if enabled
    if (settings.grayscale) {
      document.documentElement.style.filter = 'grayscale(100%)';
    } else {
      document.documentElement.style.filter = '';
    }
    
    // Add screen reader support if enabled
    if (settings.screenReader) {
      document.body.setAttribute('aria-live', 'polite');
      // Add ARIA landmarks to important sections
      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');
      
      if (header) header.setAttribute('role', 'banner');
      if (main) main.setAttribute('role', 'main');
      if (footer) footer.setAttribute('role', 'contentinfo');
      
      // Add more descriptive aria-labels to interactive elements
      const buttons = document.querySelectorAll('button:not([aria-label])');
      buttons.forEach(button => {
        if (button.textContent && button.textContent.trim()) {
          button.setAttribute('aria-label', button.textContent.trim());
        }
      });
    }
    
  }, [settings]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleSetting = useCallback((setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({
      grayscale: false,
      textSize: 100,
      screenReader: false,
      captions: false,
      keyboardNav: true,
      voiceCommands: false
    });
    
    // Reset all applied styles and attributes
    document.documentElement.style.filter = '';
    document.documentElement.style.fontSize = '';
    document.documentElement.removeAttribute('data-grayscale');
    
    restoreTextContrast();
  }, []);

  const value = {
    settings,
    updateSettings,
    toggleSetting,
    resetSettings
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider; 