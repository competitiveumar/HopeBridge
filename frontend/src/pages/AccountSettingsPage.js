import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Avatar,
  IconButton,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { userService } from '../services/api';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const AccountSettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    photoURL: currentUser?.photoURL || '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    donationReceipts: true,
    eventReminders: true,
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
    } else {
      // Fetch user profile data from backend
      fetchUserData();
    }
  }, [currentUser, navigate]);

  // Fetch user data from the backend
  const fetchUserData = async () => {
    setLoadingUserData(true);
    try {
      const [profileResponse, userResponse] = await Promise.all([
        userService.getProfile(),
        userService.getUserDetails(),
      ]);

      // Combine backend profile data with firebase user data
      const backendProfile = profileResponse.data;
      const userData = userResponse.data;

      setProfileData({
        displayName: currentUser.displayName || userData.first_name + ' ' + userData.last_name,
        email: currentUser.email,
        photoURL: currentUser.photoURL || backendProfile.profile_image,
        phoneNumber: backendProfile.phone_number || '',
        address: backendProfile.address || '',
        city: backendProfile.city || '',
        state: backendProfile.state || '',
        zipCode: backendProfile.zip_code || '',
        country: backendProfile.country || '',
      });

      setNotificationSettings({
        emailNotifications: backendProfile.email_notifications,
        smsNotifications: backendProfile.sms_notifications,
        marketingEmails: backendProfile.marketing_emails,
        donationReceipts: backendProfile.donation_receipts,
        eventReminders: backendProfile.event_reminders,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      showMessage('Failed to load user data', 'error');
    } finally {
      setLoadingUserData(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle profile form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Handle notification toggle changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      
      // Upload to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `profile-photos/${currentUser.uid}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update Firebase user profile
      await updateProfile(currentUser, { photoURL: downloadURL });
      
      // Update backend profile
      await userService.uploadProfileImage(file);
      
      // Update local state
      setProfileData({
        ...profileData,
        photoURL: downloadURL,
      });
      
      showMessage('Profile photo updated successfully', 'success');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showMessage('Failed to update profile photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update Firebase user profile
      await updateProfile(currentUser, {
        displayName: profileData.displayName,
      });
      
      // Update backend profile
      await userService.updateProfile({
        phone_number: profileData.phoneNumber,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zipCode,
        country: profileData.country,
      });
      
      showMessage('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      showMessage('Password must be at least 8 characters', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Reauthenticate Firebase user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update Firebase password
      await updatePassword(currentUser, passwordData.newPassword);
      
      // Update backend password
      await userService.changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      showMessage('Password updated successfully', 'success');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        showMessage('Current password is incorrect', 'error');
      } else {
        showMessage('Failed to update password', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle notification settings update
  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update backend notification settings
      await userService.updateNotificationSettings({
        email_notifications: notificationSettings.emailNotifications,
        sms_notifications: notificationSettings.smsNotifications,
        marketing_emails: notificationSettings.marketingEmails,
        donation_receipts: notificationSettings.donationReceipts,
        event_reminders: notificationSettings.eventReminders,
      });
      
      showMessage('Notification settings updated successfully', 'success');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      showMessage('Failed to update notification settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show message using Snackbar
  const showMessage = (text, severity) => {
    setMessage({ text, severity });
    setOpenSnackbar(true);
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (!currentUser) {
    return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />;
  }

  if (loadingUserData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={50} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Account Settings
      </Typography>
      
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="account settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<EditIcon />} label="Profile" {...a11yProps(0)} />
            <Tab icon={<LockIcon />} label="Security" {...a11yProps(1)} />
            <Tab icon={<NotificationsIcon />} label="Notifications" {...a11yProps(2)} />
            <Tab icon={<CreditCardIcon />} label="Payment Methods" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        {/* Profile Settings */}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleProfileUpdate}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={3} sx={{ textAlign: 'center' }}>
                <Box position="relative" display="inline-block">
                  <Avatar
                    src={profileData.photoURL}
                    alt={profileData.displayName || 'User'}
                    sx={{ width: 120, height: 120, mb: 2, boxShadow: 3 }}
                  />
                  {uploadingPhoto ? (
                    <CircularProgress 
                      size={30} 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 20, 
                        right: 0
                      }} 
                    />
                  ) : (
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: -5,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.dark' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Click the edit icon to change your profile picture
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={8} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Personal Information</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleProfileChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profileData.email}
                      InputLabelProps={{ shrink: true }}
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>Address Information</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={profileData.city}
                      onChange={handleProfileChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      name="state"
                      value={profileData.state}
                      onChange={handleProfileChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Zip/Postal Code"
                      name="zipCode"
                      value={profileData.zipCode}
                      onChange={handleProfileChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      value={profileData.country}
                      onChange={handleProfileChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Security Settings */}
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handlePasswordUpdate}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  helperText="Password must be at least 8 characters"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                  helperText={
                    passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''
                      ? 'Passwords do not match'
                      : ' '
                  }
                />
              </Grid>
              
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Password'}
                </Button>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
              Danger Zone
            </Typography>
            
            <Box sx={{ bgcolor: 'error.lighter', p: 2, borderRadius: 1 }}>
              <Typography variant="body1">
                Delete your account and all of your data
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This action cannot be undone. All your data will be permanently removed.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Notification Settings */}
        <TabPanel value={tabValue} index={2}>
          <Box component="form" onSubmit={handleNotificationUpdate}>
            <Typography variant="h6" gutterBottom>
              Email Notifications
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      name="emailNotifications"
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive notifications about account activity via email
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.donationReceipts}
                      onChange={handleNotificationChange}
                      name="donationReceipts"
                      color="primary"
                    />
                  }
                  label="Donation Receipts"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive receipts for donations made via email
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.eventReminders}
                      onChange={handleNotificationChange}
                      name="eventReminders"
                      color="primary"
                    />
                  }
                  label="Event Reminders"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive reminders about upcoming events
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationChange}
                      name="marketingEmails"
                      color="primary"
                    />
                  }
                  label="Marketing Emails"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive marketing emails about new features and offerings
                </Typography>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  SMS Notifications
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onChange={handleNotificationChange}
                      name="smsNotifications"
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive notifications via text message (standard messaging rates may apply)
                </Typography>
              </Grid>
              
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Preferences'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Payment Methods */}
        <TabPanel value={tabValue} index={3}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Methods
            </Typography>
            
            {paymentMethods.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  You don't have any payment methods saved yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                >
                  Add Payment Method
                </Button>
              </Paper>
            ) : (
              <>
                <Grid container spacing={2}>
                  {paymentMethods.map((method) => (
                    <Grid item xs={12} key={method.id}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Grid container alignItems="center">
                          <Grid item xs={10}>
                            <Typography variant="body1">
                              {method.type} ending in {method.lastFour}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ textAlign: 'right' }}>
                            <IconButton color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                  >
                    Add New Payment Method
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>
      </Paper>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={message.severity} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountSettingsPage; 