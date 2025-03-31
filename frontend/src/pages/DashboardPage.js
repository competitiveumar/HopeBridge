import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  TextField,
  Link,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Avatar,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { useDonation } from '../contexts/DonationContext';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { PhotoCamera, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CurrencyConversionWidget from '../components/CurrencyConversionWidget';

// Default avatar as a Data URI (a simple gray avatar with user silhouette)
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjY2NjYyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgOCAyLjY3IDggNiAwIDMuMzMtNS4zMyA2LTggNnMtOC0yLjY3LTgtNmMwLTMuMzMgNS4zMy02IDgtNnptMCAxMmMtMi44NSAwLTUuMjktLjk2LTctMy40NC43Mi0uOTcgMi42OS0yLjA2IDUtMi4zNGwxIDEgMSAxaDJsMS0xIDEtMWMyLjMxLjI3IDQuMjggMS4zNyA1IDIuMzQtMS43MSAyLjQ4LTQuMTUgMy40NC03IDMuNDR6Ii8+PC9zdmc+';

// Styled components for custom styling
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'uppercase',
  fontWeight: 500,
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.text.primary,
  },
}));

const ProfileBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const ProfileImage = styled(Box)(({ theme }) => ({
  width: 150,
  height: 150,
  borderRadius: theme.spacing(0.5),
  overflow: 'hidden',
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    marginBottom: 0,
  },
}));

const EditInfoButton = styled(Button)(({ theme }) => ({
  textTransform: 'uppercase',
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  fontWeight: 500,
  fontSize: '0.75rem',
  border: '1px solid #ccc',
  color: theme.palette.text.secondary,
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ProjectButton = styled(Button)(({ theme }) => ({
  textTransform: 'uppercase',
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1.5, 2),
  fontWeight: 500,
  fontSize: '0.875rem',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ContentCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'uppercase',
  borderRadius: theme.spacing(0.5),
  fontWeight: 500,
  fontSize: '0.875rem',
  marginTop: theme.spacing(2),
}));

// Create a custom password field component with refs instead of controlled state
const PasswordInputField = ({ label, name, error, ...props }) => {
  const inputRef = useRef(null);
  return (
    <TextField
      inputRef={inputRef}
      fullWidth
      type="password"
      label={label}
      name={name}
      variant="outlined"
      size="small"
      error={!!error}
      {...props}
    />
  );
};

const DashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location: '',
    avatar: null,
    emailPreferences: {
      marketing: true,
      newsletters: true,
      projectUpdates: true,
      donationReceipts: true,
    },
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailPreferencesDialogOpen, setEmailPreferencesDialogOpen] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState({
    marketing: true,
    newsletters: true,
    projectUpdates: true,
    donationReceipts: true,
  });
  const [emailUpdateSuccess, setEmailUpdateSuccess] = useState(false);
  const [userDonations, setUserDonations] = useState([]);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  
  const { user, logout, updateProfile } = useAuth();
  const { successfulDonations } = useDonation();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Refs for password fields
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Calculate user's full name for display
  const fullName = userData && [userData.first_name, userData.last_name].filter(Boolean).join(' ') || 'User';

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        let data;

        // First try to get user data from AuthContext
        if (user) {
          console.log('Using user data from AuthContext:', user);
          
          data = {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            location: user.location || 'location unknown',
            avatar: user.avatar || null,
            emailPreferences: user.emailPreferences || {
              marketing: true,
              newsletters: true,
              projectUpdates: true,
              donationReceipts: true,
            },
          };
        } 
        // If no user in AuthContext, try user-specific localStorage data
        else {
          const currentUserKey = localStorage.getItem('currentUserKey');
          const authToken = localStorage.getItem('authToken');
          
          // Check if auth token exists and is valid
          if (!authToken) {
            console.log('No auth token found, redirecting to login');
            navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
            return;
          }
          
          if (currentUserKey && localStorage.getItem(currentUserKey)) {
            console.log('Using user-specific data from localStorage:', currentUserKey);
            const parsedData = JSON.parse(localStorage.getItem(currentUserKey));
            
            data = {
              first_name: parsedData.first_name || '',
              last_name: parsedData.last_name || '',
              email: parsedData.email || '',
              location: parsedData.location || 'location unknown',
              avatar: parsedData.avatar || null,
              emailPreferences: parsedData.emailPreferences || {
                marketing: true,
                newsletters: true,
                projectUpdates: true,
                donationReceipts: true,
              },
            };
          }
          // Try generic userData as fallback (but only for profile data, not donations)
          else if (localStorage.getItem('userData')) {
            console.log('Using generic user data from localStorage');
            const parsedData = JSON.parse(localStorage.getItem('userData'));
            
            data = {
              first_name: parsedData.first_name || '',
              last_name: parsedData.last_name || '',
              email: parsedData.email || '',
              location: parsedData.location || 'location unknown',
              avatar: parsedData.avatar || null,
              emailPreferences: parsedData.emailPreferences || {
                marketing: true,
                newsletters: true,
                projectUpdates: true,
                donationReceipts: true,
              },
              // Never load donations from generic storage
            };
          }
          else {
            // If we have no data and no auth token, redirect to login
            if (!localStorage.getItem('authToken')) {
              console.log('No auth token found, redirecting to login');
              navigate('/login', { state: { message: 'Please log in to access your dashboard' } });
              return;
            }
            
            // Try API call if all local storage options fail
            console.log('No local user data, trying API');
            try {
              // Check if token is about to expire or has expired
              const tokenExpiry = localStorage.getItem('tokenExpiry');
              if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
                // Token has expired, redirect to login
                localStorage.removeItem('authToken');
                navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
                return;
              }
              
              const response = await api.get('/users/me/');
              const apiData = response.data;
              
              data = {
                first_name: apiData.first_name || '',
                last_name: apiData.last_name || '',
                email: apiData.email || '',
                location: apiData.location || 'location unknown',
                avatar: apiData.avatar || null,
                emailPreferences: apiData.emailPreferences || {
                  marketing: true,
                  newsletters: true,
                  projectUpdates: true,
                  donationReceipts: true,
                },
              };
              
              // Get the current user key
              const currentUserKey = localStorage.getItem('currentUserKey');
              
              // Save API data to user-specific localStorage if available
              if (currentUserKey) {
                localStorage.setItem(currentUserKey, JSON.stringify(data));
              }
              
              // Also save to generic userData for backward compatibility
              localStorage.setItem('userData', JSON.stringify(data));
            } catch (apiError) {
              console.error('API fetch failed:', apiError);
              
              // Check if the error is 401 Unauthorized
              if (apiError.response && apiError.response.status === 401) {
                // Clear invalid auth token
                localStorage.removeItem('authToken');
                // Redirect to login
                navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
                return;
              }
              
              // If API fails but we have auth token, create a basic profile
              if (localStorage.getItem('authToken')) {
                // Create a basic profile from whatever we can find
                const email = localStorage.getItem('currentUserEmail') || 'user@example.com';
                const firstName = email.split('@')[0] || 'User';
                
                data = {
                  first_name: firstName,
                  last_name: '',
                  email: email,
                  location: 'location unknown',
                  avatar: null,
                  emailPreferences: {
                    marketing: true,
                    newsletters: true,
                    projectUpdates: true,
                    donationReceipts: true,
                  },
                };
                
                // Get the current user key
                const currentUserKey = localStorage.getItem('currentUserKey');
                
                // Save this basic profile to user-specific localStorage if available
                if (currentUserKey) {
                  localStorage.setItem(currentUserKey, JSON.stringify(data));
                }
                
                // Also save to generic userData
                localStorage.setItem('userData', JSON.stringify(data));
              } else {
                // If no auth token and API failed, redirect to login
                navigate('/login', { state: { message: 'Please log in to access your dashboard' } });
                return;
              }
            }
          }
        }
        
        if (!data) {
          console.error('Failed to get any user data');
          navigate('/login', { state: { message: 'Unable to load your profile. Please log in again.' } });
          return;
        }
        
        console.log('Setting user data:', data);
        setUserData(data);
        setEditFormData(data);
        // Initialize email preferences from user data
        setEmailPreferences(data.emailPreferences || {
          marketing: true,
          newsletters: true,
          projectUpdates: true,
          donationReceipts: true,
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Redirect to login if everything fails
        navigate('/login', { state: { message: 'An error occurred. Please log in again.' } });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  // Update userDonations when successfulDonations changes
  useEffect(() => {
    // Process and enrich donations data from DonationContext
    if (!user || !user.email) {
      console.log('No user logged in, clearing donation display');
      setUserDonations([]);
      return;
    }
    
    // Get current user identity information for filtering
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const currentUserKey = localStorage.getItem('currentUserKey');
    
    if (!currentUserEmail || !currentUserKey) {
      console.log('Missing user identifiers, not showing donations');
      setUserDonations([]);
      return;
    }
    
    if (currentUserEmail !== user.email) {
      console.log('User email mismatch, clearing donations', currentUserEmail, 'vs', user.email);
      setUserDonations([]);
      return;
    }
    
    console.log('Current user donations processing for:', currentUserEmail);
    console.log('Raw donations from context:', successfulDonations);
    
    // ALWAYS double-check user-specific data
    if (!Array.isArray(successfulDonations)) {
      console.error('Invalid donation data format, clearing donations');
      setUserDonations([]);
      return;
    }
    
    // Verify each donation belongs EXACTLY to the current user with multiple checks
    const verifiedDonations = successfulDonations.filter(donation => {
      // Skip if donation is missing crucial data
      if (!donation || typeof donation !== 'object') {
        console.log('Skipping invalid donation:', donation);
        return false;
      }
      
      // Primary check: userEmail must match exactly
      if (donation.userEmail !== currentUserEmail) {
        console.log('Donation userEmail mismatch:', donation.userEmail, 'vs', currentUserEmail);
        return false;
      }
      
      // Log each donation that passes filtering
      console.log('Verified donation belongs to current user:', donation);
      return true;
    });
    
    console.log(`After filtering: ${verifiedDonations.length} of ${successfulDonations.length} donations belong to current user`);
    
    if (verifiedDonations.length === 0) {
      setUserDonations([]);
      return;
    }
    
    // Map the donations to the format expected by the UI
    const formattedDonations = verifiedDonations.map((donation, index) => {
      // Extract project data directly from the donation if available
      const isFullProjectName = donation.name && 
        (donation.name.includes('Initiative') || 
         donation.name.includes('Education') || 
         donation.name.includes('Relief') || 
         donation.name.includes('Program') || 
         donation.name.includes('Project'));
      
      const projectName = isFullProjectName 
        ? donation.name 
        : getProjectName(donation.projectId);
        
      const projectImage = donation.image || getProjectImageByID(donation.projectId);
      
      // Create a formatted donation object
      return {
        id: donation.paymentId || `donation-${index}`,
        amount: donation.amount || 0,
        currency: donation.currency || 'USD',
        project: {
          id: donation.projectId || `p-${index}`,
          name: projectName,
          image: projectImage
        },
        date: donation.timestamp || new Date().toISOString(),
        status: 'completed',
        receiptData: { // Store full receipt data for dialog
          id: donation.paymentId || `donation-${index}`,
          projectName: projectName,
          amount: donation.amount || 0,
          currency: donation.currency || 'USD',
          date: donation.timestamp || new Date().toISOString(),
          donor: fullName || 'Anonymous',
          email: userData.email || '',
          paymentMethod: 'Credit/Debit Card'
        }
      };
    });
    
    // Sort donations by date (most recent first)
    const sortedDonations = formattedDonations.sort((a, b) => {
      try {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Most recent first
      } catch (error) {
        console.error('Error sorting donations by date:', error);
        return 0;
      }
    });
    
    console.log('Final user donations set:', sortedDonations);
    setUserDonations(sortedDonations);
  }, [successfulDonations, userData.email, fullName, user]);

  // Handle receipt dialog
  const handleOpenReceipt = (receiptData) => {
    setSelectedReceipt(receiptData);
    setReceiptDialogOpen(true);
  };

  const handleCloseReceipt = () => {
    setReceiptDialogOpen(false);
  };

  // Load favorite projects from localStorage
  useEffect(() => {
    try {
      if (!user || !user.email) {
        setFavoriteProjects([]);
        return;
      }
      
      const currentUserKey = localStorage.getItem('currentUserKey');
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      
      // Only load favorites if the current user email matches
      if (currentUserEmail !== user.email) {
        console.log('User email mismatch, not loading favorites');
        setFavoriteProjects([]);
        return;
      }
      
      let favorites = [];
      
      if (currentUserKey) {
        // Try to get favorites from user-specific storage
        const userSpecificData = JSON.parse(localStorage.getItem(currentUserKey) || '{}');
        favorites = userSpecificData.favoriteProjects || [];
        console.log('Loaded favorite projects from user-specific storage:', favorites);
      } else {
        // For backward compatibility, try to get from generic storage only if email matches
        const genericUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (genericUserData.email === user.email) {
          favorites = genericUserData.favoriteProjects || [];
          console.log('Loaded favorite projects from generic storage:', favorites);
          
          // Save to user-specific storage if available
          if (currentUserKey) {
            const userSpecificData = JSON.parse(localStorage.getItem(currentUserKey) || '{}');
            userSpecificData.favoriteProjects = favorites;
            localStorage.setItem(currentUserKey, JSON.stringify(userSpecificData));
          }
        }
      }
      
      setFavoriteProjects(favorites);
    } catch (err) {
      console.error('Failed to load favorite projects:', err);
      setFavoriteProjects([]);
    }
  }, [user]);

  // Toggle favorite status for a project
  const toggleFavorite = (project) => {
    if (!user) {
      alert('Please log in to save favorite projects.');
      return;
    }
    
    if (!project || !project.id) {
      console.error('Invalid project data:', project);
      return;
    }
    
    try {
      const projectId = project.id;
      const isAlreadyFavorite = favoriteProjects.some(p => p.id === projectId);
      
      let updatedFavorites;
      
      if (isAlreadyFavorite) {
        // Remove from favorites
        updatedFavorites = favoriteProjects.filter(p => p.id !== projectId);
      } else {
        // Add to favorites - ensure we have all required project data
        const projectToAdd = {
          id: projectId,
          name: project.name || getProjectName(projectId),
          image: project.image || getProjectImageByID(projectId)
        };
        updatedFavorites = [...favoriteProjects, projectToAdd];
      }
      
      // Update state
      setFavoriteProjects(updatedFavorites);
      
      // Save to user-specific localStorage only
      const currentUserKey = localStorage.getItem('currentUserKey');
      if (currentUserKey) {
        // Update user-specific data
        const userData = JSON.parse(localStorage.getItem(currentUserKey) || '{}');
        userData.favoriteProjects = updatedFavorites;
        localStorage.setItem(currentUserKey, JSON.stringify(userData));
        
        // Update the generic userData to match (only needed for backward compatibility)
        const genericUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (genericUserData.email === user.email) {
          genericUserData.favoriteProjects = updatedFavorites;
          localStorage.setItem('userData', JSON.stringify(genericUserData));
        }
      }
      
      console.log('Updated favorites:', updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  // Check if a project is in favorites
  const isFavorite = (projectId) => {
    return favoriteProjects.some(project => String(project.id) === String(projectId));
  };

  // Handle edit dialog open
  const handleEditDialogOpen = () => {
    setEditFormData(userData);
    setAvatarPreview(userData.avatar);
    setEditDialogOpen(true);
  };

  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setEditFormData(prev => ({
          ...prev,
          avatarFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Create FormData for file upload (for API if available)
      const formData = new FormData();
      formData.append('first_name', editFormData.first_name);
      formData.append('last_name', editFormData.last_name);
      formData.append('email', editFormData.email);
      formData.append('location', editFormData.location);
      
      if (editFormData.avatarFile) {
        formData.append('avatar', editFormData.avatarFile);
      }

      // Log the formData for debugging
      console.log('Submitting form data:', {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        location: editFormData.location,
        hasAvatar: !!editFormData.avatarFile
      });

      // Create the updated user data
      let updatedUserData = {
        ...userData,
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        location: editFormData.location,
      };

      // Handle avatar file if present
      if (editFormData.avatarFile) {
        // Create a data URL from the file for local storage
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedUserData.avatar = reader.result;
          finalizeUpdate(updatedUserData);
        };
        reader.readAsDataURL(editFormData.avatarFile);
      } else {
        finalizeUpdate(updatedUserData);
      }

      // Try API update if available
      try {
        const response = await api.patch('/users/me/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('API update successful:', response.data);
      } catch (apiError) {
        console.log('API update failed, using local storage only');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  // Helper function to finalize the update after avatar processing
  const finalizeUpdate = (updatedData) => {
    // Update local state
    setUserData(updatedData);
    
    // Update in auth context if available
    if (user && updateProfile) {
      console.log('Updating profile through AuthContext');
      updateProfile(updatedData).catch(err => {
        console.error('Failed to update profile in auth context:', err);
      });
    } else {
      console.log('Updating profile directly in localStorage');
      // Update directly in localStorage if auth context update is not available
      try {
        // Get user-specific storage key
        const currentUserKey = localStorage.getItem('currentUserKey');
        
        // Update user-specific data if available
        if (currentUserKey) {
          console.log('Saving to user-specific key:', currentUserKey);
          localStorage.setItem(currentUserKey, JSON.stringify(updatedData));
        }
        
        // Also update the generic userData
        localStorage.setItem('userData', JSON.stringify(updatedData));
      } catch (err) {
        console.error('Failed to update localStorage:', err);
      }
    }

    // Close dialog and finish loading
    setEditDialogOpen(false);
    setLoading(false);
  };

  // Handle password save
  const handleSavePassword = async () => {
    // Reset status
    setPasswordError('');
    setPasswordSuccess(false);
    
    // Get values directly from refs
    const newPassword = newPasswordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';
    
    // Validate passwords
    if (newPassword.length < 8 || newPassword.length > 20) {
      setPasswordError('Password must be between 8-20 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // Get user-specific storage key
      const currentUserKey = localStorage.getItem('currentUserKey');
      
      // Update user data with the new password (hashed in a real app)
      if (currentUserKey && localStorage.getItem(currentUserKey)) {
        const userData = JSON.parse(localStorage.getItem(currentUserKey));
        
        // In a real app, you would send the password to your backend API
        // Here we're just storing it in localStorage (not secure for real passwords)
        userData.password = newPassword;
        
        // Save updated user data
        localStorage.setItem(currentUserKey, JSON.stringify(userData));
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('Password updated successfully');
        setPasswordSuccess(true);
        
        // Clear password fields
        if (newPasswordRef.current) newPasswordRef.current.value = '';
        if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
      } else {
        setPasswordError('Could not update password. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete account dialog open
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // Handle delete dialog close
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Get the user key and email to delete
      const currentUserKey = localStorage.getItem('currentUserKey');
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      
      // Remember the user identifier to add to a deletion list
      let userIdentifier = null;
      if (currentUserEmail) {
        userIdentifier = btoa(currentUserEmail).replace(/=/g, '');
      } else if (user && user.email) {
        userIdentifier = btoa(user.email).replace(/=/g, '');
      }
      
      // Keep track of deleted accounts so they can't be logged back in
      if (userIdentifier) {
        // Get existing deleted accounts list or create a new one
        const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts') || '[]');
        
        // Add this account to the deleted list if not already there
        if (!deletedAccounts.includes(userIdentifier)) {
          deletedAccounts.push(userIdentifier);
          localStorage.setItem('deletedAccounts', JSON.stringify(deletedAccounts));
        }
      }
      
      // Remove all traces of user data
      if (currentUserKey) {
        localStorage.removeItem(currentUserKey);
      }
      
      // If we know the email, remove all user data keys that might have been created for it
      if (currentUserEmail) {
        const userIdentifier = btoa(currentUserEmail).replace(/=/g, '');
        const userDataKey = `userData_${userIdentifier}`;
        localStorage.removeItem(userDataKey);
      }
      
      // Remove all auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUserKey');
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('userData');
      
      // For extra security, also clear any lastUser data that could be used to recover
      localStorage.removeItem('lastUserKey');
      localStorage.removeItem('lastUserEmail');
      
      console.log('Account deleted successfully');
      
      // Log out the user by calling the logout function
      await logout();
      
      // Close the dialog and redirect to home
      setDeleteDialogOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle email preferences dialog open
  const handleEmailPreferencesDialogOpen = () => {
    setEmailPreferencesDialogOpen(true);
  };

  // Handle email preferences dialog close
  const handleEmailPreferencesDialogClose = () => {
    setEmailPreferencesDialogOpen(false);
    // Reset email update success message when dialog closes
    setEmailUpdateSuccess(false);
  };

  // Handle email preference change
  const handleEmailPreferenceChange = (e) => {
    const { name, checked } = e.target;
    setEmailPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle save email preferences
  const handleSaveEmailPreferences = async () => {
    setLoading(true);
    try {
      // Create updated user data
      const updatedUserData = {
        ...userData,
        emailPreferences: emailPreferences
      };

      // Update user data
      setUserData(updatedUserData);
      
      // Update in auth context if available
      if (user && updateProfile) {
        console.log('Updating email preferences through AuthContext');
        updateProfile(updatedUserData).catch(err => {
          console.error('Failed to update email preferences in auth context:', err);
        });
      } else {
        console.log('Updating email preferences directly in localStorage');
        // Update directly in localStorage if auth context update is not available
        try {
          // Get user-specific storage key
          const currentUserKey = localStorage.getItem('currentUserKey');
          
          // Update user-specific data if available
          if (currentUserKey) {
            console.log('Saving to user-specific key:', currentUserKey);
            const userData = JSON.parse(localStorage.getItem(currentUserKey));
            userData.emailPreferences = emailPreferences;
            localStorage.setItem(currentUserKey, JSON.stringify(userData));
          }
          
          // Also update the generic userData
          const genericUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          genericUserData.emailPreferences = emailPreferences;
          localStorage.setItem('userData', JSON.stringify(genericUserData));
        } catch (err) {
          console.error('Failed to update localStorage:', err);
        }
      }
      
      // Show success message
      setEmailUpdateSuccess(true);
      
      // Keep dialog open to show success message
      setTimeout(() => {
        setEmailPreferencesDialogOpen(false);
        setEmailUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to update email preferences:', error);
      alert('Failed to update email preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle unsubscribe from all
  const handleUnsubscribeAll = async () => {
    setLoading(true);
    try {
      // Set all email preferences to false
      const allUnsubscribed = {
        marketing: false,
        newsletters: false,
        projectUpdates: false,
        donationReceipts: true, // Keep donation receipts as they're typically required
      };
      
      // Update the preferences
      setEmailPreferences(allUnsubscribed);
      
      // Create updated user data
      const updatedUserData = {
        ...userData,
        emailPreferences: allUnsubscribed
      };
      
      // Update user data
      setUserData(updatedUserData);
      
      // Update in auth context if available
      if (user && updateProfile) {
        console.log('Updating email preferences through AuthContext');
        updateProfile(updatedUserData).catch(err => {
          console.error('Failed to update email preferences in auth context:', err);
        });
      } else {
        console.log('Unsubscribing from all emails directly in localStorage');
        // Update directly in localStorage if auth context update is not available
        try {
          // Get user-specific storage key
          const currentUserKey = localStorage.getItem('currentUserKey');
          
          // Update user-specific data if available
          if (currentUserKey) {
            console.log('Saving to user-specific key:', currentUserKey);
            const userData = JSON.parse(localStorage.getItem(currentUserKey));
            userData.emailPreferences = allUnsubscribed;
            localStorage.setItem(currentUserKey, JSON.stringify(userData));
          }
          
          // Also update the generic userData
          const genericUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          genericUserData.emailPreferences = allUnsubscribed;
          localStorage.setItem('userData', JSON.stringify(genericUserData));
        } catch (err) {
          console.error('Failed to update localStorage:', err);
        }
      }
      
      alert('You have been unsubscribed from all email communications.');
    } catch (error) {
      console.error('Failed to unsubscribe from all:', error);
      alert('Failed to unsubscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    try {
      // Handle both string dates and Date objects
      const date = typeof dateString === 'object' ? dateString : new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date Format';
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  // Add a project name mapping function 
  const getProjectName = (projectId) => {
    // Check if we already have the name as a string, if so return it immediately
    if (typeof projectId === 'string' && 
        (projectId.includes('Initiative') || 
         projectId.includes('Education') || 
         projectId.includes('Relief') || 
         projectId.includes('Program') || 
         projectId.includes('Project'))) {
      return projectId;
    }
    
    // Map project IDs to meaningful names - add numeric ID mappings for items from DonationsPage
    const projectNames = {
      // String ID format
      'p1': 'Clean Water Initiative',
      'p2': 'Education for Children',
      'p3': 'Disaster Relief Fund',
      'p4': 'Healthcare Access Program',
      'p5': 'Food Security Project',
      
      // Numeric ID format (these match the actual projects from DonationsPage)
      '1': 'Clean Water Initiative',
      '2': 'Education for All',
      '3': 'Emergency Medical Aid',
      '4': 'Sustainable Agriculture',
      '5': 'Women\'s Empowerment',
      '6': 'Disaster Relief Fund',
      '7': 'Youth Sports Program',
      '8': 'Mental Health Support',
      '9': 'Ocean Cleanup',
      '10': 'Elderly Care Program',
      '11': 'Wildlife Conservation',
      '12': 'Digital Literacy',
      '13': 'Food Security Initiative',
      '14': 'Renewable Energy Project',
      '15': 'Art Therapy Program',
      
      // Ensure numeric IDs also work
      1: 'Clean Water Initiative',
      2: 'Education for All',
      3: 'Emergency Medical Aid',
      4: 'Sustainable Agriculture',
      5: 'Women\'s Empowerment',
      6: 'Disaster Relief Fund',
    };
    
    // Convert projectId to string to ensure lookup works consistently
    const projectIdStr = String(projectId);
    
    // Check if we have a direct mapping
    if (projectId && projectNames[projectId]) {
      console.log(`Found exact project name match for ID ${projectId}: ${projectNames[projectId]}`);
      return projectNames[projectId];
    }
    
    // Otherwise use a friendly default based on the ID
    if (projectId) {
      // Try to extract a simple project number if it follows our format
      if (typeof projectIdStr === 'string' && projectIdStr.startsWith('p-')) {
        return `Project ${projectIdStr.substring(2)}`;
      }
      
      console.log(`No exact mapping found for projectId ${projectId}, using generic name`);
      return `Project ${projectIdStr}`;
    }
    
    return 'General Donation';
  };

  // Add a function to get project image by ID
  const getProjectImageByID = (projectId) => {
    // A map of project IDs to their image URLs - ideally this would come from an API
    const projectImages = {
      1: 'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?q=80&w=1740&auto=format&fit=crop',
      2: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1740&auto=format&fit=crop',
      3: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?q=80&w=1740&auto=format&fit=crop',
      4: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop',
      5: 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?q=80&w=1740&auto=format&fit=crop',
      6: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=1740&auto=format&fit=crop',
      // Add more mappings as needed
    };
    
    // Check if we have an image mapping for this ID
    if (projectId && projectImages[projectId]) {
      return projectImages[projectId];
    }
    
    // Return a default image if we don't have a mapping
    return 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6';
  };

  // Handle adding a project to cart and navigating to cart page
  const handleAddToCart = (project) => {
    if (!project || !project.id) {
      console.error('Invalid project data:', project);
      return;
    }
    
    try {
      // Add project to cart with default donation amount (e.g., $10)
      addToCart({
        id: project.id,
        name: project.name || getProjectName(project.id),
        amount: 10, // Default donation amount
        image: project.image || getProjectImageByID(project.id)
      });
      
      // Navigate to cart page
      navigate('/cart');
    } catch (error) {
      console.error('Error adding project to cart:', error);
      alert('Could not add project to cart. Please try again.');
    }
  };

  // TEMPORARY: Utility function to reset donation history if issues persist
  const resetDonationHistory = () => {
    try {
      // Get current user key
      const currentUserKey = localStorage.getItem('currentUserKey');
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      
      if (!currentUserKey || !currentUserEmail) {
        console.error('Cannot reset donations: No user is logged in');
        return;
      }
      
      // Get user data
      const userData = JSON.parse(localStorage.getItem(currentUserKey) || '{}');
      
      // Clear donation history
      userData.successfulDonations = [];
      
      // Save back to localStorage
      localStorage.setItem(currentUserKey, JSON.stringify(userData));
      
      // Also clear any donation-related global storage that might be causing conflicts
      localStorage.removeItem('successfulDonations');
      
      // Reload the page to apply changes
      window.location.reload();
    } catch (error) {
      console.error('Error resetting donation history:', error);
    }
  };
  
  // Add a small debug link at the bottom of donations tab
  const ResetDonationsLink = () => (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        Having issues with donation history?{' '}
        <Link 
          component="button" 
          variant="caption" 
          onClick={resetDonationHistory}
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          Reset donation history
        </Link>
      </Typography>
    </Box>
  );

  // My Account Tab Content
  const MyAccountContent = () => {
    // Using a function component instead of a render function
    return (
      <Box>
        {/* User Profile Section */}
        <ProfileBox sx={{ mb: 3 }}>
          <ProfileImage>
            <img
              src={userData.avatar || DEFAULT_AVATAR}
              alt={fullName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </ProfileImage>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
              {fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {userData.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Location: {userData.location}
            </Typography>
            <EditInfoButton onClick={handleEditDialogOpen}>
              Edit Profile
            </EditInfoButton>
          </Box>
        </ProfileBox>

        {/* Email Settings */}
        <ContentCard sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#a2bb25', mb: 2 }}>
            Email Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ mb: 2 }}>
            Manage your email preferences to control what types of communications you receive from us.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handleEmailPreferencesDialogOpen}
            >
              EDIT EMAIL PREFERENCES
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={handleUnsubscribeAll}
            >
              UNSUBSCRIBE FROM ALL
            </Button>
          </Box>
        </ContentCard>

        {/* Reset Password */}
        <ContentCard>
          <Typography variant="h6" sx={{ color: '#a2bb25', mb: 2 }}>
            Reset Password
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            To change your password below, simply enter your new password twice. Password must be between 8-20 characters long.
          </Typography>
          {passwordError && (
            <Typography color="error" variant="body2" sx={{ mt: 1, mb: 1 }}>
              {passwordError}
            </Typography>
          )}
          {passwordSuccess && (
            <Typography color="success.main" variant="body2" sx={{ mt: 1, mb: 1 }}>
              Password updated successfully!
            </Typography>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <PasswordInputField
                label="NEW PASSWORD"
                name="newPassword"
                inputRef={newPasswordRef}
                error={passwordError && passwordError.includes('8-20')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <PasswordInputField
                  label="REPEAT NEW PASSWORD"
                  name="confirmPassword" 
                  inputRef={confirmPasswordRef}
                  error={passwordError && passwordError.includes('match')}
                />
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: '#6ba2bf', 
                    '&:hover': { bgcolor: '#5893b0' },
                    minWidth: '80px',
                    height: '40px'
                  }}
                  onClick={handleSavePassword}
                  disabled={loading}
                >
                  {loading ? '...' : 'SAVE'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ContentCard>

        {/* Account Actions */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <Button 
            variant="outlined" 
            color="error"
            sx={{ 
              borderColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                borderColor: 'error.main'
              },
              transition: 'all 0.3s ease'
            }}
            onClick={handleOpenDeleteDialog}
          >
            DELETE MY ACCOUNT
          </Button>
        </Box>
      </Box>
    );
  };

  // Donations Tab Content
  const DonationsContent = () => {
    // Process user donation data for the impact chart
    const processImpactData = () => {
      if (!userDonations || userDonations.length === 0) {
        return [];
      }
      
      // Create a map to track categories
      const categoryTotals = {
        'Direct Aid': 0,
        'Community Projects': 0,
        'Education': 0,
        'Healthcare': 0,
        'Other': 0
      };
      
      // Calculate total donation amount
      const totalAmount = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
      
      // Categorize donations based on project tags or type
      userDonations.forEach(donation => {
        const projectType = donation.project?.category || 'Other';
        
        // Map project types to our defined categories
        if (projectType.includes('health') || projectType.includes('medical')) {
          categoryTotals['Healthcare'] += donation.amount;
        } else if (projectType.includes('education') || projectType.includes('school')) {
          categoryTotals['Education'] += donation.amount;
        } else if (projectType.includes('community') || projectType.includes('local')) {
          categoryTotals['Community Projects'] += donation.amount;
        } else if (projectType.includes('direct') || projectType.includes('emergency')) {
          categoryTotals['Direct Aid'] += donation.amount;
        } else {
          categoryTotals['Other'] += donation.amount;
        }
      });
      
      // Convert to percentage and create data for chart
      const chartData = Object.entries(categoryTotals)
        .filter(([_, value]) => value > 0) // Only include categories with values
        .map(([name, value]) => ({
          name,
          value: Math.round((value / totalAmount) * 100),
          color: name === 'Direct Aid' ? '#4CAF50' :
                 name === 'Community Projects' ? '#2196F3' :
                 name === 'Education' ? '#FFC107' :
                 name === 'Healthcare' ? '#9C27B0' :
                 '#607D8B' // Other category
        }));
      
      // If no data was categorized, return empty array
      if (chartData.length === 0) {
        return getFallbackImpactData();
      }
      
      return chartData;
    };
    
    // Fallback data in case we can't categorize the user's donations
    const getFallbackImpactData = () => [
      { name: 'Direct Aid', value: 40, color: '#4CAF50' },
      { name: 'Community Projects', value: 25, color: '#2196F3' },
      { name: 'Education', value: 20, color: '#FFC107' },
      { name: 'Healthcare', value: 15, color: '#9C27B0' },
    ];
    
    // Get the impact data for the chart
    const impactData = userDonations.length > 0 ? processImpactData() : getFallbackImpactData();
    
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Your Donation History
        </Typography>
        
        {/* Currency Conversion Widget */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <Typography variant="h6" gutterBottom color="primary">
            Currency Conversion Tool
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate donation amounts in your preferred currency using real-time exchange rates
          </Typography>
          
          <CurrencyConversionWidget title="Live Currency Exchange Rates" />
        </Paper>
        
        {userDonations.length === 0 ? (
          <ContentCard>
            <Typography variant="body1" paragraph>
              You have not donated to a project yet. If you would like to support a project, explore our projects by
              theme and location, and find the one that speaks to your heart.
            </Typography>
            <ProjectButton component={RouterLink} to="/donations">FIND A PROJECT</ProjectButton>
            
            <ResetDonationsLink />
          </ContentCard>
        ) : (
          <>
            {/* Impact Report Section */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Your Impact Report
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                See how your donations are making a difference across various initiatives
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={impactData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {impactData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                    <Typography variant="body1" paragraph>
                      Your generous donations have directly impacted lives across multiple sectors:
                    </Typography>
                    <List>
                      {impactData.map((item) => (
                        <ListItem key={item.name} disableGutters sx={{ py: 0.5 }}>
                          <Box 
                            sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              bgcolor: item.color,
                              mr: 1,
                              display: 'inline-block'
                            }} 
                          />
                          <Typography variant="body2">
                            <strong>{item.name}:</strong> {item.value}% of your donations
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                    
                    {/* Show total amount donated */}
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <strong>Total amount donated:</strong> {formatCurrency(userDonations.reduce((sum, donation) => sum + donation.amount, 0), userDonations[0]?.currency || 'GBP')}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        component={RouterLink}
                        to="/donations"
                        sx={{ mt: 2 }}
                      >
                        Increase Your Impact
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {userDonations.map((donation) => (
              <Card 
                key={donation.id} 
                sx={{ 
                  mb: 3, 
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Project Image */}
                    <Grid item xs={12} sm={3}>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          height: 140,
                          borderRadius: 1,
                          overflow: 'hidden',
                          backgroundColor: '#f5f5f5'
                        }}
                      >
                        <img 
                          src={donation.project?.image || 'https://via.placeholder.com/500x300?text=Project+Image'} 
                          alt={donation.project?.name || 'Donation Project'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/500x300?text=Project+Image';
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    {/* Donation Details */}
                    <Grid item xs={12} sm={9}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                          {donation.project?.name || 'Donation'}
                        </Typography>
                        <Chip 
                          label={formatCurrency(donation.amount, donation.currency)}
                          color="primary"
                          sx={{ 
                            fontWeight: 'bold', 
                            backgroundColor: '#a2bb25',
                            '& .MuiChip-label': { px: 2 }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Donation Date: {formatDate(donation.date)}
                        </Typography>
                        <Chip 
                          label={donation.status?.toUpperCase() || 'COMPLETED'} 
                          size="small"
                          sx={{ 
                            backgroundColor: donation.status === 'completed' ? '#e8f5e9' : '#fff9c4',
                            color: donation.status === 'completed' ? '#2e7d32' : '#f57f17'
                          }}
                        />
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button 
                          onClick={() => handleOpenReceipt(donation.receiptData)}
                          variant="outlined" 
                          size="small"
                          sx={{ 
                            borderColor: '#9e9e9e',
                            color: '#616161',
                            '&:hover': { 
                              borderColor: '#757575',
                              backgroundColor: 'rgba(158, 158, 158, 0.04)'
                            }
                          }}
                        >
                          View Receipt
                        </Button>
                        
                        <Button 
                          onClick={() => toggleFavorite(donation.project)}
                          variant="outlined" 
                          size="small"
                          startIcon={isFavorite(donation.project?.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          sx={{ 
                            borderColor: isFavorite(donation.project?.id) ? '#ff4081' : '#9e9e9e',
                            color: isFavorite(donation.project?.id) ? '#ff4081' : '#616161',
                            '&:hover': { 
                              borderColor: '#ff4081',
                              color: '#ff4081',
                              backgroundColor: 'rgba(255, 64, 129, 0.04)'
                            }
                          }}
                        >
                          {isFavorite(donation.project?.id) ? 'Favorited' : 'Favorite'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            
            <ResetDonationsLink />
          </>
        )}
      </Box>
    );
  };

  // Favorites Tab Content
  const FavoritesContent = () => {
    if (favoriteProjects.length === 0) {
      return (
        <ContentCard>
          <Typography variant="body1" paragraph>
            You do not have any favorite projects yet. To mark a project as a "favorite," select the
            heart icon next to any project in your donation history or on project pages.
          </Typography>
          <ProjectButton component={RouterLink} to="/donations">FIND A PROJECT</ProjectButton>
        </ContentCard>
      );
    }
    
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Your Favorite Projects
        </Typography>
        
        {favoriteProjects.map((project) => (
          <Card 
            key={project.id} 
            sx={{ 
              mb: 3, 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                {/* Project Image */}
                <Grid item xs={12} sm={3}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 140,
                      borderRadius: 1,
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <img 
                      src={project.image || 'https://via.placeholder.com/500x300?text=Project+Image'} 
                      alt={project.name || 'Project'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/500x300?text=Project+Image';
                      }}
                    />
                  </Box>
                </Grid>
                
                {/* Project Details */}
                <Grid item xs={12} sm={9}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                      {project.name || 'Project'}
                    </Typography>
                    <Button
                      onClick={() => toggleFavorite(project)}
                      variant="outlined"
                      size="small"
                      startIcon={<FavoriteIcon />}
                      sx={{
                        borderColor: '#ff4081',
                        color: '#ff4081',
                        '&:hover': {
                          borderColor: '#f50057',
                          backgroundColor: 'rgba(255, 64, 129, 0.04)'
                        }
                      }}
                    >
                      Unfavorite
                    </Button>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description || 'Support this project with your donation. Your contribution will make a real difference.'}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      onClick={() => handleAddToCart(project)}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#a2bb25',
                        '&:hover': {
                          backgroundColor: '#8ba122'
                        }
                      }}
                    >
                      Donate Now
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <ProjectButton component={RouterLink} to="/donations">EXPLORE MORE PROJECTS</ProjectButton>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <StyledTab label="MY ACCOUNT" />
          <StyledTab label="DONATIONS" />
          <StyledTab label="FAVORITES" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && <MyAccountContent />}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && <DonationsContent />}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 2}>
        {tabValue === 2 && <FavoritesContent />}
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Box>
                  <Avatar
                    src={avatarPreview || userData.avatar || DEFAULT_AVATAR}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                      size="small"
                    >
                      Change Photo
                    </Button>
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleFormChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleFormChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleFormChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={editFormData.location}
                  onChange={handleFormChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleSaveProfile} disabled={loading} variant="contained" color="primary">
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Preferences Dialog */}
      <Dialog open={emailPreferencesDialogOpen} onClose={handleEmailPreferencesDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Email Preferences</DialogTitle>
        <DialogContent>
          {emailUpdateSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Email preferences updated successfully!
            </Alert>
          )}
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body2" paragraph>
              Choose the types of emails you would like to receive from us.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={emailPreferences.marketing}
                  onChange={handleEmailPreferenceChange}
                  name="marketing"
                />
              }
              label="Marketing and promotional emails"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={emailPreferences.newsletters}
                  onChange={handleEmailPreferenceChange}
                  name="newsletters"
                />
              }
              label="Newsletters and updates"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={emailPreferences.projectUpdates}
                  onChange={handleEmailPreferenceChange}
                  name="projectUpdates"
                />
              }
              label="Project updates for projects you've supported"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={emailPreferences.donationReceipts}
                  onChange={handleEmailPreferenceChange}
                  name="donationReceipts"
                  disabled
                />
              }
              label="Donation receipts (required)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmailPreferencesDialogClose}>Cancel</Button>
          <Button
            onClick={handleSaveEmailPreferences}
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? <CircularProgress size={24} /> : 'Save Preferences'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Donation Receipt Dialog */}
      <Dialog 
        open={receiptDialogOpen} 
        onClose={handleCloseReceipt}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          Donation Receipt
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedReceipt && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Thank you for your donation!
              </Typography>
              
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Receipt ID</Typography>
                    <Typography variant="body1">{selectedReceipt.id || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Date</Typography>
                    <Typography variant="body1">{formatDate(selectedReceipt.date)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Project</Typography>
                    <Typography variant="body1">{selectedReceipt.projectName || 'General Donation'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#a2bb25' }}>
                      {formatCurrency(selectedReceipt.amount, selectedReceipt.currency)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                    <Typography variant="body1">{selectedReceipt.paymentMethod || 'Credit/Debit Card'}</Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Donor Information</Typography>
                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body1">{selectedReceipt.donor || fullName}</Typography>
                  <Typography variant="body1">{selectedReceipt.email || userData.email}</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This receipt has been sent to your email address. Thank you for your generosity!
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceipt}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // In a real app, this would trigger printing functionality
              window.print();
            }}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardPage; 