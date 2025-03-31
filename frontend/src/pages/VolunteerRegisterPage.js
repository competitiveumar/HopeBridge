import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Checkbox,
  FormControlLabel,
  Avatar,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, signInWithFacebook } from '../config/firebase';
import { socialAuth } from '../services/authService';

const VolunteerRegisterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    skills: '',
    availability: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Check if form is valid whenever formData or errors change
  useEffect(() => {
    const isValid = 
      formData.firstName.trim() !== '' && 
      formData.lastName.trim() !== '' && 
      formData.email.trim() !== '' && 
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password !== '' &&
      formData.password.length >= 8 &&
      formData.confirmPassword !== '' &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms;
    
    setFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeToTerms' ? checked : value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    // Clear register error when user types
    if (registerError) {
      setRegisterError('');
    }
    
    // Live validation for password matching
    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPassword && password !== confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Generate a full name for the register function
        const fullName = `${formData.firstName} ${formData.lastName}`;
        
        // Call the register function from AuthContext with user type
        await register(fullName, formData.email, formData.password, 'volunteer');
        
        // Save additional volunteer data to localStorage
        const userIdentifier = btoa(formData.email).replace(/=/g, '');
        const userDataKey = `userData_${userIdentifier}`;
        const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
        
        // Add volunteer-specific fields
        userData.phoneNumber = formData.phoneNumber;
        userData.skills = formData.skills;
        userData.availability = formData.availability;
        userData.volunteerHours = 0;
        userData.joinDate = new Date().toISOString();
        
        // Save back to localStorage
        localStorage.setItem(userDataKey, JSON.stringify(userData));
        
        // Redirect to volunteer dashboard on successful registration
        navigate('/volunteer-dashboard');
      } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific Firebase error codes
        const errorCode = error.code || '';
        
        if (errorCode === 'auth/email-already-in-use') {
          setErrors(prev => ({
            ...prev,
            email: 'This email is already in use'
          }));
        } else if (errorCode === 'auth/weak-password') {
          setErrors(prev => ({
            ...prev,
            password: 'Password is too weak. Please use a stronger password.'
          }));
        } else if (errorCode === 'auth/invalid-email') {
          setErrors(prev => ({
            ...prev,
            email: 'Email address is invalid'
          }));
        } else if (errorCode === 'auth/configuration-not-found') {
          setRegisterError('Firebase configuration error. Please make sure Firebase is properly set up.');
          console.error('Firebase project not found. Check your configuration and make sure the project exists.');
        } else {
          // For other errors
          setRegisterError(
            error.message || 'An error occurred during registration. Please try again.'
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setRegisterError('');
    
    try {
      let result;
      
      if (provider === 'Google') {
        result = await signInWithGoogle();
      } else if (provider === 'Facebook') {
        result = await signInWithFacebook();
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }
      
      if (result && result.success) {
        // Extract user data
        const userData = result.user;
        console.log(`${provider} signup successful:`, userData);
        
        // Get the provider ID (google.com -> google)
        let providerName = provider.toLowerCase();
        if (userData.providerData && userData.providerData.length > 0) {
          const providerId = userData.providerData[0].providerId || '';
          providerName = providerId.replace('.com', '');
        }
        
        // Get token
        const token = result.token || userData.accessToken || userData.stsTokenManager?.accessToken;
        
        if (!token) {
          throw new Error('No access token available from authentication provider');
        }
        
        // Send to backend with volunteer user type
        const additionalData = {
          user_type: 'volunteer'
        };
        
        await socialAuth(providerName, token, { ...userData, ...additionalData });
        
        // Navigate to volunteer dashboard
        navigate('/volunteer-dashboard');
      } else if (result) {
        throw new Error(result.error || `${provider} registration failed`);
      }
    } catch (error) {
      console.error(`${provider} registration error:`, error);
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        setRegisterError('An account already exists with the same email address but different sign-in credentials. Try signing in a different way.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setRegisterError('Sign-up was cancelled. Please try again.');
      } else {
        setRegisterError(error.message || `An error occurred during ${provider} registration. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url("https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=1470&auto=format&fit=crop")',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => t.palette.grey[50],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', sm: 'block' },
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 40,
              left: 40,
              color: 'white',
              zIndex: 1,
              maxWidth: '80%'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Make a Difference as a Volunteer
            </Typography>
            <Typography variant="body1">
              Join our community of dedicated volunteers and contribute your time and skills to causes that matter.
            </Typography>
          </Box>
        </Grid>
      )}
      <Grid 
        item 
        xs={12} 
        sm={8} 
        md={5} 
        component={Paper} 
        elevation={6} 
        square
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: theme.palette.background.default
        }}
      >
        <Box
          sx={{
            my: { xs: 4, md: 6 },
            mx: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 2, sm: 3 },
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Avatar sx={{ 
            m: 1, 
            bgcolor: 'secondary.main', 
            width: { xs: 56, sm: 70 }, 
            height: { xs: 56, sm: 70 },
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
          }}>
            <VolunteerActivismIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            fontWeight: 'bold',
            mb: 1
          }}>
            Volunteer Registration
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Register to start making an impact in your community
          </Typography>
          <Box 
            component="form" 
            noValidate 
            onSubmit={handleSubmit} 
            sx={{ 
              mt: 3,
              width: '100%',
              maxWidth: '500px', 
              transition: 'all 0.3s ease'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  id="phoneNumber"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="skills"
                  label="Skills (e.g. teaching, medical, language)"
                  id="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="availability-label">Availability</InputLabel>
                  <Select
                    labelId="availability-label"
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    label="Availability"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="weekdays">Weekdays</MenuItem>
                    <MenuItem value="weekends">Weekends</MenuItem>
                    <MenuItem value="evenings">Evenings</MenuItem>
                    <MenuItem value="anytime">Anytime</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      name="agreeToTerms" 
                      color="primary" 
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link component={RouterLink} to="/terms" variant="body2">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link component={RouterLink} to="/privacy-policy" variant="body2">
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
                {errors.agreeToTerms && (
                  <Typography variant="caption" color="error">
                    {errors.agreeToTerms}
                  </Typography>
                )}
              </Grid>
            </Grid>
            
            {registerError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {registerError}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(156, 39, 176, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(156, 39, 176, 0.4)',
                }
              }}
              disabled={loading || !formValid}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Register as Volunteer'
              )}
            </Button>
            
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialLogin('Google')}
                  sx={{ borderRadius: '4px', py: 1 }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  onClick={() => handleSocialLogin('Facebook')}
                  sx={{ borderRadius: '4px', py: 1 }}
                >
                  Facebook
                </Button>
              </Grid>
            </Grid>
            
            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary" sx={{ mt: 5 }}>
                &copy; {new Date().getFullYear()} HopeBridge. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default VolunteerRegisterPage; 