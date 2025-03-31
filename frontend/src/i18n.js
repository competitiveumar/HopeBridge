import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources for all supported languages
const resources = {
  en: {
    translation: {
      // Page title
      pageTitle: 'HopeBridge - Making a Difference',
      
      // Navigation
      nav: {
        home: 'Home',
        about: 'About Us',
        donations: 'Donations',
        events: 'Events',
        blog: 'Blog',
        contact: 'Contact',
        login: 'Login',
        register: 'Sign Up',
        dashboard: 'Dashboard',
        cart: 'Cart',
        profile: 'My Profile',
        logout: 'Logout'
      },
      
      // Accessibility options
      accessibility: {
        title: 'Accessibility Options',
        highContrast: 'High Contrast',
        grayscale: 'Grayscale',
        textSize: 'Text Size',
        captions: 'Captions',
        screenReader: 'Screen Reader',
        voiceCommands: 'Voice Commands',
        keyboardNav: 'Keyboard Navigation',
        language: 'Language',
        close: 'Close',
        open: 'Open Accessibility Options',
        skipToContent: 'Skip to Main Content',
        skipLink: 'Skip to main content',
        selectLanguage: 'Select Language',
        reset: 'Reset Settings',
        increaseFontSize: 'Increase Font Size',
        decreaseFontSize: 'Decrease Font Size',
        commandsAvailable: 'Available Voice Commands',
        commandsIntro: 'Say "help" or "what can I say" for a list of commands'
      },
      
      // Voice commands section
      voiceCommands: {
        navigation: 'Navigation Commands',
        accessibility: 'Accessibility Commands',
        language: 'Language Commands',
        interaction: 'Page Interaction Commands',
        media: 'Media Controls',
        help: 'Help Commands',
        listening: 'Listening for voice commands...',
        disabled: 'Voice commands disabled',
        processing: 'Processing command...',
        unknownCommand: 'Unknown command',
        error: 'Error: {{message}}',
        success: 'Command executed: {{command}}'
      },
      
      // Home page
      home: {
        title: 'Welcome to HopeBridge',
        subtitle: 'Making a difference in the world',
        donate: 'Donate Now',
        volunteer: 'Volunteer',
        learnMore: 'Learn More',
        featuredCauses: 'Featured Causes',
        upcomingEvents: 'Upcoming Events',
        joinUs: 'Join Us Today',
        successStories: 'Success Stories',
        newsletter: 'Subscribe to Our Newsletter',
        emailPlaceholder: 'Enter your email',
        subscribe: 'Subscribe',
        recentDonations: 'Recent Donations',
        impact: 'Our Impact',
        testimonials: 'Testimonials'
      },
      
      // About page
      about: {
        title: 'About HopeBridge',
        mission: 'Our Mission',
        vision: 'Our Vision',
        team: 'Our Team',
        history: 'Our History',
        values: 'Our Values',
        partners: 'Our Partners',
        joinTeam: 'Join Our Team',
        missionStatement: 'HopeBridge aims to bridge the gap between those who have and those who need, creating a world where no one is left behind.',
        story: 'Our Story',
        impact: 'Our Impact',
        transparency: 'Transparency',
        annualReports: 'Annual Reports'
      },
      
      // Donations page
      donations: {
        title: 'Make a Donation',
        oneTime: 'One-time Donation',
        monthly: 'Monthly Donation',
        amount: 'Amount',
        custom: 'Custom Amount',
        cause: 'Select Cause',
        personalInfo: 'Personal Information',
        name: 'Full Name',
        email: 'Email Address',
        address: 'Address',
        city: 'City',
        state: 'State/Province',
        zip: 'Zip/Postal Code',
        country: 'Country',
        payment: 'Payment Information',
        cardNumber: 'Card Number',
        expiry: 'Expiration Date',
        cvv: 'CVV',
        donate: 'Donate Now',
        taxDeductible: 'Your donation is tax-deductible',
        secure: 'Secure payment processing',
        thankYou: 'Thank You for Your Donation',
        receiptEmail: 'A receipt has been sent to your email'
      },
      
      // Events page
      events: {
        title: 'Upcoming Events',
        past: 'Past Events',
        register: 'Register',
        free: 'Free',
        date: 'Date',
        time: 'Time',
        location: 'Location',
        organizer: 'Organizer',
        details: 'Event Details',
        registerNow: 'Register Now',
        attendees: 'Attendees',
        calendar: 'Add to Calendar',
        share: 'Share Event',
        relatedEvents: 'Related Events',
        filterEvents: 'Filter Events',
        search: 'Search Events'
      },
      
      // Blog page
      blog: {
        title: 'Our Blog',
        readMore: 'Read More',
        categories: 'Categories',
        tags: 'Tags',
        recent: 'Recent Posts',
        popular: 'Popular Posts',
        comments: 'Comments',
        leaveComment: 'Leave a Comment',
        name: 'Name',
        email: 'Email',
        comment: 'Comment',
        submit: 'Submit',
        share: 'Share',
        author: 'Author',
        published: 'Published',
        relatedPosts: 'Related Posts',
        search: 'Search Blog'
      },
      
      // Authentication
      auth: {
        login: 'Login',
        register: 'Sign Up',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        resetPassword: 'Reset Password',
        name: 'Full Name',
        username: 'Username',
        rememberMe: 'Remember Me',
        loginButton: 'Login',
        registerButton: 'Sign Up',
        resetButton: 'Reset',
        orContinueWith: 'Or continue with',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: 'Don\'t have an account?',
        checkEmail: 'Check your email to reset your password',
        successRegistration: 'Registration successful! Please login.'
      },
      
      // Dashboard
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome, {{name}}',
        donations: 'Your Donations',
        events: 'Your Events',
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications',
        messages: 'Messages',
        savedCauses: 'Saved Causes',
        impact: 'Your Impact',
        activity: 'Recent Activity',
        viewAll: 'View All',
        totalDonated: 'Total Donated',
        upcomingEvents: 'Upcoming Events',
        editProfile: 'Edit Profile',
        logout: 'Logout'
      },
      
      // Cart
      cart: {
        title: 'Your Cart',
        item: 'Item',
        price: 'Price',
        quantity: 'Quantity',
        total: 'Total',
        subtotal: 'Subtotal',
        tax: 'Tax',
        shipping: 'Shipping',
        grandTotal: 'Grand Total',
        checkout: 'Checkout',
        continueShopping: 'Continue Shopping',
        empty: 'Your cart is empty',
        update: 'Update Cart',
        remove: 'Remove',
        apply: 'Apply',
        couponCode: 'Coupon Code',
        estimateShipping: 'Estimate Shipping',
        country: 'Country',
        state: 'State/Province',
        zip: 'Zip/Postal Code'
      },
      
      // Footer
      footer: {
        about: 'About Us',
        contact: 'Contact Us',
        donate: 'Donate',
        volunteer: 'Volunteer',
        events: 'Events',
        blog: 'Blog',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        sitemap: 'Sitemap',
        copyright: '© {{year}} HopeBridge. All rights reserved.',
        newsletter: 'Subscribe to our newsletter',
        emailPlaceholder: 'Enter your email',
        subscribe: 'Subscribe',
        followUs: 'Follow Us',
        address: 'Address',
        phone: 'Phone',
        email: 'Email'
      },
      
      // Common button and form labels
      common: {
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        confirmation: 'Are you sure?',
        yes: 'Yes',
        no: 'No',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        viewDetails: 'View Details',
        readMore: 'Read More',
        showLess: 'Show Less',
        showMore: 'Show More'
      },
      
      // Error messages
      errors: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        password: 'Password must be at least 8 characters',
        passwordMatch: 'Passwords do not match',
        serverError: 'Server error, please try again later',
        notFound: 'Page not found',
        unauthorized: 'Unauthorized access',
        invalidLogin: 'Invalid email or password',
        networkError: 'Network error, please check your connection',
        invalidInput: 'Invalid input'
      }
    }
  },
  es: {
    translation: {
      // Page title
      pageTitle: 'HopeBridge - Haciendo la Diferencia',
      
      // Navigation
      nav: {
        home: 'Inicio',
        about: 'Sobre Nosotros',
        donations: 'Donaciones',
        events: 'Eventos',
        blog: 'Blog',
        contact: 'Contacto',
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        dashboard: 'Panel de Control',
        cart: 'Carrito',
        profile: 'Mi Perfil',
        logout: 'Cerrar Sesión'
      },
      
      // Accessibility options
      accessibility: {
        title: 'Opciones de Accesibilidad',
        highContrast: 'Alto Contraste',
        grayscale: 'Escala de Grises',
        textSize: 'Tamaño del Texto',
        captions: 'Subtítulos',
        screenReader: 'Lector de Pantalla',
        voiceCommands: 'Comandos de Voz',
        keyboardNav: 'Navegación por Teclado',
        language: 'Idioma',
        close: 'Cerrar',
        open: 'Abrir Opciones de Accesibilidad',
        skipToContent: 'Saltar al Contenido Principal',
        skipLink: 'Saltar al contenido principal',
        reset: 'Restablecer Configuración',
        increaseFontSize: 'Aumentar Tamaño de Fuente',
        decreaseFontSize: 'Disminuir Tamaño de Fuente',
        commandsAvailable: 'Comandos de Voz Disponibles',
        commandsIntro: 'Diga "ayuda" o "qué puedo decir" para ver la lista de comandos'
      },
      
      // Voice commands
      voice: {
        commands: {
          available: 'Comandos Disponibles',
          help: 'Ayuda',
          whatCanISay: '¿Qué puedo decir?',
          goToHome: 'ir a inicio',
          enableHighContrast: 'activar alto contraste',
          increaseTextSize: 'aumentar tamaño del texto',
          switchToSpanish: 'cambiar a español'
        }
      },

      // Focus announcements
      focus: {
        language: 'Idioma',
        selected: 'seleccionado'
      },
      
      // Footer
      footer: {
        about: 'Sobre Nosotros',
        contact: 'Contáctenos',
        donate: 'Donar',
        volunteer: 'Voluntariado',
        events: 'Eventos',
        blog: 'Blog',
        privacy: 'Política de Privacidad',
        terms: 'Términos de Servicio',
        sitemap: 'Mapa del Sitio',
        copyright: '© {{year}} HopeBridge. Todos los derechos reservados.',
        newsletter: 'Suscríbete a nuestro boletín',
        emailPlaceholder: 'Ingresa tu correo electrónico',
        subscribe: 'Suscribirse',
        followUs: 'Síguenos',
        address: 'Dirección',
        phone: 'Teléfono',
        email: 'Correo Electrónico'
      },
      
      // Common button and form labels
      common: {
        submit: 'Enviar',
        cancel: 'Cancelar',
        save: 'Guardar',
        edit: 'Editar',
        delete: 'Eliminar',
        search: 'Buscar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        confirmation: '¿Estás seguro?',
        yes: 'Sí',
        no: 'No',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        viewDetails: 'Ver Detalles',
        readMore: 'Leer Más',
        showLess: 'Mostrar Menos',
        showMore: 'Mostrar Más'
      }
    }
  },
  fr: {
    translation: {
      // Page title
      pageTitle: 'HopeBridge - Faire la Différence',
      
      // Navigation
      nav: {
        home: 'Accueil',
        about: 'À Propos',
        donations: 'Dons',
        events: 'Événements',
        blog: 'Blog',
        contact: 'Contact',
        login: 'Connexion',
        register: 'S\'inscrire',
        dashboard: 'Tableau de Bord',
        cart: 'Panier',
        profile: 'Mon Profil',
        logout: 'Déconnexion'
      },
      
      // Accessibility options
      accessibility: {
        title: 'Options d\'Accessibilité',
        highContrast: 'Contraste Élevé',
        grayscale: 'Niveaux de Gris',
        textSize: 'Taille du Texte',
        captions: 'Sous-titres',
        screenReader: 'Lecteur d\'Écran',
        voiceCommands: 'Commandes Vocales',
        keyboardNav: 'Navigation au Clavier',
        language: 'Langue',
        close: 'Fermer',
        open: 'Ouvrir les Options d\'Accessibilité',
        skipToContent: 'Passer au Contenu Principal',
        reset: 'Réinitialiser les Paramètres',
        increaseFontSize: 'Augmenter la Taille de Police',
        decreaseFontSize: 'Diminuer la Taille de Police',
        commandsAvailable: 'Commandes Vocales Disponibles',
        commandsIntro: 'Dites "aide" ou "que puis-je dire" pour la liste des commandes'
      },
      
      // Footer
      footer: {
        about: 'À Propos',
        contact: 'Contact',
        donate: 'Faire un Don',
        volunteer: 'Bénévolat',
        events: 'Événements',
        blog: 'Blog',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions d\'Utilisation',
        sitemap: 'Plan du Site',
        copyright: '© {{year}} HopeBridge. Tous droits réservés.',
        newsletter: 'Abonnez-vous à notre newsletter',
        emailPlaceholder: 'Entrez votre e-mail',
        subscribe: 'S\'abonner',
        followUs: 'Suivez-nous',
        address: 'Adresse',
        phone: 'Téléphone',
        email: 'E-mail'
      }
    }
  },
  de: {
    translation: {
      // Page title
      pageTitle: 'HopeBridge - Wir machen den Unterschied',
      
      // Navigation
      nav: {
        home: 'Startseite',
        about: 'Über Uns',
        donations: 'Spenden',
        events: 'Veranstaltungen',
        blog: 'Blog',
        contact: 'Kontakt',
        login: 'Anmelden',
        register: 'Registrieren',
        dashboard: 'Dashboard',
        cart: 'Warenkorb',
        profile: 'Mein Profil',
        logout: 'Abmelden'
      },
      
      // Accessibility options
      accessibility: {
        title: 'Barrierefreiheit-Optionen',
        highContrast: 'Hoher Kontrast',
        grayscale: 'Graustufen',
        textSize: 'Textgröße',
        captions: 'Untertitel',
        screenReader: 'Bildschirmleser',
        voiceCommands: 'Sprachbefehle',
        keyboardNav: 'Tastaturnavigation',
        language: 'Sprache',
        close: 'Schließen',
        open: 'Barrierefreiheit-Optionen öffnen',
        skipToContent: 'Zum Hauptinhalt springen',
        reset: 'Einstellungen zurücksetzen',
        increaseFontSize: 'Schriftgröße erhöhen',
        decreaseFontSize: 'Schriftgröße verringern',
        commandsAvailable: 'Verfügbare Sprachbefehle',
        commandsIntro: 'Sagen Sie "Hilfe" oder "Was kann ich sagen" für eine Liste der Befehle'
      },
      
      // Footer
      footer: {
        about: 'Über Uns',
        contact: 'Kontakt',
        donate: 'Spenden',
        volunteer: 'Ehrenamt',
        events: 'Veranstaltungen',
        blog: 'Blog',
        privacy: 'Datenschutzrichtlinie',
        terms: 'Nutzungsbedingungen',
        sitemap: 'Seitenübersicht',
        copyright: '© {{year}} HopeBridge. Alle Rechte vorbehalten.',
        newsletter: 'Abonnieren Sie unseren Newsletter',
        emailPlaceholder: 'E-Mail-Adresse eingeben',
        subscribe: 'Abonnieren',
        followUs: 'Folgen Sie uns',
        address: 'Adresse',
        phone: 'Telefon',
        email: 'E-Mail'
      }
    }
  }
};

// Initialize i18next
i18n
  .use(Backend) // Load translations from backend
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources,
    lng: 'en', // Make sure English is the default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Detect language from localStorage, browser, or navigator
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    
    // React options
    react: {
      useSuspense: true,
    }
  });

// Function to translate the entire page
export const translatePage = () => {
  // Translate all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (!key) return;
    
    // Basic text translation
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      const translated = i18n.t(key, { defaultValue: element.textContent });
      element.textContent = translated;
    }
    
    // Translate placeholder attributes
    if (element.hasAttribute('placeholder')) {
      const placeholderKey = `${key}_placeholder`;
      const defaultValue = element.getAttribute('placeholder');
      element.setAttribute('placeholder', i18n.t(placeholderKey, { defaultValue }));
    }
    
    // Translate aria-label attributes
    if (element.hasAttribute('aria-label')) {
      const ariaKey = `${key}_ariaLabel`;
      const defaultValue = element.getAttribute('aria-label');
      element.setAttribute('aria-label', i18n.t(ariaKey, { defaultValue }));
    }
    
    // Translate title attributes
    if (element.hasAttribute('title')) {
      const titleKey = `${key}_title`;
      const defaultValue = element.getAttribute('title');
      element.setAttribute('title', i18n.t(titleKey, { defaultValue }));
    }
  });
  
  // Also translate the page title
  document.title = i18n.t('pageTitle', { defaultValue: document.title });
};

export default i18n; 