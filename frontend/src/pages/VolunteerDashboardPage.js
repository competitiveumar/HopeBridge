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
  CardActions,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Badge,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { 
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarMonthIcon,
  Campaign as CampaignIcon,
  Close as CloseIcon,
  EventAvailable as EventAvailableIcon,
  LocalHospital as LocalHospitalIcon,
  School as SchoolIcon,
  LocationOn as LocationOnIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Diversity3 as CommunityIcon,
  LightbulbCircle as SkillsIcon,
  CalendarToday as ScheduleIcon,
  Star as StarIcon,
  WorkOutline as WorkIcon,
  Public as PublicIcon,
  NotificationsActive as AlertIcon,
  Search as SearchIcon,
  Circle as CircleIcon,
  PhotoCamera,
  Email as EmailIcon,
  Comment as CommentIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';

// Default avatar as a Data URI (a simple gray avatar with user silhouette)
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjY2NjYyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgOCAyLjY3IDggNiAwIDMuMzMtNS4zMyA2LTggNnMtOC0yLjY3LTgtNmMwLTMuMzMgNS4zMy02IDgtNnptMCAxMmMtMi44NSAwLTUuMjktLjk2LTctMy40NC43Mi0uOTcgMi42OS0yLjA2IDUtMi4zNGwxIDEgMSAxaDJsMS0xIDEtMWMyLjMxLjI3IDQuMjggMS4zNyA1IDIuMzQtMS43MSAyLjQ4LTQuMTUgMy40NC03IDMuNDR6Ii8+PC9zdmc+';

// Styled components
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

const ContentCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const OpportunityCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const EventListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
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

const VolunteerDashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phoneNumber: '',
    skills: '',
    availability: '',
    volunteerHours: 0,
    joinDate: '',
    avatar: null,
  });
  const [volunteerHours, setVolunteerHours] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [logHoursDialogOpen, setLogHoursDialogOpen] = useState(false);
  const [hoursFormData, setHoursFormData] = useState({
    date: '',
    hours: '',
    activity: '',
    description: '',
  });
  const [hoursFormErrors, setHoursFormErrors] = useState({});
  
  // Edit profile dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phoneNumber: '',
    skills: '',
    availability: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Delete account dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Password reset states
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Refs for password fields
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [charityUpdates, setCharityUpdates] = useState([]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchUserData();
    fetchMockData();
    initializeNotifications();
    fetchMockOpportunities();
    initializeCharityUpdates();
  }, [user, navigate]);

  // Fetch user data from localStorage
  const fetchUserData = () => {
    try {
      const userIdentifier = btoa(user.email).replace(/=/g, '');
      const userDataKey = `userData_${userIdentifier}`;
      const storedUserData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
      
      // Load volunteer-specific data if available
      let hoursList = [];
      if (storedUserData.volunteerHoursList) {
        hoursList = storedUserData.volunteerHoursList;
        setVolunteerHours(hoursList);
      } else {
        setVolunteerHours([]);
      }
      
      // Calculate total hours from the actual hours list
      const calculatedTotalHours = hoursList.reduce((total, entry) => total + parseFloat(entry.hours || 0), 0);
      
      // Set user profile data with calculated total hours
      setUserData({
        first_name: storedUserData.first_name || '',
        last_name: storedUserData.last_name || '',
        email: storedUserData.email || '',
        phoneNumber: storedUserData.phoneNumber || '',
        skills: storedUserData.skills || '',
        availability: storedUserData.availability || '',
        volunteerHours: calculatedTotalHours, // Use calculated value instead of stored value
        joinDate: storedUserData.joinDate || new Date().toISOString(),
        avatar: storedUserData.avatar || null,
      });
      
      // Save the correct total hours back to localStorage
      if (calculatedTotalHours !== storedUserData.volunteerHours) {
        saveUserData({
          volunteerHours: calculatedTotalHours
        });
      }
      
      if (storedUserData.opportunities) {
        setOpportunities(storedUserData.opportunities);
      } else {
        // If no saved opportunities, initialize with defaults
        fetchMockOpportunities();
      }
      
      if (storedUserData.upcomingEvents) {
        setUpcomingEvents(storedUserData.upcomingEvents);
      } else {
        // Initialize with empty array, not mock data
        setUpcomingEvents([]);
      }
      
      if (storedUserData.notifications) {
        setNotifications(storedUserData.notifications);
      } else {
        // Initialize with future-dated notifications
        initializeNotifications();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Initialize notifications with future dates
  const initializeNotifications = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const mockNotifications = [
      {
        id: 1,
        type: 'opportunity',
        message: 'New volunteer opportunity: Medical Supply Sorting',
        date: tomorrow.toISOString().split('T')[0],
        read: false,
      },
      {
        id: 2,
        type: 'event',
        message: 'Reminder: Volunteer Recognition Dinner coming up',
        date: dayAfterTomorrow.toISOString().split('T')[0],
        read: true,
      },
      {
        id: 3,
        type: 'alert',
        message: 'Urgent need for volunteers: Flood relief efforts',
        date: tomorrow.toISOString().split('T')[0],
        read: false,
      },
      {
        id: 4,
        type: 'hours',
        message: 'Your volunteer hours verification is pending',
        date: nextWeek.toISOString().split('T')[0],
        read: true,
      },
    ];
    
    setNotifications(mockNotifications);
  };
  
  // Initialize opportunities with the updated Community Food Drive image
  const fetchMockOpportunities = () => {
    const mockOpportunities = [
      {
        id: 1,
        title: 'Community Food Drive',
        description: 'Help distribute food to families in need',
        location: 'Central Community Center',
        date: '2023-06-15',
        time: '10:00 AM - 2:00 PM',
        category: 'Food Assistance',
        spots: 5,
        image: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
        signed_up: false
      },
      {
        id: 2,
        title: 'After-School Tutoring',
        description: 'Support students in reading and math skills',
        location: 'Lincoln Elementary School',
        date: '2023-06-16',
        time: '3:30 PM - 5:30 PM',
        category: 'Education',
        spots: 3,
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1470&auto=format&fit=crop',
        signed_up: false
      },
      {
        id: 3,
        title: 'Environmental Cleanup',
        description: 'Help clean up local park and waterways',
        location: 'Riverside Park',
        date: '2023-06-18',
        time: '9:00 AM - 12:00 PM',
        category: 'Environment',
        spots: 10,
        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=1470&auto=format&fit=crop',
        signed_up: false
      },
      {
        id: 4,
        title: 'Medical Supply Sorting',
        description: 'Help sort and package medical supplies for disaster relief',
        location: 'HopeBridge Warehouse',
        date: '2023-06-20',
        time: '1:00 PM - 4:00 PM',
        category: 'Health',
        spots: 8,
        image: 'https://images.unsplash.com/photo-1587854680352-936b22b91030?q=80&w=1469&auto=format&fit=crop',
        signed_up: false
      },
    ];
    
    setOpportunities(mockOpportunities);
  };

  // Fetch mock data for the volunteer dashboard
  const fetchMockData = () => {
    // Only fetch mock data if user data isn't available
    const userIdentifier = btoa(user.email).replace(/=/g, '');
    const userDataKey = `userData_${userIdentifier}`;
    const storedUserData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    
    if (!storedUserData.volunteerHoursList && 
        !storedUserData.opportunities && 
        !storedUserData.upcomingEvents && 
        !storedUserData.notifications) {
      // If we don't have any stored data, initialize with mock/empty data
      fetchMockOpportunities();
      initializeNotifications();
      setVolunteerHours([]);
      setUpcomingEvents([]);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle log hours dialog
  const handleOpenLogHoursDialog = () => {
    setLogHoursDialogOpen(true);
  };

  const handleCloseLogHoursDialog = () => {
    setLogHoursDialogOpen(false);
    setHoursFormData({
      date: '',
      hours: '',
      activity: '',
      description: '',
    });
    setHoursFormErrors({});
  };

  const handleHoursFormChange = (e) => {
    const { name, value } = e.target;
    setHoursFormData({
      ...hoursFormData,
      [name]: value,
    });
    
    // Clear errors
    if (hoursFormErrors[name]) {
      setHoursFormErrors({
        ...hoursFormErrors,
        [name]: '',
      });
    }
  };

  const validateHoursForm = () => {
    const errors = {};
    
    if (!hoursFormData.date) {
      errors.date = 'Date is required';
    }
    
    if (!hoursFormData.hours) {
      errors.hours = 'Hours are required';
    } else if (isNaN(hoursFormData.hours) || hoursFormData.hours <= 0) {
      errors.hours = 'Please enter a valid number of hours';
    }
    
    if (!hoursFormData.activity.trim()) {
      errors.activity = 'Activity is required';
    }
    
    setHoursFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitHours = () => {
    if (validateHoursForm()) {
      // Add the new hours to the volunteer hours list
      const newHoursEntry = {
        id: Date.now(),  // Use timestamp as a simple ID
        date: hoursFormData.date,
        hours: parseFloat(hoursFormData.hours),
        activity: hoursFormData.activity,
        description: hoursFormData.description,
        verified: false,
      };
      
      // Update the hours list
      const updatedHours = [...volunteerHours, newHoursEntry];
      setVolunteerHours(updatedHours);
      
      // Update the user's total volunteer hours
      const totalHours = userData.volunteerHours + parseFloat(hoursFormData.hours);
      
      // Update local state
        setUserData({
          ...userData,
          volunteerHours: totalHours,
        });
      
      // Save to localStorage
      saveUserData({
        volunteerHours: totalHours,
        volunteerHoursList: updatedHours
      });
      
      // Reset form data
      setHoursFormData({
        date: '',
        hours: '',
        activity: '',
        description: '',
      });
      
      // Close the dialog
      handleCloseLogHoursDialog();
    }
  };

  // Handle signing up for an opportunity
  const handleSignUp = (opportunityId) => {
    // In a real app, this would make an API call to register the user
    // For now, we'll just update the UI
    const updatedOpportunities = opportunities.map(opp => {
      if (opp.id === opportunityId) {
        return {
          ...opp,
          spots: Math.max(0, opp.spots - 1),
          signed_up: true,
        };
      }
      return opp;
    });
    
    setOpportunities(updatedOpportunities);
    
    // Add to upcoming events
    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    if (opportunity) {
      const newEvent = {
        id: Date.now(),
        title: opportunity.title,
        date: opportunity.date,
        time: opportunity.time,
        location: opportunity.location,
        attending: true,
      };
      
      const updatedEvents = [...upcomingEvents, newEvent];
      setUpcomingEvents(updatedEvents);
      
      // Save to localStorage
      saveUserData({
        opportunities: updatedOpportunities,
        upcomingEvents: updatedEvents
      });
    }
  };

  // Handle attending an event
  const handleToggleAttendance = (eventId) => {
    const updatedEvents = upcomingEvents.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          attending: !event.attending,
        };
      }
      return event;
    });
    
    setUpcomingEvents(updatedEvents);
    
    // Save to localStorage
    saveUserData({
      upcomingEvents: updatedEvents
    });
  };

  // Handle marking a notification as read
  const handleMarkNotificationRead = (notificationId) => {
    try {
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      );
      
      setNotifications(updatedNotifications);
      
      // Save to localStorage
      saveUserData({
        notifications: updatedNotifications
      });
      
      // In a real app, we would also update this in the backend
      console.log(`Marked notification ${notificationId} as read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Helper function to save user data to localStorage
  const saveUserData = (newData) => {
    try {
      if (!user || !user.email) return;
      
      const userIdentifier = btoa(user.email).replace(/=/g, '');
      const userDataKey = `userData_${userIdentifier}`;
      const storedUserData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
      
      // Merge with existing data
      const updatedUserData = { ...storedUserData, ...newData };
      
      // Save back to localStorage
      localStorage.setItem(userDataKey, JSON.stringify(updatedUserData));
      
      console.log('Saved user data to localStorage:', newData);
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  };

  // Handle edit dialog open
  const handleEditDialogOpen = () => {
    setEditFormData({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      skills: userData.skills,
      availability: userData.availability,
      avatar: userData.avatar,
    });
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
      // Create the updated user data
      let updatedUserData = {
        ...userData,
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
        skills: editFormData.skills,
        availability: editFormData.availability,
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
        // This would be an API call in a real application
        console.log('API update would be called here with:', updatedUserData);
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
        const userIdentifier = btoa(updatedData.email).replace(/=/g, '');
        const userDataKey = `userData_${userIdentifier}`;
        
        // Update user-specific data if available
        const storedUserData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
        const mergedData = { ...storedUserData, ...updatedData };
        localStorage.setItem(userDataKey, JSON.stringify(mergedData));
        
        // Also update the generic userData
        localStorage.setItem('userData', JSON.stringify(mergedData));
      } catch (err) {
        console.error('Failed to update localStorage:', err);
      }
    }

    // Close dialog and finish loading
    setEditDialogOpen(false);
    setLoading(false);
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

  // Calculate statistics
  const totalHours = userData.volunteerHours || 0;
  const eventsAttending = upcomingEvents.filter(event => event.attending).length;
  const unreadNotifications = notifications.filter(notification => !notification.read).length;
  
  // Calculate the member since date
  const memberSince = userData.joinDate ? formatDate(userData.joinDate) : 'N/A';

  // Initialize mock charity updates
  const initializeCharityUpdates = () => {
    const mockUpdates = [
      {
        id: 1,
        sender: 'Sarah Johnson',
        role: 'Volunteer Coordinator',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        title: 'New Volunteer Training Session',
        content: 'We are hosting a new volunteer training session on Saturday, 15th July. This session will cover best practices for community outreach and effective communication with beneficiaries. Please register if you are interested in attending.',
        date: '2023-06-25T09:30:00',
        isRead: false,
        priority: 'high',
      },
      {
        id: 2,
        sender: 'Mark Thompson',
        role: 'Project Manager',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        title: 'Community Garden Project Update',
        content: 'Thank you to all volunteers who helped with the community garden project last weekend. We planted over 100 trees and built 15 raised garden beds. The local community is already benefiting from this green space!',
        date: '2023-06-20T14:45:00',
        isRead: true,
        priority: 'medium',
      },
      {
        id: 3,
        sender: 'Emma Wilson',
        role: 'Executive Director',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        title: 'Annual Charity Gala - Volunteer Opportunities',
        content: 'Our annual charity gala is coming up next month. We need volunteers to help with setup, guest registration, and various activities during the event. This is a great opportunity to network with donors and partners.',
        date: '2023-06-15T11:20:00',
        isRead: false,
        priority: 'medium',
      },
      {
        id: 4,
        sender: 'Daniel Brown',
        role: 'Volunteer Coordinator',
        avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
        title: 'Volunteer Recognition Programme',
        content: 'We are launching a new volunteer recognition programme to acknowledge the amazing work our volunteers do. Please submit your volunteer hours regularly so we can recognise your contributions appropriately.',
        date: '2023-06-10T16:15:00',
        isRead: true,
        priority: 'low',
      },
    ];

    setCharityUpdates(mockUpdates);
  };

  // Open update dialog to view full message
  const handleOpenUpdateDialog = (update) => {
    setSelectedUpdate(update);
    setUpdateDialogOpen(true);

    // Mark as read if it wasn't already
    if (!update.isRead) {
      handleMarkUpdateRead(update.id);
    }
  };

  // Close update dialog
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  // Mark an update as read
  const handleMarkUpdateRead = (updateId) => {
    setCharityUpdates(prevUpdates => 
      prevUpdates.map(update => 
        update.id === updateId ? { ...update, isRead: true } : update
      )
    );
  };

  // Mark all updates as read
  const handleMarkAllUpdatesRead = () => {
    setCharityUpdates(prevUpdates => 
      prevUpdates.map(update => ({ ...update, isRead: true }))
    );
  };

  // Format date for display
  const formatUpdateDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Dashboard Content
  const DashboardContent = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Welcome, {userData.first_name}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard elevation={2}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <AccessTimeIcon color="primary" fontSize="large" />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {totalHours}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Volunteer Hours
            </Typography>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard elevation={2}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <EventAvailableIcon color="secondary" fontSize="large" />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="secondary">
              {eventsAttending}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Upcoming Events
            </Typography>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard elevation={2}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <CommunityIcon color="success" fontSize="large" />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {opportunities.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Available Opportunities
            </Typography>
          </StatsCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard elevation={2}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon color="info" fontSize="large" />
              </Badge>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="info.main">
              {notifications.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Notifications
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ContentCard>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Upcoming Events</Typography>
            </Box>
            <List>
              {upcomingEvents.map((event) => (
                <EventListItem
                  key={event.id}
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {formatDate(event.date)} • {event.time}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          {event.location}
                        </Typography>
                      </>
                    }
                  />
                  <Button
                    size="small"
                    variant={event.attending ? "contained" : "outlined"}
                    color={event.attending ? "success" : "primary"}
                    onClick={() => handleToggleAttendance(event.id)}
                  >
                    {event.attending ? 'Attending' : 'Attend'}
                  </Button>
                </EventListItem>
              ))}
              
              {upcomingEvents.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  No registered opportunities. Sign up for volunteer opportunities to see them here.
                </Typography>
              )}
            </List>
          </ContentCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <CharityUpdatesSection />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ContentCard>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Volunteer Opportunities
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SearchIcon />}
                onClick={() => setTabValue(2)}
              >
                Browse All
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {opportunities.slice(0, 3).map((opportunity) => (
                <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
                  <OpportunityCard elevation={3}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={opportunity.image}
                      alt={opportunity.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {opportunity.title}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(opportunity.date)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {opportunity.location}
                        </Typography>
                      </Box>
                      <Chip 
                        size="small" 
                        label={opportunity.category} 
                        sx={{ mt: 1 }}
                        color={
                          opportunity.category === 'Food Assistance' ? 'secondary' :
                          opportunity.category === 'Education' ? 'primary' :
                          opportunity.category === 'Environment' ? 'success' :
                          'default'
                        }
                      />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {opportunity.spots} spots left
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleSignUp(opportunity.id)}
                        disabled={opportunity.spots === 0 || opportunity.signed_up}
                      >
                        {opportunity.signed_up ? 'Signed Up' : 'Sign Up'}
                      </Button>
                    </CardActions>
                  </OpportunityCard>
                </Grid>
              ))}
            </Grid>
          </ContentCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ContentCard>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Notifications
              </Typography>
              <IconButton size="small">
                <CampaignIcon />
              </IconButton>
            </Box>
            
            <List>
              {notifications.slice(0, 4).map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    mb: 1,
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    borderRadius: 1,
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleMarkNotificationRead(notification.id)}
                    >
                      {notification.read ? <CheckCircleIcon color="success" /> : <CircleIcon color="primary" />}
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {notification.type === 'opportunity' && <WorkIcon color="primary" />}
                    {notification.type === 'event' && <EventIcon color="secondary" />}
                    {notification.type === 'alert' && <AlertIcon color="error" />}
                    {notification.type === 'hours' && <AccessTimeIcon color="success" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body1"
                        sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                      >
                        {notification.message}
                      </Typography>
                    }
                    secondary={formatDate(notification.date)}
                  />
                </ListItem>
              ))}
            </List>
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );

  // Hours content
  const HoursContent = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          My Volunteer Hours
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenLogHoursDialog}
        >
          Log Hours
        </Button>
      </Box>
      
      <ContentCard>
        <Box mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            {totalHours}
          </Typography>
          <Typography variant="body1">
            Total volunteer hours since {memberSince}
          </Typography>
        </Box>
        
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {volunteerHours.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.activity}</TableCell>
                  <TableCell>{entry.hours}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={entry.verified ? 'Verified' : 'Pending'}
                      color={entry.verified ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                </TableRow>
              ))}
              
              {volunteerHours.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                      No volunteer hours logged yet. Click "Log Hours" to add your volunteer time.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentCard>
    </Box>
  );

  // Opportunities content
  const OpportunitiesContent = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Volunteer Opportunities
      </Typography>
      
      <Grid container spacing={3}>
        {opportunities.map((opportunity) => (
          <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
            <OpportunityCard elevation={3}>
              <CardMedia
                component="img"
                height="160"
                image={opportunity.image}
                alt={opportunity.title}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {opportunity.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {opportunity.description}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(opportunity.date)} • {opportunity.time}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {opportunity.location}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Chip 
                    size="small" 
                    label={opportunity.category} 
                    sx={{ mr: 1 }}
                    color={
                      opportunity.category === 'Food Assistance' ? 'secondary' :
                      opportunity.category === 'Education' ? 'primary' :
                      opportunity.category === 'Environment' ? 'success' :
                      opportunity.category === 'Health' ? 'error' :
                      'default'
                    }
                  />
                  <Typography variant="body2" color="text.secondary">
                    {opportunity.spots} spot{opportunity.spots !== 1 ? 's' : ''} left
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSignUp(opportunity.id)}
                  disabled={opportunity.spots === 0 || opportunity.signed_up}
                >
                  {opportunity.signed_up ? 'Signed Up' : 'Sign Up'}
                </Button>
              </CardActions>
            </OpportunityCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Profile content
  const ProfileContent = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>
      
      <ProfileBox component={Paper} elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ 
            width: { xs: '100%', md: 150 }, 
            height: { xs: 150, md: 150 },
            marginBottom: { xs: 2, md: 0 }
          }}>
            <img
              src={userData.avatar || DEFAULT_AVATAR}
              alt={`${userData.first_name} ${userData.last_name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            />
          </Box>
          
        <Stack spacing={2} width="100%">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={userData.first_name}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={userData.last_name}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={userData.email}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={userData.phoneNumber}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills"
                value={userData.skills}
                multiline
                rows={2}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Availability"
                value={userData.availability}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
          
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
                onClick={handleEditDialogOpen}
            >
              Edit Profile
            </Button>
          </Box>
        </Stack>
        </Box>
      </ProfileBox>
      
      {/* Reset Password Section */}
      <ContentCard sx={{ mt: 3 }}>
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
      
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button 
          variant="outlined" 
          color="error"
          onClick={handleOpenDeleteDialog}
          sx={{ 
            borderColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.main',
              color: 'white',
              borderColor: 'error.main'
            },
            transition: 'all 0.3s ease'
          }}
        >
          DELETE MY ACCOUNT
        </Button>
        
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Logout'}
        </Button>
      </Box>
    </Box>
  );

  // Updates from Charity Staff section for Dashboard
  const CharityUpdatesSection = () => {
    const unreadCount = charityUpdates.filter(update => !update.isRead).length;
    
    return (
      <ContentCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Updates from Charity Staff</Typography>
            {unreadCount > 0 && (
              <Chip 
                label={`${unreadCount} new`} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          {unreadCount > 0 && (
            <Button 
              size="small" 
              startIcon={<MarkEmailReadIcon />}
              onClick={handleMarkAllUpdatesRead}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {charityUpdates.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No updates available at this time.
            </Typography>
          ) : (
            charityUpdates.map((update) => (
              <React.Fragment key={update.id}>
                <ListItemButton 
                  alignItems="flex-start" 
                  onClick={() => handleOpenUpdateDialog(update)}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: update.isRead ? 'transparent' : 'rgba(76, 175, 80, 0.08)',
                    border: '1px solid',
                    borderColor: update.isRead ? 'divider' : 'primary.light',
                    '&:hover': {
                      bgcolor: update.isRead ? 'action.hover' : 'rgba(76, 175, 80, 0.12)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={update.isRead}
                    >
                      <Avatar src={update.avatar} alt={update.sender}>
                        {update.sender.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Typography
                          variant="subtitle1"
                          color="text.primary"
                          sx={{ fontWeight: update.isRead ? 'normal' : 'bold' }}
                        >
                          {update.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatUpdateDate(update.date)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block', fontWeight: update.isRead ? 'normal' : 500 }}
                        >
                          {update.sender} • {update.role}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: 'inline',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {update.content}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
                {update !== charityUpdates[charityUpdates.length - 1] && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))
          )}
        </List>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CommentIcon />}
          >
            Message Staff
          </Button>
        </Box>
      </ContentCard>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        <StyledTab label="Dashboard" />
        <StyledTab label="My Hours" />
        <StyledTab label="Opportunities" />
        <StyledTab label="Profile" />
      </Tabs>
      
      {tabValue === 0 && <DashboardContent />}
      {tabValue === 1 && <HoursContent />}
      {tabValue === 2 && <OpportunitiesContent />}
      {tabValue === 3 && <ProfileContent />}
      
      {/* Log Hours Dialog */}
      <Dialog open={logHoursDialogOpen} onClose={handleCloseLogHoursDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Log Volunteer Hours</Typography>
            <IconButton onClick={handleCloseLogHoursDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Date"
                  type="date"
                  name="date"
                  value={hoursFormData.date}
                  onChange={handleHoursFormChange}
                  error={!!hoursFormErrors.date}
                  helperText={hoursFormErrors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Hours"
                  type="number"
                  name="hours"
                  value={hoursFormData.hours}
                  onChange={handleHoursFormChange}
                  error={!!hoursFormErrors.hours}
                  helperText={hoursFormErrors.hours}
                  InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Activity"
                  name="activity"
                  value={hoursFormData.activity}
                  onChange={handleHoursFormChange}
                  error={!!hoursFormErrors.activity}
                  helperText={hoursFormErrors.activity}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={hoursFormData.description}
                  onChange={handleHoursFormChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseLogHoursDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitHours}
          >
            Submit Hours
          </Button>
        </DialogActions>
      </Dialog>

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
                  label="Phone Number"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleFormChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Skills"
                  name="skills"
                  value={editFormData.skills}
                  onChange={handleFormChange}
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Availability"
                  name="availability"
                  value={editFormData.availability}
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

      {/* Charity Update Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        aria-labelledby="update-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        {selectedUpdate && (
          <>
            <DialogTitle id="update-dialog-title">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">{selectedUpdate.title}</Typography>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseUpdateDialog}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={selectedUpdate.avatar} alt={selectedUpdate.sender} sx={{ mr: 2 }}>
                  {selectedUpdate.sender.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{selectedUpdate.sender}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedUpdate.role}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {formatUpdateDate(selectedUpdate.date)}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                {selectedUpdate.content}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUpdateDialog} color="primary">
                Close
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CommentIcon />}
              >
                Reply
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default VolunteerDashboardPage; 