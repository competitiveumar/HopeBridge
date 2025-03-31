import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for saved auth token and user data
    const token = localStorage.getItem('authToken');
    const currentUserKey = localStorage.getItem('currentUserKey');
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    
    if (token) {
      try {
        // If we have a specific user data key, use that
        if (currentUserKey && localStorage.getItem(currentUserKey)) {
          console.log('Loading user-specific data from:', currentUserKey);
          setUser(JSON.parse(localStorage.getItem(currentUserKey)));
          
          // Ensure the generic userData matches this user as well
          localStorage.setItem('userData', localStorage.getItem(currentUserKey));
          
          setLoading(false);
        } 
        // Fall back to generic userData for backward compatibility
        else if (localStorage.getItem('userData')) {
          console.log('Loading generic user data');
          const userData = JSON.parse(localStorage.getItem('userData'));
          
          // If the userData has an email, create a user-specific key for future use
          if (userData.email) {
            const userIdentifier = btoa(userData.email).replace(/=/g, '');
            const userDataKey = `userData_${userIdentifier}`;
            localStorage.setItem('currentUserKey', userDataKey);
            localStorage.setItem('currentUserEmail', userData.email);
            localStorage.setItem(userDataKey, JSON.stringify(userData));
          }
          
          setUser(userData);
          setLoading(false);
        } 
        // If no stored data, try to validate token
        else {
          validateToken(token);
        }
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        // Clear potentially corrupted data
        localStorage.removeItem('userData');
        validateToken(token);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      console.log('Validating token:', token);
      // Here you would typically make an API call to validate the token
      
      // Try to find user data for this session
      const currentUserKey = localStorage.getItem('currentUserKey');
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      
      // Check if this account has been deleted
      if (currentUserEmail) {
        const userIdentifier = btoa(currentUserEmail).replace(/=/g, '');
        const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts') || '[]');
        
        if (deletedAccounts.includes(userIdentifier)) {
          console.log('This account has been deleted');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('currentUserKey');
          localStorage.removeItem('currentUserEmail');
          setUser(null);
          setError('This account has been deleted');
          return;
        }
      }
      
      if (currentUserKey && localStorage.getItem(currentUserKey)) {
        console.log('Found user data via token validation');
        const userData = JSON.parse(localStorage.getItem(currentUserKey));
        setUser(userData);
        
        // Ensure the generic userData matches this user as well
        localStorage.setItem('userData', JSON.stringify(userData));
      } else if (localStorage.getItem('userData')) {
        // Fall back to generic userData
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        // If the userData has an email, create a user-specific key for future use
        if (userData.email) {
          const userIdentifier = btoa(userData.email).replace(/=/g, '');
          
          // Check if this account has been deleted
          const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts') || '[]');
          if (deletedAccounts.includes(userIdentifier)) {
            console.log('This account has been deleted');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUser(null);
            setError('This account has been deleted');
            return;
          }
          
          const userDataKey = `userData_${userIdentifier}`;
          localStorage.setItem('currentUserKey', userDataKey);
          localStorage.setItem('currentUserEmail', userData.email);
          localStorage.setItem(userDataKey, JSON.stringify(userData));
        }
        
        setUser(userData);
      } else {
        console.log('No user data found during token validation');
        // Token exists but no user data, clear the token
        localStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (err) {
      console.error('Auth token validation failed:', err);
      setError(err.message);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate a unique user identifier based on email
      const userIdentifier = btoa(email).replace(/=/g, '');
      const userDataKey = `userData_${userIdentifier}`;
      
      // Check if this account has been deleted
      const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts') || '[]');
      if (deletedAccounts.includes(userIdentifier)) {
        throw new Error('This account has been deleted. Please register for a new account.');
      }
      
      // Check if we have existing data for this user
      const existingUserData = localStorage.getItem(userDataKey);
      let userData;
      
      if (existingUserData) {
        // Found existing user data, parse it
        console.log('Found existing user data for returning user');
        userData = JSON.parse(existingUserData);
        
        // Verify password if we have a stored password
        if (userData.password && userData.password !== password) {
          throw new Error('Incorrect password');
        }
        
        // If no password is set yet, set it now
        if (!userData.password) {
          userData.password = password;
          localStorage.setItem(userDataKey, JSON.stringify(userData));
        }
      } else {
        // User doesn't exist - reject login attempt
        throw new Error('User not found. Please register for an account.');
      }
      
      // Simulate API response
      const response = { 
        token: 'auth-token-' + userIdentifier, 
        user: userData
      };
      
      // Clear any previous user data from localStorage first
      // This ensures we don't load the wrong user's data
      localStorage.removeItem('userData');
      localStorage.removeItem('lastUserEmail');
      localStorage.removeItem('lastUserKey');
      localStorage.removeItem('currentUserKey');
      localStorage.removeItem('currentUserEmail');
      
      // Store the token and current user email
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('currentUserKey', userDataKey);
      
      // Store/update user data under the user-specific key
      localStorage.setItem(userDataKey, JSON.stringify(userData));
      
      // For backward compatibility, also set the generic userData key
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Remove password from the user object before setting in state
      const userWithoutPassword = { ...userData };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      
      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear all user authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('currentUserKey');
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('lastUserKey');
      localStorage.removeItem('lastUserEmail');
      
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, userType = 'donor') => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate a unique user identifier based on email
      const userIdentifier = btoa(email).replace(/=/g, '');
      const userDataKey = `userData_${userIdentifier}`;
      
      // Check if this account has been deleted previously
      const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts') || '[]');
      if (deletedAccounts.includes(userIdentifier)) {
        // Remove from deleted accounts to allow re-registration
        const updatedDeletedAccounts = deletedAccounts.filter(id => id !== userIdentifier);
        localStorage.setItem('deletedAccounts', JSON.stringify(updatedDeletedAccounts));
        console.log('Re-registering previously deleted account');
      }
      
      // Parse name into first/last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Create user data with password
      const userData = {
        id: userIdentifier,
        first_name: firstName,
        last_name: lastName,
        email,
        location: '',
        password,
        user_type: userType
      };
      
      // Simulate API response
      const response = { 
        token: 'auth-token-' + userIdentifier, 
        user: userData
      };
      
      // Store the token and user identification
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('currentUserKey', userDataKey);
      
      // Store user data under the user-specific key
      localStorage.setItem(userDataKey, JSON.stringify(userData));
      
      // For backward compatibility
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Clear any previous user data references
      localStorage.removeItem('lastUserEmail');
      localStorage.removeItem('lastUserKey');
      
      // Remove password from user object before setting in state
      const userWithoutPassword = { ...userData };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      
      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // Here you would typically make an API call to reset password
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update user data in state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Get the current user key
      const currentUserKey = localStorage.getItem('currentUserKey');
      
      // Persist the updated user data to proper localStorage key
      if (currentUserKey) {
        console.log('Saving profile update to user-specific storage:', currentUserKey);
        localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));
      }
      
      // Also update the generic userData for backward compatibility
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 