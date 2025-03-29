import React, { useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityContext } from '../contexts/AccessibilityContext';

/**
 * TranslationWrapper - Automatically translates DOM elements with data-i18n attributes
 * This component wraps your app and provides automatic translation functionality
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const TranslationWrapper = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { settings } = useContext(AccessibilityContext);
  const observerRef = useRef(null);
  const translatedElements = useRef(new Set());
  const lastLanguage = useRef(settings.language || 'en');

  // Setup translation functionality
  useEffect(() => {
    // Make translateElement function available globally
    window.translateElement = (element) => translateElement(element, t);
    window.translatePage = translatePage;
    
    // Make i18n instance available globally for components
    window.i18n = i18n;
    
    return () => {
      window.translateElement = null;
      window.translatePage = null;
      window.i18n = null;
    };
  }, [t, i18n]);

  // Apply language change
  useEffect(() => {
    if (settings.language && settings.language !== lastLanguage.current) {
      console.log(`Changing language from ${lastLanguage.current} to ${settings.language}`);
      
      // Change i18n language
      i18n.changeLanguage(settings.language).then(() => {
        // Clear translation cache and force retranslation of everything
        translatedElements.current = new Set();
        
        // Translate all elements including those without data-i18n
        translateEverything();
        
        // Force reload stylesheets with RTL/LTR attributes if needed
        document.documentElement.dir = ['ar', 'he', 'fa'].includes(settings.language) ? 'rtl' : 'ltr';
        
        // Update last language
        lastLanguage.current = settings.language;
      });
    }
  }, [settings.language, i18n]);

  // Initialize or update MutationObserver when language changes
  useEffect(() => {
    // First translate any existing elements
    translatePage();
    
    // Initialize MutationObserver to detect new elements
    if (!observerRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        let needsTranslation = false;
        
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            needsTranslation = true;
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if the added node has data-i18n attribute
                if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                  translateElement(node, t);
                }
                
                // Try to translate even without data-i18n if it has text
                if (node.textContent && node.children.length === 0) {
                  tryTranslateNodeText(node);
                }
                
                // Check for child elements with data-i18n
                if (node.querySelectorAll) {
                  const elements = node.querySelectorAll('[data-i18n]');
                  elements.forEach(el => translateElement(el, t));
                }
              }
            });
          }
        });
        
        // If major DOM changes were detected, translate everything
        if (needsTranslation && settings.language !== 'en') {
          translatePage();
        }
      });
      
      // Start observing the document
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    
    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [t, settings.language]);

  /**
   * Try to translate text in a node even without data-i18n
   * @param {HTMLElement} node - Node to translate
   */
  const tryTranslateNodeText = (node) => {
    // Skip script, style and other non-visual elements
    if (['SCRIPT', 'STYLE', 'META', 'LINK'].includes(node.tagName)) {
      return;
    }
    
    // Skip if already processed
    if (node.dataset.translated === 'true') {
      return;
    }
    
    // If it's a text-only node and not empty
    if (node.childNodes.length === 1 && 
        node.childNodes[0].nodeType === Node.TEXT_NODE && 
        node.textContent.trim()) {
      
      // Try to translate the content
      const originalText = node.textContent.trim();
      const translated = t(originalText, originalText);
      
      // If translation is different, update the text
      if (translated !== originalText) {
        node.textContent = translated;
        node.dataset.translated = 'true';
      }
    }
  };

  /**
   * Translate a single element
   * @param {HTMLElement} element - Element to translate
   * @param {Function} translator - Translation function
   */
  const translateElement = (element, translator) => {
    if (!element || !translator) return;
    
    // Skip elements that have been translated in this render cycle
    const elementId = element.id || element.dataset.i18n || element.textContent.substring(0, 20);
    const translationKey = `${elementId}_${i18n.language}`;
    
    if (translatedElements.current.has(translationKey)) {
      return;
    }
    
    const key = element.getAttribute('data-i18n');
    
    // Special case for input placeholders
    if (element.hasAttribute('placeholder')) {
      const placeholderText = element.getAttribute('placeholder');
      const translatedPlaceholder = key 
        ? translator(`${key}_placeholder`, placeholderText)
        : translator(placeholderText, placeholderText);
      
      element.setAttribute('placeholder', translatedPlaceholder);
    }
    
    // Special case for input values (only for certain types)
    if (element.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes(element.type)) {
      element.value = key 
        ? translator(key, element.value)
        : translator(element.value, element.value);
    }
    
    // Handle aria-label
    if (element.hasAttribute('aria-label')) {
      const ariaLabel = element.getAttribute('aria-label');
      const translatedAriaLabel = key 
        ? translator(`${key}_ariaLabel`, ariaLabel)
        : translator(ariaLabel, ariaLabel);
      
      element.setAttribute('aria-label', translatedAriaLabel);
    }
    
    // Handle title attribute
    if (element.hasAttribute('title')) {
      const title = element.getAttribute('title');
      const translatedTitle = key 
        ? translator(`${key}_title`, title)
        : translator(title, title);
      
      element.setAttribute('title', translatedTitle);
    }
    
    // Regular text content translation
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      const content = element.textContent.trim();
      if (content) {
        element.textContent = key 
          ? translator(key, content) 
          : translator(content, content);
      }
    }
    
    // Mark as translated in this cycle
    translatedElements.current.add(translationKey);
    element.dataset.translated = 'true';
  };

  /**
   * Translate all elements on the page with data-i18n attributes
   */
  const translatePage = () => {
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => translateElement(element, t));
    
    // Also translate page title
    document.title = t('pageTitle', document.title);
    
    // Set HTML lang attribute
    document.documentElement.lang = settings.language || i18n.language || 'en';
  };
  
  /**
   * More aggressive translation that tries to translate all visible text
   */
  const translateEverything = () => {
    // Reset the Set of translated elements
    translatedElements.current = new Set();
    
    // First translate elements with data-i18n attributes
    translatePage();
    
    // Force headers, navigation, and important content to translate
    document.querySelectorAll('nav a, h1, h2, h3, button, .menu-item, footer a, label, p').forEach(element => {
      if (!element.hasAttribute('data-i18n') && element.textContent.trim()) {
        tryTranslateNodeText(element);
      }
    });
    
    // Translate all headers and navigation items regardless of structure
    document.querySelectorAll('header, nav, .nav-item, .nav-link, .menu, .navbar').forEach(element => {
      const textElements = element.querySelectorAll('*');
      textElements.forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && el.textContent.trim()) {
          tryTranslateNodeText(el);
        }
      });
    });
    
    // Find and translate all menu items, sidebar links, and content areas
    document.querySelectorAll('.menu, .sidebar, .content, main, article, section').forEach(element => {
      const textElements = element.querySelectorAll('*');
      textElements.forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && el.textContent.trim()) {
          tryTranslateNodeText(el);
        }
      });
    });
    
    // Then attempt to translate all text nodes in the body
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Filter out empty text nodes and nodes in script/style elements
          if (!node.textContent.trim() || 
              ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentNode.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    // Walk through all text nodes
    let textNode;
    while (textNode = walker.nextNode()) {
      const parent = textNode.parentNode;
      
      // Skip if already translated or has data-i18n
      if (parent.dataset && parent.dataset.translated === 'true' || 
          (parent.hasAttribute && parent.hasAttribute('data-i18n'))) {
        continue;
      }
      
      // Skip form inputs and attributes
      if (['INPUT', 'TEXTAREA', 'OPTION'].includes(parent.tagName)) {
        continue;
      }
      
      const text = textNode.textContent.trim();
      if (text && text.length > 3) { // Only translate meaningful text
        // Try to translate
        const translation = t(text, text);
        if (translation !== text) {
          textNode.textContent = textNode.textContent.replace(text, translation);
          if (parent.dataset) parent.dataset.translated = 'true';
        }
      }
    }
  };

  return <>{children}</>;
};

export default TranslationWrapper; 