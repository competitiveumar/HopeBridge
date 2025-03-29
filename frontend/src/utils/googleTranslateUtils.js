// Google Translate API utility functions

/**
 * Initialize Google Translate API by loading the script
 * This should be called once on app initialization
 */
export const initGoogleTranslate = () => {
  try {
    // Create the main container first but keep it hidden
    let mainContainer = document.getElementById('google-translate-element');
    if (!mainContainer) {
      mainContainer = document.createElement('div');
      mainContainer.id = 'google-translate-element';
      mainContainer.style.display = 'none';
      document.body.appendChild(mainContainer);
    }

    // Create the hidden container
    let hiddenContainer = document.getElementById('google_translate_element');
    if (!hiddenContainer) {
      hiddenContainer = document.createElement('div');
      hiddenContainer.id = 'google_translate_element';
      hiddenContainer.style.display = 'none';
      document.body.appendChild(hiddenContainer);
    }

    // Check if script already exists
    if (document.getElementById('google-translate-api')) {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.id = 'google-translate-api';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    // Initialize callback before adding script
    window.googleTranslateElementInit = () => {
      try {
        // Initialize in both containers to ensure availability
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: '', // Include all languages
            autoDisplay: false,
            multilanguagePage: true,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );

        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: '',
            autoDisplay: false,
            multilanguagePage: true,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google-translate-element'
        );

        // Set initialization flag
        window.googleTranslateInitialized = true;

        // Notify components
        document.dispatchEvent(new CustomEvent('google-translate-ready'));

        // Clean up any existing translations
        cleanupGoogleTranslate();
      } catch (error) {
        console.error('Failed to initialize Google Translate:', error);
      }
    };

    // Add script to document
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error in initGoogleTranslate:', error);
  }
};

const languages = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ms', name: 'Malay' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'es', name: 'Spanish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ur', name: 'Urdu' },
  { code: 'vi', name: 'Vietnamese' }
];

/**
 * Create or toggle the Google Translate element
 * @param {boolean} show - Whether to show or hide the translation
 * @param {string} targetElement - ID of the element to insert translate element into
 * @returns {boolean} - Success status
 */
export const toggleGoogleTranslate = (show, targetElement = 'google-translate-element') => {
  try {
    // Check if Google Translate is ready
    if (!window.google?.translate) {
      console.warn('Google Translate API not loaded yet');
      return false;
    }
    
    const container = document.getElementById(targetElement);
    if (!container) {
      console.error(`Target element #${targetElement} not found`);
      return false;
    }
    
    if (show) {
      // Clean up any existing translation elements first
      cleanupGoogleTranslateOnly();
      
      // Clear the container
      container.innerHTML = '';
      
      // Create a direct, simple dropdown instead of using Google's widget
      const titleElement = document.createElement('div');
      titleElement.textContent = 'Select Language';
      titleElement.style.fontWeight = 'bold';
      titleElement.style.marginBottom = '8px';
      titleElement.style.fontFamily = 'Arial, sans-serif';
      
      const selectElement = document.createElement('select');
      selectElement.id = 'google-translate-select';
      selectElement.style.width = '100%';
      selectElement.style.padding = '8px 12px';
      selectElement.style.borderRadius = '4px';
      selectElement.style.border = '1px solid rgba(0, 0, 0, 0.23)';
      selectElement.style.fontSize = '14px';
      selectElement.style.fontFamily = 'Arial, sans-serif';
      selectElement.setAttribute('aria-label', 'Select language for translation');

      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '-- Select Language --';
      selectElement.appendChild(defaultOption);
      
      // Add language options
      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        selectElement.appendChild(option);
      });
      
      // Add change event listener
      selectElement.addEventListener('change', function() {
        const langCode = this.value;
        if (langCode) {
          translatePage(langCode);
        } else {
          cleanupGoogleTranslate();
        }
      });
      
      // Add elements to container
      container.appendChild(titleElement);
      container.appendChild(selectElement);
      container.style.display = 'block';
      
      return true;
    } else {
      // Hide the container and clean up
      container.style.display = 'none';
      container.innerHTML = '';
      cleanupGoogleTranslate();
      return true;
    }
  } catch (error) {
    console.error('Error in toggleGoogleTranslate:', error);
    return false;
  }
};

/**
 * Translate the page to the specified language
 * @param {string} langCode - The language code to translate to
 */
const translatePage = (langCode) => {
  if (!langCode) return;

  try {
    // Save language preference
    localStorage.setItem('selectedTranslateLanguage', langCode);

    // Set translation cookies
    const domain = window.location.hostname;
    document.cookie = `googtrans=/auto/${langCode}`;
    if (domain !== 'localhost') {
      document.cookie = `googtrans=/auto/${langCode}; domain=${domain}`;
      document.cookie = `googtrans=/auto/${langCode}; domain=.${domain}`;
    }

    // Get translation instance
    const translateInstance = window.google?.translate?.TranslateElement?.getInstance();
    if (!translateInstance) {
      console.warn('Translation instance not available');
      return;
    }

    // Try multiple translation methods in sequence
    const methods = [
      // Method 1: Direct API call
      () => {
        if (translateInstance?.translate) {
          translateInstance.translate(langCode);
          return true;
        }
        return false;
      },
      // Method 2: Internal API call
      () => {
        if (translateInstance?.c?.qg?.values_ && translateInstance?.c?.xh?.Yb) {
          translateInstance.c.qg.values_.sl = 'auto';
          translateInstance.c.qg.values_.tl = langCode;
          translateInstance.c.xh.Yb();
          return true;
        }
        return false;
      },
      // Method 3: Combo box simulation
      () => {
        const comboBox = document.querySelector('.goog-te-combo');
        if (comboBox) {
          comboBox.value = langCode;
          comboBox.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        return false;
      }
    ];

    // Try each method until one succeeds
    let success = false;
    for (const method of methods) {
      try {
        if (method()) {
          success = true;
          // Dispatch custom event for successful translation
          document.dispatchEvent(new CustomEvent('translation-changed', { 
            detail: { language: langCode }
          }));
          break;
        }
      } catch (err) {
        console.warn('Translation method failed, trying next method');
      }
    }

    // If all methods failed, try force translation
    if (!success) {
      forcePageTranslation(langCode);
    }

    // Add translation classes
    document.body.classList.add('translated-ltr');
    document.documentElement.classList.add('translated-ltr');
    
    // Handle RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    if (rtlLanguages.includes(langCode)) {
      document.body.classList.remove('translated-ltr');
      document.body.classList.add('translated-rtl');
      document.documentElement.classList.remove('translated-ltr');
      document.documentElement.classList.add('translated-rtl');
      document.dir = 'rtl';
    } else {
      document.body.classList.remove('translated-rtl');
      document.body.classList.add('translated-ltr');
      document.documentElement.classList.remove('translated-rtl');
      document.documentElement.classList.add('translated-ltr');
      document.dir = 'ltr';
    }

  } catch (error) {
    console.error('Translation failed:', error);
  }
};

/**
 * Force Google Translate to translate the page content
 * @param {string} langCode - The language code to translate to
 */
const forcePageTranslation = (langCode) => {
  if (!langCode) return;

  try {
    // Create or get the translation container
    let container = document.getElementById('google_translate_container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google_translate_container';
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    // Initialize new translation element
    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: langCode,
      autoDisplay: false,
      multilanguagePage: true,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, container.id);

    // Set translation cookie
    document.cookie = `googtrans=/auto/${langCode}; path=/`;

    // Add translation classes
    document.body.classList.add('translated-ltr');
    document.documentElement.classList.add('translated-ltr');

    // Clean up container after translation is complete
    setTimeout(() => {
      if (container?.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 5000);

  } catch (err) {
    console.warn('Force translation error:', err);
  }
};

/**
 * Check if Google Translate API is ready
 * @returns {boolean} - Whether the API is ready to use
 */
export const isGoogleTranslateReady = () => {
  return window.googleTranslateInitialized === true &&
         window.google &&
         window.google.translate &&
         window.google.translate.TranslateElement;
};

/**
 * Clean up Google Translate elements but preserve language preference
 */
const cleanupGoogleTranslateOnly = () => {
  try {
    // Remove Google translate frames without affecting cookies
    const elements = document.querySelectorAll('.goog-te-menu-frame, .goog-te-banner-frame');
    elements.forEach(el => {
      if (el?.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    // Remove the toolbar if present
    const toolbar = document.getElementById(':1.container');
    if (toolbar?.parentNode) {
      toolbar.parentNode.removeChild(toolbar);
    }

    // Remove translation classes
    document.body.classList.remove('translated-ltr', 'translated-rtl');
    document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
  } catch (err) {
    console.warn('Cleanup error:', err);
  }
};

/**
 * Clean up Google Translate from the page
 */
export const cleanupGoogleTranslate = () => {
  // Remove any translate elements
  const container = document.getElementById('google-translate-element');
  if (container) {
    container.innerHTML = '';
  }
  
  // Reset any Google translate cookies and classes
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
  
  // Remove Google translate toolbar
  const googBar = document.getElementById(':1.container');
  if (googBar) {
    googBar.parentNode.removeChild(googBar);
  }
  
  // Remove translate frames
  const translateElements = document.querySelectorAll('.goog-te-menu-frame, .goog-te-banner-frame');
  translateElements.forEach(el => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
  
  // Remove translate classes from body and html elements
  document.body.classList.remove('translated-ltr', 'translated-rtl');
  document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
}; 