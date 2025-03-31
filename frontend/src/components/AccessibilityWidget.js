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
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MicIcon from '@mui/icons-material/Mic';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { initVoiceCommands, toggleVoiceRecognition } from '../utils/voiceCommandUtils';
import { registerUIControlListener, UI_EVENTS } from '../utils/uiControlUtils';

// CSS styles to be applied to the body element
const globalStyles = {
  grayscale: {
    filter: 'grayscale(100%)',
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
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:focus': {
    outline: '3px solid #4285f4',
    outlineOffset: '2px',
  },
  '@media (max-width: 600px)': {
    bottom: '80px',
  },
}));

const AccessibilityWidget = () => {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings, toggleSetting, resetSettings } = useAccessibility();
  const { t } = useTranslation();
  const accessibilityContextRef = useRef({ settings, updateSettings, toggleSetting });

  // Update the ref when accessibility context changes
  useEffect(() => {
    accessibilityContextRef.current = { settings, updateSettings, toggleSetting };
  }, [settings, updateSettings, toggleSetting]);

  // Listen for toggle events from the header
  useEffect(() => {
    const handleToggleEvent = () => {
      setOpen(prev => !prev);
    };
    
    // Register the event listener
    const unregister = registerUIControlListener(UI_EVENTS.TOGGLE_ACCESSIBILITY, handleToggleEvent);
    
    // Clean up when component unmounts
    return unregister;
  }, []);

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

  // Update the useEffect for applying accessibility styles
  useEffect(() => {
    const bodyElement = document.body;
    const htmlElement = document.documentElement;
    
    // Reset all styles first
    bodyElement.style.filter = '';
    bodyElement.style.backgroundColor = '';
    bodyElement.style.color = '';
    htmlElement.style.filter = '';
    
    // Create a style element for the grayscale filter
    let styleElement = document.getElementById('accessibility-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'accessibility-styles';
      document.head.appendChild(styleElement);
    }
    
    // Apply grayscale if enabled
    if (settings.grayscale) {
      // Apply grayscale to everything except the accessibility widget and chatbot
      styleElement.textContent = `
        body > *:not(.MuiDrawer-root):not(.accessibility-widget):not(.chatbot-widget) {
          filter: grayscale(100%);
        }
      `;
    } else {
      styleElement.textContent = '';
    }
    
    // Apply text size
    if (settings.textSize !== 100) {
      htmlElement.style.fontSize = `${settings.textSize}%`;
    } else {
      htmlElement.style.fontSize = '';
    }
    
    return () => {
      // Cleanup
      if (styleElement) {
        styleElement.textContent = '';
      }
    };
  }, [settings]);

  // Update scroll behavior
  useEffect(() => {
    let lastScroll = window.scrollY;
    let scrollTimer = null;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const accessibilityButton = document.querySelector('.accessibility-widget');
      const chatbotButton = document.querySelector('.chatbot-widget');
      
      const buttons = [accessibilityButton, chatbotButton];
      
      buttons.forEach(button => {
        if (button) {
          // Instead of hiding the button completely, we'll adjust its position
          // This makes it follow the scroll and remain visible
          if (currentScroll > 100) {
            // Move button with scroll but keep it visible
            button.style.transform = `translateY(-${Math.min(currentScroll * 0.1, 50)}px)`;
            button.style.opacity = '0.85';
          } else {
            // Reset to original position when near top
            button.style.transform = 'translateY(0)';
            button.style.opacity = '1';
          }
        }
      });
      
      lastScroll = currentScroll;
    };
    
    const onScroll = () => {
      // Throttle scroll events for better performance
      if (scrollTimer === null) {
        scrollTimer = setTimeout(() => {
          handleScroll();
          scrollTimer = null;
        }, 10);
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  const handleTextSizeChange = (event, newValue) => {
    updateSettings({ textSize: newValue });
  };

  return (
    <>
      <Box 
        className="accessibility-widget"
        sx={{
          position: 'fixed',
          bottom: { xs: '80px', sm: '20px' },
          left: '20px',
          transition: 'all 0.3s ease',
          zIndex: 9999,
          // Hide the button since it's now in the header
          display: 'none',
        }}
      >
        <WidgetButton
          onClick={() => toggleDrawer(true)}
          aria-label={t('accessibility.openMenu')}
        >
          <AccessibilityNewIcon />
        </WidgetButton>
        
        <Drawer
          anchor="left"
          open={open}
          onClose={() => toggleDrawer(false)}
          className="accessibility-drawer"
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
            
            {settings.voiceCommands && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: 'rgba(66, 133, 244, 0.05)' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <MicIcon fontSize="small" sx={{ mr: 1 }} /> {t('voice.commands.available')}
                </Typography>
                <Typography variant="body2" component="div">
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>"go to home"</li>
                    <li>"increase text size"</li>
                    <li>"help" - for all commands</li>
                  </ul>
                </Typography>
              </Box>
            )}
          </Box>
        </Drawer>
      </Box>
    </>
  );
};

export default AccessibilityWidget; 