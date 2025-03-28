import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState({
    access: localStorage.getItem('accessToken'),
    refresh: localStorage.getItem('refreshToken')
  });

  // Set up axios interceptors for automatic token refresh
  useEffect(() => {
    const setupAxiosInterceptors = () => {
      // Request interceptor to add the auth token
      axios.interceptors.request.use(
        (config) => {
          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor to refresh token on 401 errors
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          // If error is 401 and we haven't tried to refresh the token yet
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              if (!refreshToken) {
                throw new Error('No refresh token available');
              }
              
              // Try to refresh the token
              const response = await axios.post('/api/users/token/refresh/', {
                refresh: refreshToken
              });
              
              const { access } = response.data;
              
              // Update tokens in localStorage
              localStorage.setItem('accessToken', access);
              
              // Update tokens in state
              setTokens(prev => ({
                ...prev,
                access
              }));
              
              // Retry the original request with the new token
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return axios(originalRequest);
            } catch (refreshError) {
              // If refresh fails, log the user out
              logout();
              return Promise.reject(refreshError);
            }
          }
          
          return Promise.reject(error);
        }
      );
    };
    
    setupAxiosInterceptors();
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (accessToken) {
          try {
            // Check if token is expired
            const decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp < currentTime) {
              // Token is expired, try to refresh
              if (refreshToken) {
                try {
                  const response = await api.post('/users/token/refresh/', {
                    refresh: refreshToken
                  });
                  
                  const { access } = response.data;
                  
                  // Update tokens in localStorage
                  localStorage.setItem('accessToken', access);
                  
                  // Update tokens in state
                  setTokens(prev => ({
                    ...prev,
                    access
                  }));
                  
                  // Fetch user data with new token
                  const userResponse = await api.get('/users/me/');
                  setCurrentUser(userResponse.data);
                } catch (refreshError) {
                  // If refresh fails, clear tokens
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  setTokens({ access: null, refresh: null });
                  setCurrentUser(null);
                }
              }
            } else {
              // Token is valid, fetch user data
              const response = await api.get('/users/me/');
              setCurrentUser(response.data);
            }
          } catch (tokenError) {
            console.error('Token validation error:', tokenError);
            // Invalid token format, clear it
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setTokens({ access: null, refresh: null });
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/users/login/', { email, password });
      const { access, refresh, user } = response.data;
      
      // Store tokens in localStorage for persistence
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Update tokens in state
      setTokens({ access, refresh });
      
      // Set current user
      setCurrentUser(user);
      return user;
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.non_field_errors) {
          errorMessage = err.response.data.non_field_errors[0];
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      console.log('Attempting to register with data:', userData);
      const response = await api.post('/users/register/', userData);
      const { access, refresh, user } = response.data;
      
      // Store tokens in localStorage for persistence
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Update tokens in state
      setTokens({ access, refresh });
      
      // Set current user
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Registration error details:', err.response?.data || err.message);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.non_field_errors) {
          errorMessage = err.response.data.non_field_errors[0];
        } else {
          // Try to get the first error message from the response
          const firstErrorKey = Object.keys(err.response.data)[0];
          if (firstErrorKey && err.response.data[firstErrorKey][0]) {
            errorMessage = `${firstErrorKey}: ${err.response.data[firstErrorKey][0]}`;
          }
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      if (tokens.refresh) {
        await api.post('/users/logout/', { refresh: tokens.refresh });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Clear tokens from state
      setTokens({ access: null, refresh: null });
      
      // Clear current user
      setCurrentUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.patch('/users/me/', userData);
      setCurrentUser(prev => ({ ...prev, ...response.data }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Profile update failed.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 