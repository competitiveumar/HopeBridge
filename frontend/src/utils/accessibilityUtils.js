/**
 * Accessibility utility functions
 * These functions help with implementing various WCAG 2.1 AA+ compliance features
 */

/**
 * Adds missing alt text to all images on the page
 * @returns {number} The number of images that were updated
 */
export const addMissingAltText = () => {
  const images = document.querySelectorAll('img:not([alt])');
  let count = 0;
  
  images.forEach(img => {
    // Generate alt text based on image filename or context
    const src = img.src || '';
    const filename = src.split('/').pop().split('.')[0];
    img.alt = filename ? `Image: ${filename.replace(/[-_]/g, ' ')}` : 'Image';
    count++;
  });
  
  return count;
};

/**
 * Makes all form elements accessible by adding required aria attributes
 * @returns {number} The number of form elements that were updated
 */
export const enhanceFormAccessibility = () => {
  const forms = document.querySelectorAll('form');
  let count = 0;
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Skip if the input already has a label or aria-label
      if (input.labels?.length > 0 || input.hasAttribute('aria-label')) {
        return;
      }
      
      // Try to generate a label based on input name or placeholder
      const name = input.name || '';
      const placeholder = input.placeholder || '';
      const labelText = placeholder || name;
      
      if (labelText) {
        // Format the label text to be more readable
        const formattedLabel = labelText
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
          .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
        
        input.setAttribute('aria-label', formattedLabel);
        count++;
      }
    });
  });
  
  return count;
};

/**
 * Enhances keyboard navigation by making all interactive elements focusable
 * and adding keyboard event listeners
 */
export const enhanceKeyboardNavigation = () => {
  // Add focus styles to all interactive elements
  document.body.classList.add('keyboard-navigation');
  
  // Track whether the user is using keyboard or mouse
  let usingKeyboard = false;
  
  // Make sure all interactive elements are keyboard accessible 
  const interactiveElements = document.querySelectorAll('div[onClick], span[onClick]');
  
  interactiveElements.forEach(element => {
    if (!element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    
    if (!element.getAttribute('role')) {
      element.setAttribute('role', 'button');
    }
  });

  // Add keyboard event listeners
  window.addEventListener('keydown', (e) => {
    // Handle Tab key
    if (e.key === 'Tab') {
      usingKeyboard = true;
      document.body.classList.add('keyboard-navigation-active');
    }
    
    // Handle Enter/Space on focused elements
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement !== document.body) {
      const element = document.activeElement;
      if (element.getAttribute('role') === 'button' || element.tagName.toLowerCase() === 'button') {
        e.preventDefault();
        element.click();
      }
    }
  });

  // Remove keyboard navigation visual indicators when using mouse
  window.addEventListener('mousedown', () => {
    usingKeyboard = false;
    document.body.classList.remove('keyboard-navigation');
    document.body.classList.remove('keyboard-navigation-active');
  });
  
  // Add skip links for keyboard users
  const addSkipLink = () => {
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
      
      // Make sure the main content has an ID
      const mainContent = document.querySelector('main') || document.querySelector('.main-content');
      if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
      }
    }
  };
  
  // Add the skip link when the DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSkipLink);
  } else {
    addSkipLink();
  }
  
  // Announce focused elements for screen readers
  document.addEventListener('focusin', (e) => {
    if (usingKeyboard && e.target) {
      announceElement(e.target);
    }
  });
};

/**
 * Announce an element to screen readers
 * @param {HTMLElement} element - The element to announce
 */
export const announceElement = (element) => {
  let announcement = '';
  
  // Get the element's accessible name
  if (element.getAttribute('aria-label')) {
    announcement = element.getAttribute('aria-label');
  } else if (element.title) {
    announcement = element.title;
  } else if (element.alt) {
    announcement = element.alt;
  } else if (element.textContent) {
    announcement = element.textContent.trim().substring(0, 100);
  } else {
    // Use the element type as a last resort
    announcement = element.tagName.toLowerCase();
    if (element.type) {
      announcement += ` ${element.type}`;
    }
  }
  
  // Create a temporary announcement element
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'sr-only';
  announcer.textContent = announcement;
  
  // Add to the DOM
  document.body.appendChild(announcer);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};

/**
 * Ensures all media elements have captions and transcripts
 * @param {boolean} enableCaptions - Whether to enable captions
 */
export const enhanceMediaAccessibility = (enableCaptions = true) => {
  const videoElements = document.querySelectorAll('video');
  
  videoElements.forEach(video => {
    // Setup for each video element
    setupMediaAccessibility(video, enableCaptions);
  });
};

/**
 * Set up accessibility features for a specific media element
 * @param {HTMLElement} media - The media element (video or audio)
 * @param {boolean} captionsEnabled - Whether captions should be enabled
 */
const setupMediaAccessibility = (media, captionsEnabled) => {
  // Skip if this element was already enhanced
  if (media.dataset.accessibilityEnhanced === 'true') return;
  
  // Mark as enhanced to avoid duplicate processing
  media.dataset.accessibilityEnhanced = 'true';
  
  // Add accessible controls
  media.setAttribute('controls', 'true');
  
  // Make sure it has proper ARIA labels
  if (!media.getAttribute('aria-label')) {
    const label = media.nodeName === 'VIDEO' ? 'Video Player' : 'Audio Player';
    media.setAttribute('aria-label', label);
  }
  
  // Create a container for captions if it doesn't exist already
  let captionContainer = media.parentElement.querySelector('.caption-container');
  if (!captionContainer) {
    captionContainer = document.createElement('div');
    captionContainer.className = 'caption-container';
    captionContainer.setAttribute('aria-live', 'polite');
    captionContainer.style.display = captionsEnabled ? 'block' : 'none';
    
    // Insert after media element
    if (media.nextSibling) {
      media.parentNode.insertBefore(captionContainer, media.nextSibling);
    } else {
      media.parentNode.appendChild(captionContainer);
    }
  }
  
  // Setup speech recognition for live captions (for videos only)
  if (media.nodeName === 'VIDEO') {
    setupSpeechRecognition(media, captionContainer, captionsEnabled);
  }
  
  // Handle existing caption tracks
  const textTracks = media.textTracks;
  if (textTracks && textTracks.length > 0) {
    for (let i = 0; i < textTracks.length; i++) {
      // Enable/disable based on user preference
      textTracks[i].mode = captionsEnabled ? 'showing' : 'hidden';
    }
  }
  
  // Add custom caption toggle button
  let captionButton = media.parentElement.querySelector('.caption-toggle');
  if (!captionButton) {
    captionButton = document.createElement('button');
    captionButton.className = 'caption-toggle';
    captionButton.setAttribute('aria-label', captionsEnabled ? 'Disable captions' : 'Enable captions');
    captionButton.textContent = captionsEnabled ? 'CC' : 'cc';
    captionButton.style.opacity = captionsEnabled ? '1' : '0.5';
    
    captionButton.addEventListener('click', () => {
      const isEnabled = captionButton.textContent === 'CC';
      captionButton.textContent = isEnabled ? 'cc' : 'CC';
      captionButton.style.opacity = isEnabled ? '0.5' : '1';
      captionButton.setAttribute('aria-label', isEnabled ? 'Enable captions' : 'Disable captions');
      
      // Toggle caption display
      captionContainer.style.display = isEnabled ? 'none' : 'block';
      
      // Toggle native caption tracks
      for (let i = 0; i < textTracks.length; i++) {
        textTracks[i].mode = isEnabled ? 'hidden' : 'showing';
      }
      
      // Update speech recognition for live captions
      if (media.nodeName === 'VIDEO') {
        if (isEnabled) {
          stopSpeechRecognition(media);
        } else {
          startSpeechRecognition(media, captionContainer);
        }
      }
    });
    
    // Add the button near the media controls
    media.parentElement.insertBefore(captionButton, media.nextSibling);
  }
  
  // Add transcript button
  let transcriptButton = media.parentElement.querySelector('.transcript-button');
  if (!transcriptButton) {
    transcriptButton = document.createElement('button');
    transcriptButton.className = 'transcript-button';
    transcriptButton.setAttribute('aria-label', 'Show transcript');
    transcriptButton.textContent = 'Transcript';
    
    transcriptButton.addEventListener('click', () => {
      // Simple implementation - in a real app, this would fetch actual transcripts
      let transcriptContainer = media.parentElement.querySelector('.transcript-container');
      
      if (!transcriptContainer) {
        transcriptContainer = document.createElement('div');
        transcriptContainer.className = 'transcript-container';
        
        // Add a placeholder transcript
        const transcript = document.createElement('p');
        transcript.textContent = 'Transcript for this media will be displayed here. In a production environment, this would load the actual transcript content from a server or generate it using speech recognition.';
        transcriptContainer.appendChild(transcript);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close transcript';
        closeButton.addEventListener('click', () => {
          transcriptContainer.style.display = 'none';
        });
        transcriptContainer.appendChild(closeButton);
        
        media.parentElement.appendChild(transcriptContainer);
      } else {
        transcriptContainer.style.display = transcriptContainer.style.display === 'none' ? 'block' : 'none';
      }
    });
    
    // Add the button near the media controls
    media.parentElement.insertBefore(transcriptButton, captionButton.nextSibling);
  }
};

/**
 * Set up speech recognition for a video element
 * @param {HTMLVideoElement} video - The video element
 * @param {HTMLElement} captionContainer - Container for displaying captions
 * @param {boolean} captionsEnabled - Whether captions are initially enabled
 */
const setupSpeechRecognition = (video, captionContainer, captionsEnabled) => {
  // Skip if the browser doesn't support speech recognition
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    console.log('Speech recognition not supported in this browser');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // Store recognition instance on the video element
  if (!video._speechRecognition) {
    video._speechRecognition = new SpeechRecognition();
    video._speechRecognition.continuous = true;
    video._speechRecognition.interimResults = true;
    video._speechRecognition.lang = document.documentElement.lang || 'en-US';
    
    // Create elements for final and interim results
    const finalResults = document.createElement('div');
    finalResults.className = 'caption-final';
    captionContainer.appendChild(finalResults);
    
    const interimResults = document.createElement('div');
    interimResults.className = 'caption-interim';
    captionContainer.appendChild(interimResults);
    
    // Process results
    video._speechRecognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        // Create a new paragraph for each final result
        const finalPara = document.createElement('p');
        finalPara.textContent = finalTranscript;
        finalResults.appendChild(finalPara);
        
        // Keep only last 5 paragraphs to avoid clutter
        while (finalResults.children.length > 5) {
          finalResults.removeChild(finalResults.firstChild);
        }
        
        // Auto-scroll to bottom
        captionContainer.scrollTop = captionContainer.scrollHeight;
      }
      
      interimResults.textContent = interimTranscript;
    };
    
    // Handle errors
    video._speechRecognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // This is a common error, don't show it to users
        return;
      }
      
      const errorMessage = document.createElement('p');
      errorMessage.className = 'caption-error';
      errorMessage.textContent = `Speech recognition error: ${event.error}`;
      captionContainer.appendChild(errorMessage);
      
      // Remove error message after 5 seconds
      setTimeout(() => {
        if (errorMessage.parentNode) {
          errorMessage.parentNode.removeChild(errorMessage);
        }
      }, 5000);
    };
  }
  
  // Add event listeners for video playback
  video.addEventListener('play', () => {
    if (captionsEnabled) {
      startSpeechRecognition(video, captionContainer);
    }
  });
  
  video.addEventListener('pause', () => {
    stopSpeechRecognition(video);
  });
  
  video.addEventListener('ended', () => {
    stopSpeechRecognition(video);
  });
  
  // Start recognition if video is already playing and captions are enabled
  if (!video.paused && captionsEnabled) {
    startSpeechRecognition(video, captionContainer);
  }
};

/**
 * Start speech recognition for a video
 * @param {HTMLVideoElement} video - The video element
 * @param {HTMLElement} captionContainer - Container for captions
 */
const startSpeechRecognition = (video, captionContainer) => {
  if (video._speechRecognition && !video._recognitionActive) {
    try {
      video._speechRecognition.start();
      video._recognitionActive = true;
      
      // Show an indicator that live captions are active
      const statusIndicator = document.createElement('div');
      statusIndicator.className = 'caption-status';
      statusIndicator.textContent = '🎤 Live captions active';
      captionContainer.appendChild(statusIndicator);
      
      // Remove after 3 seconds
      setTimeout(() => {
        if (statusIndicator.parentNode) {
          statusIndicator.parentNode.removeChild(statusIndicator);
        }
      }, 3000);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }
};

/**
 * Stop speech recognition for a video
 * @param {HTMLVideoElement} video - The video element
 */
const stopSpeechRecognition = (video) => {
  if (video._speechRecognition && video._recognitionActive) {
    try {
      video._speechRecognition.stop();
      video._recognitionActive = false;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }
};

/**
 * Improves contrast ratios for text elements
 * @param {boolean} highContrast - Whether to enable high contrast mode
 */
export const improveTextContrast = (highContrast = true) => {
  if (!highContrast) return;
  
  // Add high contrast styles to all text elements
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
  
  textElements.forEach(el => {
    // Save original styles for later restoration
    if (!el.dataset.originalColor) {
      el.dataset.originalColor = getComputedStyle(el).color;
      el.dataset.originalBg = getComputedStyle(el).backgroundColor;
    }
    
    // Apply high contrast styles
    el.style.color = '#ffffff';
    
    // Only set background if the element has a background
    if (getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)') {
      el.style.backgroundColor = '#000000';
    }
  });
};

/**
 * Restores original text contrast
 */
export const restoreTextContrast = () => {
  const elements = document.querySelectorAll('[data-original-color]');
  
  elements.forEach(el => {
    el.style.color = el.dataset.originalColor || '';
    el.style.backgroundColor = el.dataset.originalBg || '';
  });
};

/**
 * Creates a skip link for keyboard navigation
 */
export const createSkipLink = () => {
  // Check if a skip link already exists
  if (document.querySelector('.skip-link')) return;
  
  // Create the skip link
  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link';
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  
  // Add the skip link to the beginning of the document
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Make sure the main content has an id
  const mainContent = document.querySelector('main') || document.querySelector('.main-content');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
  }
};

/**
 * Adjusts the page text size
 * @param {number} size - Percentage value for text size (100 = normal)
 */
export const adjustTextSize = (size) => {
  document.documentElement.style.fontSize = `${size}%`;
};

/**
 * Toggles high contrast mode
 * @param {boolean} enabled - Whether high contrast is enabled
 */
export const toggleHighContrast = (enabled) => {
  if (enabled) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
};

/**
 * Toggles grayscale mode
 * @param {boolean} enabled - Whether grayscale is enabled
 */
export const toggleGrayscale = (enabled) => {
  if (enabled) {
    document.body.classList.add('grayscale');
  } else {
    document.body.classList.remove('grayscale');
  }
};

/**
 * Generate alt text for images that don't have it
 * Uses basic description based on filename as a fallback
 */
export const generateImageAltText = () => {
  const images = document.querySelectorAll('img:not([alt]), img[alt=""]');
  
  images.forEach(img => {
    // Extract a description from the filename or path
    let altText = 'Image';
    if (img.src) {
      const filename = img.src.split('/').pop().split('?')[0];
      const nameWithoutExtension = filename.split('.')[0];
      
      // Convert camelCase or snake_case to spaces
      altText = nameWithoutExtension
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .trim();
      
      // Capitalize first letter
      altText = altText.charAt(0).toUpperCase() + altText.slice(1);
    }
    
    // Set the alt attribute
    img.setAttribute('alt', altText);
    
    // Add an indicator that this alt text was auto-generated
    img.dataset.autoAlt = 'true';
  });
}; 