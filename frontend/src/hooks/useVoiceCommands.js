import { useEffect, useCallback, useRef } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { 
  initVoiceCommands, 
  toggleVoiceRecognition, 
  addVoiceCommand, 
  removeVoiceCommand,
  getAvailableCommands 
} from '../utils/voiceCommandUtils';

/**
 * Custom hook for voice commands
 * @param {Object} customCommands - Custom voice commands for this component
 * @param {boolean} disableGlobalCommands - Whether to disable global commands
 * @returns {Object} Voice command methods and state
 */
const useVoiceCommands = (customCommands = {}, disableGlobalCommands = false) => {
  const { settings, updateSettings } = useAccessibility();
  const commandsRef = useRef(customCommands);
  const initializedRef = useRef(false);

  // Initialize voice commands when the component mounts
  useEffect(() => {
    // Only initialize if voice commands are enabled in accessibility settings
    if (settings.voiceCommands && !initializedRef.current) {
      const success = initVoiceCommands(
        { settings, updateSettings }, 
        commandsRef.current, 
        disableGlobalCommands
      );
      
      if (success) {
        initializedRef.current = true;
        // Start recognition
        toggleVoiceRecognition(true);
      }
    }
    
    return () => {
      // Clean up only if this component initialized voice commands
      if (initializedRef.current && disableGlobalCommands) {
        toggleVoiceRecognition(false);
        initializedRef.current = false;
      }
    };
  }, [settings.voiceCommands, updateSettings, disableGlobalCommands]);

  // Toggle voice commands with the accessibility setting
  useEffect(() => {
    if (initializedRef.current) {
      toggleVoiceRecognition(settings.voiceCommands);
    }
  }, [settings.voiceCommands]);

  // Update commands if they change
  useEffect(() => {
    commandsRef.current = customCommands;
    
    // Reinitialize if already initialized and commands changed
    if (initializedRef.current && settings.voiceCommands) {
      initVoiceCommands(
        { settings, updateSettings }, 
        commandsRef.current, 
        disableGlobalCommands
      );
    }
  }, [customCommands, settings, updateSettings, disableGlobalCommands]);

  // Method to add a new command
  const addCommand = useCallback((command, handler, aliases = []) => {
    return addVoiceCommand(command, handler, aliases);
  }, []);

  // Method to remove a command
  const removeCommand = useCallback((command) => {
    return removeVoiceCommand(command);
  }, []);

  // Method to enable voice commands
  const enableVoiceCommands = useCallback(() => {
    updateSettings({ voiceCommands: true });
  }, [updateSettings]);

  // Method to disable voice commands
  const disableVoiceCommands = useCallback(() => {
    updateSettings({ voiceCommands: false });
  }, [updateSettings]);

  // Method to toggle voice commands
  const toggleVoiceCommands = useCallback(() => {
    updateSettings({ voiceCommands: !settings.voiceCommands });
  }, [settings.voiceCommands, updateSettings]);

  // Method to get available commands
  const getCommands = useCallback(() => {
    return getAvailableCommands();
  }, []);

  return {
    isEnabled: settings.voiceCommands,
    addCommand,
    removeCommand,
    enableVoiceCommands,
    disableVoiceCommands,
    toggleVoiceCommands,
    getCommands,
  };
};

export default useVoiceCommands; 