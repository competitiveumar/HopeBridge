/**
 * UI Control Utilities
 * 
 * This file contains functions to manage UI components that need to be 
 * controlled from other components, like triggering the accessibility widget
 * or chatbot from the header.
 */

// Custom events for widget control
const EVENTS = {
  TOGGLE_ACCESSIBILITY: 'toggle-accessibility-widget',
  TOGGLE_CHATBOT: 'toggle-chatbot'
};

/**
 * Opens or closes the accessibility widget
 */
export const toggleAccessibilityWidget = () => {
  // Dispatch a custom event that the AccessibilityWidget component will listen for
  const event = new CustomEvent(EVENTS.TOGGLE_ACCESSIBILITY);
  document.dispatchEvent(event);
};

/**
 * Opens or closes the chatbot
 */
export const toggleChatbot = () => {
  // Dispatch a custom event that the ChatBot component will listen for
  const event = new CustomEvent(EVENTS.TOGGLE_CHATBOT);
  document.dispatchEvent(event);
};

/**
 * Helper function to register event listeners
 * @param {string} eventName - The name of the event to listen for
 * @param {Function} callback - The function to call when the event is fired
 * @returns {Function} - A function to remove the event listener
 */
export const registerUIControlListener = (eventName, callback) => {
  document.addEventListener(eventName, callback);
  return () => document.removeEventListener(eventName, callback);
};

/**
 * Constants for event names
 */
export const UI_EVENTS = EVENTS; 