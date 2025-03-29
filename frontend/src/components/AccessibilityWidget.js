import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  Drawer, 
  Typography, 
  Switch, 
  Slider, 
  FormControlLabel, 
  Divider, 
  Button,
  Menu, 
  MenuItem,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import TranslateIcon from '@mui/icons-material/Translate';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MicIcon from '@mui/icons-material/Mic';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { initVoiceCommands, toggleVoiceRecognition } from '../utils/voiceCommandUtils';
import { initGoogleTranslate, toggleGoogleTranslate, isGoogleTranslateReady, cleanupGoogleTranslate } from '../utils/googleTranslateUtils';

// CSS styles to be applied to the body element
const globalStyles = {
  grayscale: {
    filter: 'grayscale(100%)',
  },
  highContrast: {
    filter: 'contrast(150%)',
    backgroundColor: '#000',
    color: '#fff',
  },
  largeText: {
    fontSize: '120%',
  },
};

const WidgetButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  left: '20px',
  zIndex: 9999,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:focus': {
    outline: '3px solid #4285f4',
    outlineOffset: '2px',
  },
}));

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const AccessibilityWidget = () => {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings, toggleSetting, resetSettings } = useAccessibility();
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const { t } = useTranslation();
  const accessibilityContextRef = useRef({ settings, updateSettings, toggleSetting });

  // Update the ref when accessibility context changes
  useEffect(() => {
    accessibilityContextRef.current = { settings, updateSettings, toggleSetting };
  }, [settings, updateSettings, toggleSetting]);

  // Initialize voice commands when component mounts
  useEffect(() => {
    initVoiceCommands(accessibilityContextRef.current);

    // Expose i18n to window for voice commands
    window.i18n = i18n;

    // Load voice command preference from localStorage
    const savedVoiceCommandSetting = localStorage.getItem('voiceCommands');
    if (savedVoiceCommandSetting) {
      const isEnabled = savedVoiceCommandSetting === 'true';
      if (isEnabled !== settings.voiceCommands) {
        updateSettings({ voiceCommands: isEnabled });
      }
    }

    return () => {
      // Clean up
      toggleVoiceRecognition(false);
    };
  }, []);

  // Toggle voice recognition when the voiceCommands setting changes
  useEffect(() => {
    toggleVoiceRecognition(settings.voiceCommands);
    
    // Save voice command setting to localStorage for persistence
    localStorage.setItem('voiceCommands', settings.voiceCommands);
  }, [settings.voiceCommands]);

  // Add HTML lang attribute based on selected language
  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  // Apply accessibility styles to the body element
  useEffect(() => {
    const bodyElement = document.body;
    
    // Reset all styles first
    bodyElement.style.filter = '';
    bodyElement.style.backgroundColor = '';
    bodyElement.style.color = '';
    bodyElement.style.fontSize = '';
    
    // Apply grayscale if enabled
    if (settings.grayscale) {
      bodyElement.style.filter = 'grayscale(100%)';
    }
    
    // Apply high contrast if enabled (overrides grayscale)
    if (settings.highContrast) {
      bodyElement.style.filter = 'contrast(150%)';
      bodyElement.style.backgroundColor = '#000';
      bodyElement.style.color = '#fff';
      
      // Add high contrast to all buttons, links, and inputs
      const elements = document.querySelectorAll('button, a, input, select');
      elements.forEach(el => {
        el.style.borderColor = '#fff';
        el.style.color = '#fff';
      });
    }
    
    // Apply text size
    if (settings.textSize !== 100) {
      document.documentElement.style.fontSize = `${settings.textSize}%`;
    } else {
      document.documentElement.style.fontSize = '';
    }
    
    // Apply keyboard navigation
    if (settings.keyboardNav) {
      document.addEventListener('keydown', handleKeyboardNavigation);
    } else {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    }
    
    // Enable screen reader support
    if (settings.screenReader) {
      document.body.setAttribute('aria-live', 'polite');
      // Add more specific screen reader attributes to important elements
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        heading.setAttribute('aria-label', heading.textContent);
      });
    } else {
      document.body.removeAttribute('aria-live');
    }
    
    // Clean up event listeners when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [settings]);

  // Handle keyboard navigation
  const handleKeyboardNavigation = (e) => {
    // Tab key enhancements
    if (e.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        // Add visible focus indicators
        document.body.classList.add('keyboard-navigation');
      }
    }
  };
  
  // Handle voice commands (placeholder - would require additional libraries to fully implement)
  useEffect(() => {
    if (settings.voiceCommands) {
      // This is a placeholder for voice command initialization
      // In a real implementation, you would integrate with a speech recognition API
      console.log('Voice commands enabled');
    }
    
    return () => {
      if (settings.voiceCommands) {
        // Clean up voice command listeners
        console.log('Voice commands disabled');
      }
    };
  }, [settings.voiceCommands]);

  // Add alt text to images that don't have them
  useEffect(() => {
    if (open) {
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach(img => {
        // Generate alt text based on image filename or context
        const src = img.src || '';
        const filename = src.split('/').pop().split('.')[0];
        img.alt = filename ? `Image: ${filename.replace(/[-_]/g, ' ')}` : 'Image';
      });
    }
  }, [open]);

  // Add skip link for keyboard navigation
  useEffect(() => {
    if (settings.keyboardNav) {
      // Add skip link if it doesn't exist
      if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = '#main-content';
        skipLink.textContent = t('accessibility.skipLink');
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add ID to main content if it doesn't exist
        const mainContent = document.querySelector('main') || document.querySelector('.main-content');
        if (mainContent && !mainContent.id) {
          mainContent.id = 'main-content';
        }
      }
    }
  }, [settings.keyboardNav, t]);

  // Add CSS class to body for voice command styles
  useEffect(() => {
    if (settings.voiceCommands) {
      document.body.classList.add('voice-commands-enabled');
    } else {
      document.body.classList.remove('voice-commands-enabled');
    }
  }, [settings.voiceCommands]);

  // Initialize Google Translate API when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only load Google Translate script once
      if (!document.getElementById('google-translate-api')) {
        initGoogleTranslate();
      }
      
      // Listen for Google Translate ready event
      const handleGoogleTranslateReady = () => {
        console.log('Google Translate API is ready');
        // Clean up any existing translations when API is ready
        cleanupGoogleTranslate();
      };
      
      document.addEventListener('google-translate-ready', handleGoogleTranslateReady);
      
      return () => {
        document.removeEventListener('google-translate-ready', handleGoogleTranslateReady);
        // Clean up Google Translate when component unmounts
        cleanupGoogleTranslate();
      };
    }
  }, []);

  // Toggle Google Translate when googleTranslate setting changes
  useEffect(() => {
    if (settings.googleTranslate) {
      // Only attempt to toggle if the API is ready
      if (isGoogleTranslateReady()) {
        toggleGoogleTranslate(true);
      } else {
        // If trying to activate but API isn't ready, set up a listener
        const checkReady = () => {
          if (isGoogleTranslateReady()) {
            toggleGoogleTranslate(true);
            document.removeEventListener('google-translate-ready', checkReady);
          }
        };
        document.addEventListener('google-translate-ready', checkReady);
      }
    } else {
      // When turned off, clean up translations
      cleanupGoogleTranslate();
    }
  }, [settings.googleTranslate]);

  // Add this useEffect to monitor translation changes
  useEffect(() => {
    // Listen for custom translation-changed event
    const handleTranslationChanged = (event) => {
      // Make sure Google Translate toggle stays on
      if (!settings.googleTranslate) {
        updateSettings({ googleTranslate: true });
      }
    };
    
    document.addEventListener('translation-changed', handleTranslationChanged);
    
    return () => {
      document.removeEventListener('translation-changed', handleTranslationChanged);
    };
  }, [settings.googleTranslate, updateSettings]);

  // Also update the watch for Google Translation URL changes
  useEffect(() => {
    // Watch for Google Translate DOM changes that indicate translation is active
    const observer = new MutationObserver((mutations) => {
      // Check if translation elements have been added to the page
      const hasTranslation = document.querySelector('.goog-te-banner-frame') || 
                           document.querySelector('.VIpgJd-ZVi9od-aZ1Okd') ||
                           document.querySelector('.goog-te-menu-value');
      
      if (hasTranslation && !settings.googleTranslate) {
        // Translation is active but our toggle is off - update it
        updateSettings({ googleTranslate: true });
      }
    });
    
    // Start observing body for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => {
      observer.disconnect();
    };
  }, [settings.googleTranslate, updateSettings]);
  
  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  const handleTextSizeChange = (event, newValue) => {
    updateSettings({ textSize: newValue });
  };

  const handleLanguageMenuOpen = (event) => {
    setLangMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLangMenuAnchor(null);
  };

  const selectLanguage = (code) => {
    updateSettings({ language: code });
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    handleLanguageMenuClose();
  };

  return (
    <>
      <Tooltip title={t('accessibility.title')} arrow>
        <WidgetButton
          aria-label={t('accessibility.title')}
          onClick={() => toggleDrawer(true)}
          size="large"
          className="accessibility-widget-button"
        >
          <AccessibilityNewIcon />
        </WidgetButton>
      </Tooltip>
      
      <Drawer
        anchor="left"
        open={open}
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 300,
            p: 2,
          },
          'aria-label': t('accessibility.title'),
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            {t('accessibility.title')}
          </Typography>
          <Button onClick={resetSettings} color="primary" size="small">
            {t('accessibility.reset')}
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.grayscale}
                onChange={() => toggleSetting('grayscale')}
                color="primary"
                inputProps={{ 'aria-label': t('accessibility.grayscale') }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ColorLensIcon />
                <Typography>{t('accessibility.grayscale')}</Typography>
              </Box>
            }
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.highContrast}
                onChange={() => toggleSetting('highContrast')}
                color="primary"
                inputProps={{ 'aria-label': t('accessibility.highContrast') }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InvertColorsIcon />
                <Typography>{t('accessibility.highContrast')}</Typography>
              </Box>
            }
          />
          
          <Box sx={{ px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FormatSizeIcon />
              <Typography>{t('accessibility.textSize')}</Typography>
            </Box>
            <Slider
              value={settings.textSize}
              onChange={handleTextSizeChange}
              aria-labelledby="text-size-slider"
              min={80}
              max={200}
              step={10}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
            />
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.screenReader}
                onChange={() => toggleSetting('screenReader')}
                color="primary"
                inputProps={{ 'aria-label': t('accessibility.screenReader') }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessibilityNewIcon />
                <Typography>{t('accessibility.screenReader')}</Typography>
              </Box>
            }
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.captions}
                onChange={() => toggleSetting('captions')}
                color="primary"
                inputProps={{ 'aria-label': t('accessibility.captions') }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ClosedCaptionIcon />
                <Typography>{t('accessibility.captions')}</Typography>
              </Box>
            }
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.keyboardNav}
                onChange={() => toggleSetting('keyboardNav')}
                color="primary"
                inputProps={{ 'aria-label': t('accessibility.keyboardNav') }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <KeyboardIcon />
                <Typography>{t('accessibility.keyboardNav')}</Typography>
              </Box>
            }
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.voiceCommands}
                onChange={() => toggleSetting('voiceCommands')}
                color="primary"
                inputProps={{ 'aria-label': t('accessibility.voiceCommands') }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MicIcon color={settings.voiceCommands ? "primary" : "inherit"} />
                <Typography>{t('accessibility.voiceCommands')}</Typography>
              </Box>
            }
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.googleTranslate}
                onChange={() => toggleSetting('googleTranslate')}
                color="primary"
                inputProps={{ 'aria-label': 'Google Translate' }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GTranslateIcon color={settings.googleTranslate ? "primary" : "inherit"} />
                <Typography>Google Translate</Typography>
              </Box>
            }
          />
          
          {/* Google Translate Element Container */}
          <Box 
            id="google-translate-element" 
            sx={{ 
              display: settings.googleTranslate ? 'block' : 'none',
              my: 1,
              '& .goog-te-gadget': {
                color: 'text.primary',
                fontFamily: 'inherit',
                width: '100%',
              },
              '& select': {
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                backgroundColor: '#fff',
                color: '#000',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.87)',
                },
                '&:focus': {
                  borderColor: '#2196f3',
                  outline: 'none',
                  boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.2)',
                },
              },
            }} 
          />
          
          {!settings.googleTranslate && (
            <Box sx={{ mt: 1 }}>
              <Button
                startIcon={<TranslateIcon />}
                onClick={handleLanguageMenuOpen}
                fullWidth
                variant="outlined"
                color="primary"
                aria-haspopup="true"
                aria-expanded={Boolean(langMenuAnchor)}
                id="language-selector-button"
              >
                {t('accessibility.language')}: {languages.find(l => l.code === settings.language)?.name || 'English'}
              </Button>
              <Menu
                anchorEl={langMenuAnchor}
                open={Boolean(langMenuAnchor)}
                onClose={handleLanguageMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'language-selector-button',
                }}
              >
                {languages.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    selected={settings.language === lang.code}
                  >
                    {lang.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          
          {settings.voiceCommands && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: 'rgba(66, 133, 244, 0.05)' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <MicIcon fontSize="small" sx={{ mr: 1 }} /> {t('voice.commands.available')}
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>"go to home"</li>
                  <li>"enable high contrast"</li>
                  <li>"increase text size"</li>
                  <li>"switch to spanish"</li>
                  <li>"help" - for all commands</li>
                </ul>
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default AccessibilityWidget; 