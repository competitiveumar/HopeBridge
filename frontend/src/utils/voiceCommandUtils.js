/**
 * Voice Command Utilities
 * This file contains utilities for implementing voice commands for accessibility
 */

// List of available commands and their mappings
const DEFAULT_COMMANDS = {
  // Navigation commands
  'go to home': () => navigateTo('/'),
  'go to homepage': () => navigateTo('/'),
  'go to about': () => navigateTo('/about'),
  'go to nonprofits': () => navigateTo('/nonprofits'),
  'go to companies': () => navigateTo('/companies'),
  'go to disasters': () => navigateTo('/disasters'),
  'go to donations': () => navigateTo('/donations'),
  'go to events': () => navigateTo('/events'),
  'go to blog': () => navigateTo('/blog'),
  'go to gift cards': () => navigateTo('/gift-cards'),
  'go to cart': () => navigateTo('/cart'),
  'go to checkout': () => navigateTo('/checkout'),
  'go to profile': () => navigateTo('/profile'),
  'go to settings': () => navigateTo('/settings'),
  'go to support': () => navigateTo('/support'),
  'go to contact': () => navigateTo('/contact'),
  'go to feedback': () => navigateTo('/feedback'),
  'go to login': () => navigateTo('/login'),
  'go to register': () => navigateTo('/register'),
  'go to dashboard': () => navigateTo('/dashboard'),
  'go back': () => window.history.back(),
  'go forward': () => window.history.forward(),
  
  // Accessibility commands
  'enable grayscale': () => toggleAccessibilitySetting('grayscale', true),
  'disable grayscale': () => toggleAccessibilitySetting('grayscale', false),
  'increase text size': () => adjustTextSize(10),
  'decrease text size': () => adjustTextSize(-10),
  'reset text size': () => setTextSize(100),
  'enable captions': () => toggleAccessibilitySetting('captions', true),
  'disable captions': () => toggleAccessibilitySetting('captions', false),
  
  // Page interaction commands
  'scroll down': () => window.scrollBy({ top: 300, behavior: 'smooth' }),
  'scroll up': () => window.scrollBy({ top: -300, behavior: 'smooth' }),
  'scroll to top': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  'scroll to bottom': () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
  'click button': () => clickFocusedElement(),
  'submit form': () => submitForm(),
  
  // Media commands
  'play video': () => controlMedia('play'),
  'pause video': () => controlMedia('pause'),
  'mute': () => controlMedia('mute'),
  'unmute': () => controlMedia('unmute'),
  
  // Help command
  'list commands': () => showCommandsList(),
  'help': () => showCommandsList(),
  'what can i say': () => showCommandsList()
};

// Map similar phrases to the same command
const DEFAULT_COMMAND_ALIASES = {
  'go home': 'go to home',
  'home page': 'go to homepage',
  'about page': 'go to about',
  'about us': 'go to about',
  'donation page': 'go to donations',
  'donate': 'go to donations',
  'event page': 'go to events',
  'blog page': 'go to blog',
  'gift card page': 'go to gift cards',
  'shopping cart': 'go to cart',
  'checkout page': 'go to checkout',
  'dashboard page': 'go to dashboard',
  'nonprofits page': 'go to nonprofits',
  'disasters page': 'go to disasters',
  'companies page': 'go to companies',
  'increase font': 'increase text size',
  'bigger text': 'increase text size',
  'decrease font': 'decrease text size',
  'smaller text': 'decrease text size',
  'normal text': 'reset text size',
  'show captions': 'enable captions',
  'hide captions': 'disable captions',
  'scroll bottom': 'scroll to bottom',
  'scroll top': 'scroll to top',
  'play': 'play video',
  'pause': 'pause video',
  'stop': 'pause video',
  'commands': 'list commands',
  'what commands': 'list commands'
};

// Active commands and aliases - can be updated with custom commands
let COMMANDS = { ...DEFAULT_COMMANDS };
let COMMAND_ALIASES = { ...DEFAULT_COMMAND_ALIASES };

// Reference to the recognition instance and state
let recognition = null;
let isListening = false;
let commandFeedbackElement = null;
let accessibilityContextRef = null;
let isInitialized = false;

/**
 * Initialize the voice command system
 * @param {Object} accessibilityContext - Reference to the accessibility context
 * @param {Object} customCommands - Custom commands to add
 * @param {boolean} disableGlobalCommands - Whether to disable global commands
 */
export const initVoiceCommands = (accessibilityContext, customCommands = {}, disableGlobalCommands = false) => {
  if (isInitialized) {
    return true;
  }

  accessibilityContextRef = accessibilityContext;
  
  // Reset commands if needed
  if (disableGlobalCommands) {
    COMMANDS = { ...customCommands };
    COMMAND_ALIASES = {};
  } else {
    COMMANDS = { ...DEFAULT_COMMANDS, ...customCommands };
    COMMAND_ALIASES = { ...DEFAULT_COMMAND_ALIASES };
  }
  
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    console.error('Speech recognition not supported in this browser');
    return false;
  }

  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = document.documentElement.lang || 'en-US';
    
    recognition.onresult = handleVoiceCommand;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;
    
    // Create feedback element for voice commands
    createCommandFeedbackElement();
    
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Error initializing speech recognition:', error);
    return false;
  }
};

/**
 * Clean up voice recognition
 */
export const cleanupVoiceRecognition = () => {
  if (recognition) {
    try {
      if (isListening) {
        recognition.stop();
      }
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition = null;
    } catch (error) {
      console.error('Error cleaning up voice recognition:', error);
    }
  }
  isListening = false;
  isInitialized = false;
};

/**
 * Start listening for voice commands
 */
export const startVoiceRecognition = () => {
  if (!recognition || !isInitialized) {
    const initialized = initVoiceCommands();
    if (!initialized) return false;
  }
  
  if (isListening) {
    console.log('Voice recognition is already active');
    return true;
  }
  
  try {
    recognition.start();
    isListening = true;
    updateCommandFeedback('Listening for voice commands...', 'listening');
    return true;
  } catch (error) {
    console.error('Error starting voice recognition:', error);
    isListening = false;
    return false;
  }
};

/**
 * Stop listening for voice commands
 */
export const stopVoiceRecognition = () => {
  if (!recognition || !isListening) {
    return false;
  }

  try {
    recognition.stop();
    isListening = false;
    updateCommandFeedback('Voice commands disabled', 'disabled');
    setTimeout(() => {
      if (commandFeedbackElement) {
        commandFeedbackElement.classList.add('hidden');
      }
    }, 3000);
    return true;
  } catch (error) {
    console.error('Error stopping voice recognition:', error);
    return false;
  }
};

/**
 * Toggle voice recognition on/off
 */
export const toggleVoiceRecognition = (enabled) => {
  if (enabled) {
    return startVoiceRecognition();
  } else {
    return stopVoiceRecognition();
  }
};

/**
 * Add a custom voice command
 * @param {string} command - The command phrase
 * @param {Function} handler - The function to execute
 * @param {Array<string>} aliases - Optional aliases for the command
 */
export const addVoiceCommand = (command, handler, aliases = []) => {
  if (typeof command !== 'string' || typeof handler !== 'function') {
    console.error('Invalid command or handler');
    return false;
  }
  
  // Add the command
  COMMANDS[command.toLowerCase()] = handler;
  
  // Add any aliases
  if (Array.isArray(aliases)) {
    aliases.forEach(alias => {
      if (typeof alias === 'string') {
        COMMAND_ALIASES[alias.toLowerCase()] = command.toLowerCase();
      }
    });
  }
  
  return true;
};

/**
 * Remove a voice command
 * @param {string} command - The command to remove
 */
export const removeVoiceCommand = (command) => {
  if (typeof command !== 'string') return false;
  
  const lowercaseCommand = command.toLowerCase();
  
  // Remove the command
  if (COMMANDS[lowercaseCommand]) {
    delete COMMANDS[lowercaseCommand];
  }
  
  // Remove any aliases that point to this command
  Object.keys(COMMAND_ALIASES).forEach(alias => {
    if (COMMAND_ALIASES[alias] === lowercaseCommand) {
      delete COMMAND_ALIASES[alias];
    }
  });
  
  return true;
};

/**
 * Handle voice command results
 * @param {SpeechRecognitionEvent} event - The speech recognition event
 */
const handleVoiceCommand = (event) => {
  const last = event.results.length - 1;
  const transcript = event.results[last][0].transcript.trim().toLowerCase();
  
  console.log('Voice command detected:', transcript);
  updateCommandFeedback(`Detected: "${transcript}"`, 'processing');
  
  // Check if the command is in our commands list or aliases
  let command = transcript;
  if (COMMAND_ALIASES[command]) {
    command = COMMAND_ALIASES[command];
  }
  
  // Execute the command if it exists
  if (COMMANDS[command]) {
    updateCommandFeedback(`Executing: "${command}"`, 'success');
    COMMANDS[command]();
  } else {
    // Try to find partial matches
    const matchedCommand = findPartialMatch(transcript);
    if (matchedCommand) {
      updateCommandFeedback(`Executing: "${matchedCommand}"`, 'success');
      COMMANDS[matchedCommand]();
    } else {
      updateCommandFeedback(`Unknown command: "${transcript}"`, 'error');
      speakFeedback(`I didn't recognize that command. Say "help" for a list of commands.`);
    }
  }
};

/**
 * Find partial matches in commands
 * @param {string} transcript - The voice transcript
 * @returns {string|null} - The matched command or null
 */
const findPartialMatch = (transcript) => {
  // Check if the transcript contains any command as a substring
  for (const command in COMMANDS) {
    if (transcript.includes(command)) {
      return command;
    }
  }
  
  // Check if any command contains the transcript as a substring
  for (const command in COMMANDS) {
    if (command.includes(transcript)) {
      return command;
    }
  }
  
  return null;
};

/**
 * Handle speech recognition errors
 * @param {SpeechRecognitionError} event - The error event
 */
const handleError = (event) => {
  console.log('Speech recognition error:', event.error);
  
  switch (event.error) {
    case 'network':
      updateCommandFeedback('Network error occurred. Please check your connection.', 'error');
      break;
    case 'not-allowed':
    case 'service-not-allowed':
      updateCommandFeedback('Microphone access denied. Please enable microphone access.', 'error');
      isListening = false;
      break;
    case 'aborted':
      // Don't show error for intentional stops
      if (accessibilityContextRef?.voiceCommandsEnabled) {
        updateCommandFeedback('Voice recognition was interrupted. Restarting...', 'warning');
        // Add a small delay before restarting
        setTimeout(() => {
          if (accessibilityContextRef?.voiceCommandsEnabled && !isListening) {
            startVoiceRecognition();
          }
        }, 1000);
      }
      break;
    case 'no-speech':
      // Don't show error for no speech detected
      break;
    default:
      updateCommandFeedback('An error occurred with voice recognition. Please try again.', 'error');
  }
};

/**
 * Handle speech recognition end
 */
const handleEnd = () => {
  // Only try to restart if we're supposed to be listening
  if (accessibilityContextRef?.voiceCommandsEnabled && isListening) {
    try {
      // Add a small delay before restarting to prevent rapid restarts
      setTimeout(() => {
        if (accessibilityContextRef?.voiceCommandsEnabled && !recognition.started) {
          recognition.start();
        }
      }, 300);
    } catch (error) {
      console.error('Error restarting voice recognition:', error);
      isListening = false;
      updateCommandFeedback('Voice recognition error. Please try again.', 'error');
    }
  } else {
    isListening = false;
  }
};

/**
 * Create a visual feedback element for voice commands
 */
const createCommandFeedbackElement = () => {
  if (commandFeedbackElement) return;
  
  // Create the feedback element
  commandFeedbackElement = document.createElement('div');
  commandFeedbackElement.className = 'voice-command-feedback hidden';
  commandFeedbackElement.setAttribute('aria-live', 'polite');
  
  // Style the element
  Object.assign(commandFeedbackElement.style, {
    position: 'fixed',
    bottom: '80px',
    left: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    zIndex: '9999',
    maxWidth: '300px',
    transition: 'opacity 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  });
  
  // Add microphone icon
  const micIcon = document.createElement('div');
  micIcon.className = 'mic-icon';
  micIcon.innerHTML = '🎤';
  micIcon.style.marginRight = '10px';
  commandFeedbackElement.appendChild(micIcon);
  
  // Add text container
  const textContainer = document.createElement('div');
  textContainer.className = 'feedback-text';
  commandFeedbackElement.appendChild(textContainer);
  
  // Add to body
  document.body.appendChild(commandFeedbackElement);
};

/**
 * Update the command feedback element
 * @param {string} message - The message to display
 * @param {string} status - The status (listening, processing, success, error, disabled)
 */
const updateCommandFeedback = (message, status) => {
  if (!commandFeedbackElement) {
    createCommandFeedbackElement();
  }
  
  const textElement = commandFeedbackElement.querySelector('.feedback-text');
  if (textElement) {
    textElement.textContent = message;
  }
  
  // Update status-specific styling
  commandFeedbackElement.className = 'voice-command-feedback';
  commandFeedbackElement.classList.add(status);
  
  // Color based on status
  let color;
  switch (status) {
    case 'listening':
      color = '#4caf50';
      break;
    case 'processing':
      color = '#2196f3';
      break;
    case 'success':
      color = '#8bc34a';
      break;
    case 'error':
      color = '#f44336';
      break;
    case 'disabled':
      color = '#9e9e9e';
      break;
    default:
      color = 'white';
  }
  
  commandFeedbackElement.style.borderLeft = `4px solid ${color}`;
  commandFeedbackElement.classList.remove('hidden');
  
  // Only hide when voice commands are disabled
  if (status === 'disabled') {
    // Note: Don't auto-hide here as stopVoiceRecognition handles this specifically
  } else if (status === 'error') {
    // For errors, show briefly then return to listening state
    setTimeout(() => {
      updateCommandFeedback('Listening for voice commands...', 'listening');
    }, 3000);
  } else if (status === 'success') {
    // For successful commands, briefly show success then return to listening state
    setTimeout(() => {
      updateCommandFeedback('Listening for voice commands...', 'listening');
    }, 2000);
  }
};

/**
 * Navigate to a URL
 * @param {string} url - The URL to navigate to
 */
const navigateTo = (url) => {
  window.location.href = url;
};

/**
 * Toggle an accessibility setting
 * @param {string} setting - The setting to toggle
 * @param {boolean} value - The value to set
 */
const toggleAccessibilitySetting = (setting, value) => {
  if (accessibilityContextRef && accessibilityContextRef.updateSettings) {
    accessibilityContextRef.updateSettings({ [setting]: value });
    speakFeedback(`${setting} ${value ? 'enabled' : 'disabled'}`);
  } else {
    // Fallback if context is not available
    document.dispatchEvent(new CustomEvent('accessibility-toggle', {
      detail: { setting, value }
    }));
  }
};

/**
 * Adjust text size
 * @param {number} delta - The amount to adjust by
 */
const adjustTextSize = (delta) => {
  if (accessibilityContextRef && accessibilityContextRef.settings) {
    const currentSize = accessibilityContextRef.settings.textSize || 100;
    const newSize = Math.max(80, Math.min(200, currentSize + delta));
    accessibilityContextRef.updateSettings({ textSize: newSize });
    speakFeedback(`Text size ${delta > 0 ? 'increased' : 'decreased'} to ${newSize} percent`);
  }
};

/**
 * Set text size to a specific value
 * @param {number} size - The text size to set
 */
const setTextSize = (size) => {
  if (accessibilityContextRef && accessibilityContextRef.updateSettings) {
    accessibilityContextRef.updateSettings({ textSize: size });
    speakFeedback(`Text size reset to ${size} percent`);
  }
};

/**
 * Click the currently focused element
 */
const clickFocusedElement = () => {
  const focusedElement = document.activeElement;
  if (focusedElement && focusedElement !== document.body) {
    focusedElement.click();
    speakFeedback('Clicked');
  } else {
    speakFeedback('No element focused');
  }
};

/**
 * Submit the current form
 */
const submitForm = () => {
  const focusedElement = document.activeElement;
  if (focusedElement) {
    const form = focusedElement.closest('form');
    if (form) {
      form.submit();
      speakFeedback('Form submitted');
    } else {
      speakFeedback('No form found');
    }
  }
};

/**
 * Control media playback
 * @param {string} action - The action to perform (play, pause, mute, unmute)
 */
const controlMedia = (action) => {
  const media = document.querySelector('video, audio');
  if (!media) {
    speakFeedback('No media found on this page');
    return;
  }
  
  switch (action) {
    case 'play':
      media.play();
      speakFeedback('Playing');
      break;
    case 'pause':
      media.pause();
      speakFeedback('Paused');
      break;
    case 'mute':
      media.muted = true;
      speakFeedback('Muted');
      break;
    case 'unmute':
      media.muted = false;
      speakFeedback('Unmuted');
      break;
    default:
      break;
  }
};

/**
 * Get available commands
 * @returns {Object} - The current command set
 */
export const getAvailableCommands = () => {
  return { ...COMMANDS };
};

/**
 * Show a list of available commands
 */
const showCommandsList = () => {
  // Create a modal to display commands
  const modal = document.createElement('div');
  modal.className = 'voice-commands-modal';
  
  Object.assign(modal.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    zIndex: '10000',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    width: '90%',
  });
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '✕';
  closeButton.setAttribute('aria-label', 'Close commands list');
  
  Object.assign(closeButton.style, {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
  });
  
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  });
  
  modal.appendChild(closeButton);
  
  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Available Voice Commands';
  title.style.marginTop = '0';
  modal.appendChild(title);
  
  // Organize commands by category
  const categorizedCommands = categorizeCommands(COMMANDS);
  
  // Create list of commands
  for (const category in categorizedCommands) {
    const section = document.createElement('div');
    
    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = category;
    categoryHeader.style.marginBottom = '5px';
    section.appendChild(categoryHeader);
    
    const commandsList = document.createElement('ul');
    
    for (const command of categorizedCommands[category]) {
      const item = document.createElement('li');
      item.textContent = command;
      item.style.margin = '5px 0';
      commandsList.appendChild(item);
    }
    
    section.appendChild(commandsList);
    modal.appendChild(section);
  }
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'voice-commands-overlay';
  
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '9999',
  });
  
  overlay.addEventListener('click', () => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  });
  
  // Add to body
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // Also speak a few common commands
  speakFeedback('Here are some commands you can use: go to home, increase text size, enable grayscale, scroll down, play video, and more.');
};

/**
 * Categorize commands for better display
 * @param {Object} commands - The commands to categorize
 * @returns {Object} - Categorized commands
 */
const categorizeCommands = (commands) => {
  const categories = {
    'Navigation': [],
    'Accessibility': [],
    'Page Interaction': [],
    'Media Controls': [],
    'Help': [],
    'Custom': [],
  };
  
  // Navigation commands
  const navigationPrefixes = ['go to', 'go back', 'go forward'];
  
  // Accessibility commands
  const accessibilityPrefixes = ['enable', 'disable', 'increase', 'decrease', 'reset'];
  
  // Page interaction commands
  const interactionPrefixes = ['scroll', 'click', 'submit'];
  
  // Media commands
  const mediaPrefixes = ['play', 'pause', 'mute', 'unmute'];
  
  // Help commands
  const helpCommands = ['list commands', 'help', 'what can i say'];
  
  // Categorize each command
  Object.keys(commands).forEach(command => {
    if (navigationPrefixes.some(prefix => command.startsWith(prefix))) {
      categories['Navigation'].push(command);
    } else if (accessibilityPrefixes.some(prefix => command.startsWith(prefix))) {
      categories['Accessibility'].push(command);
    } else if (interactionPrefixes.some(prefix => command.startsWith(prefix))) {
      categories['Page Interaction'].push(command);
    } else if (mediaPrefixes.some(prefix => command.startsWith(prefix))) {
      categories['Media Controls'].push(command);
    } else if (helpCommands.includes(command)) {
      categories['Help'].push(command);
    } else {
      categories['Custom'].push(command);
    }
  });
  
  // Remove empty categories
  Object.keys(categories).forEach(category => {
    if (categories[category].length === 0) {
      delete categories[category];
    }
  });
  
  return categories;
};

/**
 * Speak feedback using speech synthesis
 * @param {string} text - The text to speak
 */
const speakFeedback = (text) => {
  if (!window.speechSynthesis) return;
  
  // Cancel any current speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = 1;
  utterance.rate = 1;
  utterance.pitch = 1;
  
  // Set the language based on the current page language
  utterance.lang = document.documentElement.lang || 'en-US';
  
  window.speechSynthesis.speak(utterance);
}; 