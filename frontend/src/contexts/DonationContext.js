import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { donationService } from '../services/api';

const DonationContext = createContext();

export const useDonation = () => useContext(DonationContext);

export const DonationProvider = ({ children }) => {
  // State to track the current user key and email
  const [currentUserKey, setCurrentUserKey] = useState(localStorage.getItem('currentUserKey'));
  const [currentUserEmail, setCurrentUserEmail] = useState(localStorage.getItem('currentUserEmail'));
  
  // Initialize state from localStorage with strict user isolation
  const [successfulDonations, setSuccessfulDonations] = useState(() => {
    try {
      // Get the current user details to load user-specific donations
      const userKey = localStorage.getItem('currentUserKey');
      const userEmail = localStorage.getItem('currentUserEmail');
      
      if (!userKey || !userEmail) {
        console.log('No user logged in, not loading any donations');
        return [];
      }
      
      // Load user-specific donations with strict filtering
      const userData = JSON.parse(localStorage.getItem(userKey) || '{}');
      
      if (!userData.successfulDonations || !Array.isArray(userData.successfulDonations)) {
        console.log('No donations found for user:', userEmail);
        return [];
      }
      
      // Filter to only include donations explicitly tagged with this user's email
      const userDonations = userData.successfulDonations.filter(donation => {
        return donation.userEmail === userEmail;
      });
      
      console.log(`Loaded ${userDonations.length} donations for user:`, userEmail);
      return userDonations;
    } catch (error) {
      console.error('Error loading donations from localStorage:', error);
      return [];
    }
  });
  
  const [projectUpdates, setProjectUpdates] = useState(() => {
    try {
      // Get the current user key to load user-specific project updates
      const currentUserKey = localStorage.getItem('currentUserKey');
      if (currentUserKey) {
        const userData = JSON.parse(localStorage.getItem(currentUserKey) || '{}');
        return userData.projectUpdates || {};
      }
      // Fall back to generic storage if no user is logged in
      const savedUpdates = localStorage.getItem('projectUpdates');
      return savedUpdates ? JSON.parse(savedUpdates) : {};
    } catch (error) {
      console.error('Error loading project updates from localStorage:', error);
      return {};
    }
  });
  
  // Save donations to localStorage whenever they change
  useEffect(() => {
    try {
      // Save to user-specific storage only
      const currentUserKey = localStorage.getItem('currentUserKey');
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      
      if (!currentUserKey || !currentUserEmail) {
        console.log('No user logged in, not saving donations');
        return;
      }
      
      console.log(`Saving ${successfulDonations.length} donations for user:`, currentUserEmail);
      
      const userData = JSON.parse(localStorage.getItem(currentUserKey) || '{}');
      userData.successfulDonations = successfulDonations;
      localStorage.setItem(currentUserKey, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving donations to localStorage:', error);
    }
  }, [successfulDonations]);
  
  // Save project updates to localStorage whenever they change
  useEffect(() => {
    try {
      // Save to user-specific storage
      const currentUserKey = localStorage.getItem('currentUserKey');
      if (currentUserKey) {
        const userData = JSON.parse(localStorage.getItem(currentUserKey) || '{}');
        userData.projectUpdates = projectUpdates;
        localStorage.setItem(currentUserKey, JSON.stringify(userData));
      } else {
        // Only save to generic storage if no user is logged in
        localStorage.setItem('projectUpdates', JSON.stringify(projectUpdates));
      }
    } catch (error) {
      console.error('Error saving project updates to localStorage:', error);
    }
  }, [projectUpdates]);
  
  // Monitor changes to user identity
  useEffect(() => {
    const checkUserIdentity = () => {
      const newUserKey = localStorage.getItem('currentUserKey');
      const newUserEmail = localStorage.getItem('currentUserEmail');
      
      // Detect any change in user identity
      if (newUserKey !== currentUserKey || newUserEmail !== currentUserEmail) {
        console.log('User identity changed from', currentUserEmail, 'to', newUserEmail);
        
        // Completely reset donations state
        setSuccessfulDonations([]);
        
        // Update tracked user identity
        setCurrentUserKey(newUserKey);
        setCurrentUserEmail(newUserEmail);
        
        // Only load donations for the new user if they're logged in
        if (newUserKey && newUserEmail) {
          try {
            const userData = JSON.parse(localStorage.getItem(newUserKey) || '{}');
            
            if (!userData.successfulDonations || !Array.isArray(userData.successfulDonations)) {
              console.log('No donations found for new user:', newUserEmail);
              return;
            }
            
            // Filter to only include donations explicitly tagged with this user's email
            const userDonations = userData.successfulDonations.filter(donation => {
              return donation.userEmail === newUserEmail;
            });
            
            console.log(`Loaded ${userDonations.length} donations for new user:`, newUserEmail);
            setSuccessfulDonations(userDonations);
          } catch (error) {
            console.error('Error loading donations for new user:', error);
          }
        }
      }
    };
    
    // Check initially
    checkUserIdentity();
    
    // Set up interval to check frequently
    const interval = setInterval(checkUserIdentity, 500);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [currentUserKey, currentUserEmail]);
  
  // One-time migration to fix legacy donation data
  useEffect(() => {
    const migrateData = () => {
      try {
        console.log('Running donation data migration check...');
        
        // Only run migration if a user is logged in
        const currentUserKey = localStorage.getItem('currentUserKey');
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        
        if (!currentUserKey || !currentUserEmail) {
          console.log('No user logged in, skipping migration');
          return;
        }
        
        // Check if we've already run migration for this user
        const migrationFlag = `donation_migration_${btoa(currentUserEmail).replace(/=/g, '')}`;
        if (localStorage.getItem(migrationFlag) === 'completed') {
          console.log('Migration already completed for user:', currentUserEmail);
          return;
        }
        
        console.log('Starting migration for user:', currentUserEmail);
        
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem(currentUserKey) || '{}');
        
        // Skip if no donations
        if (!userData.successfulDonations || !Array.isArray(userData.successfulDonations)) {
          console.log('No donations to migrate');
          localStorage.setItem(migrationFlag, 'completed');
          return;
        }
        
        // Find any donations that don't have userEmail
        const needsMigration = userData.successfulDonations.some(
          donation => !donation.userEmail
        );
        
        if (!needsMigration) {
          console.log('All donations already have userEmail, marking migration complete');
          localStorage.setItem(migrationFlag, 'completed');
          return;
        }
        
        // Fix donations by adding userEmail
        const migratedDonations = userData.successfulDonations.map(donation => {
          if (!donation.userEmail) {
            console.log('Adding userEmail to donation:', donation);
            return {
              ...donation,
              userEmail: currentUserEmail,
              migratedAt: new Date().toISOString()
            };
          }
          return donation;
        });
        
        // Save back to localStorage
        userData.successfulDonations = migratedDonations;
        localStorage.setItem(currentUserKey, JSON.stringify(userData));
        
        // Update state with migrated donations
        setSuccessfulDonations(migratedDonations.filter(
          donation => donation.userEmail === currentUserEmail
        ));
        
        // Mark migration as completed
        localStorage.setItem(migrationFlag, 'completed');
        console.log('Migration completed successfully');
      } catch (error) {
        console.error('Error during donation migration:', error);
      }
    };
    
    // Run migration once on mount
    migrateData();
  }, []);
  
  // Add donation with strict user email tagging
  const addSuccessfulDonation = useCallback((donationInfo) => {
    // Get the current user email to tag this donation with
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    
    if (!currentUserEmail) {
      console.error('Cannot add donation: No user is logged in');
      return;
    }
    
    // Only add if not a duplicate
    setSuccessfulDonations(prev => {
      // Check if this donation is already in the list
      const isDuplicate = prev.some(
        d => d.paymentId === donationInfo.paymentId && d.projectId === donationInfo.projectId
      );
      
      if (isDuplicate) {
        console.log('Duplicate donation detected, not adding again');
        return prev;
      }
      
      // If the donation has a projectId, update project total
      if (donationInfo.projectId) {
        updateProjectTotal(donationInfo.projectId, donationInfo.amount);
        
        // Only attempt to record the donation if not in mock/development mode
        if (shouldMakeApiCalls()) {
          recordDonation(donationInfo);
        }
      }
      
      // Add strong user tagging to the donation
      const enhancedDonation = {
        ...donationInfo,
        userEmail: currentUserEmail,
        userId: localStorage.getItem('currentUserId') || undefined,
        timestamp: donationInfo.timestamp || new Date().toISOString(),
        addedAt: new Date().toISOString()
      };
      
      console.log('Adding new donation for user:', currentUserEmail, enhancedDonation);
      
      return [...prev, enhancedDonation];
    });
  }, []);
  
  // Helper function to determine if we should make API calls
  // This prevents unnecessary API calls in development if endpoints don't exist
  const shouldMakeApiCalls = () => {
    // Skip API calls for certain hostnames or in development mode
    const skipApiCalls = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      process.env.NODE_ENV === 'development';
    
    return !skipApiCalls;
  };
  
  // Record donation in the backend
  const recordDonation = useCallback(async (donationInfo) => {
    try {
      await donationService.recordDonation({
        projectId: donationInfo.projectId,
        amount: donationInfo.amount,
        paymentId: donationInfo.paymentId,
        timestamp: donationInfo.timestamp || new Date().toISOString()
      });
      console.log('Donation recorded successfully in backend');
    } catch (error) {
      console.error('Error recording donation in backend:', error);
      // We don't want to block the UI or fail if this doesn't work
      // The donation is still saved locally
    }
  }, []);
  
  // Update a specific project's donation total
  const updateProjectTotal = useCallback((projectId, amount) => {
    if (!projectId || isNaN(parseFloat(amount))) return;
    
    // Update local state
    setProjectUpdates(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || 0) + parseFloat(amount)
    }));
    
    // Only attempt to update server if not in mock/development mode
    if (shouldMakeApiCalls()) {
      // Update server-side project total
      try {
        donationService.updateProjectTotal(projectId, parseFloat(amount))
          .then(() => {
            console.log(`Project ${projectId} total updated on server with amount ${amount}`);
          })
          .catch(error => {
            console.error('Error updating project total on server:', error);
            // Even if server update fails, we keep the local update
          });
      } catch (error) {
        console.error('Error calling donation service:', error);
      }
    } else {
      console.log(`[DEV MODE] Skipping API call to update project ${projectId} with amount ${amount}`);
    }
  }, []);
  
  // Clear successful donations (e.g., after navigating away from success page)
  // Note: This now only clears the in-memory state, not the persisted localStorage
  const clearSuccessfulDonations = useCallback(() => {
    setSuccessfulDonations([]);
    // Clear localStorage as well
    localStorage.removeItem('successfulDonations');
  }, []);
  
  // Get updated project total (combines original amount with any updates)
  const getUpdatedProjectTotal = useCallback((projectId, originalTotal) => {
    if (!projectId) return originalTotal || 0;
    const update = projectUpdates[projectId] || 0;
    return (originalTotal || 0) + update;
  }, [projectUpdates]);
  
  // EMERGENCY FIX: One-time cleanup of any global donation storage
  useEffect(() => {
    // Only run once and immediately
    const cleanupGlobalDonations = () => {
      try {
        // Check if we've already run this cleanup
        if (localStorage.getItem('global_donation_cleanup') === 'completed') {
          return;
        }
        
        console.log('EMERGENCY FIX: Cleaning up any global donation data');
        
        // Remove global donation storage that might be causing cross-user data issues
        localStorage.removeItem('successfulDonations');
        localStorage.removeItem('projectUpdates');
        
        // Mark as completed
        localStorage.setItem('global_donation_cleanup', 'completed');
      } catch (error) {
        console.error('Error during emergency donation cleanup:', error);
      }
    };
    
    // Run immediately
    cleanupGlobalDonations();
  }, []);
  
  const value = {
    successfulDonations,
    addSuccessfulDonation,
    clearSuccessfulDonations,
    getUpdatedProjectTotal
  };
  
  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};

export default DonationContext; 