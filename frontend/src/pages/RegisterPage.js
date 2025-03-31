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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useAuth } from '../contexts/AuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { signInWithGoogle, signInWithFacebook } from '../config/firebase';
import { socialAuth } from '../services/authService';

const RegisterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

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
        // Call the signup function from AuthContext
        await signup(formData.email, formData.password);
        
        // Redirect to home page on successful registration
        navigate('/');
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
        
        // Send to backend
        await socialAuth(providerName, token, userData);
        
        // Navigate to dashboard
        navigate('/dashboard');
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
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1470&auto=format&fit=crop")',
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
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Join Our Community
            </Typography>
            <Typography variant="h6">
              Whether you want to donate or volunteer, your contribution can make a meaningful difference.
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
            p: { xs: 3, sm: 4 },
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Avatar sx={{ 
            mb: 2, 
            bgcolor: 'secondary.main', 
            width: { xs: 60, sm: 80 }, 
            height: { xs: 60, sm: 80 },
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
          }}>
            <PersonAddIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
          </Avatar>
          <Typography component="h1" variant="h3" sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontWeight: 'bold',
            mb: 1,
            textAlign: 'center'
          }}>
            Join HopeBridge Today
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mt: 2, 
            mb: 4, 
            textAlign: 'center',
            maxWidth: '80%',
            color: 'text.secondary'
          }}>
            Please select how you would like to contribute to our community:
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/register-donor"
                startIcon={<FavoriteIcon />}
                sx={{ 
                  py: 2.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)',
                  }
                }}
              >
                Join as Donor
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/register-volunteer"
                startIcon={<VolunteerActivismIcon />}
                sx={{ 
                  py: 2.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(156, 39, 176, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 15px rgba(156, 39, 176, 0.4)',
                  }
                }}
              >
                Join as Volunteer
              </Button>
            </Grid>
          </Grid>
          
          <Divider sx={{ width: '100%', my: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontWeight: 'medium' }}>
              OR CONTINUE WITH
            </Typography>
          </Divider>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ 
                  borderRadius: '8px', 
                  py: 1.5,
                  borderWidth: '1.5px',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderColor: '#4285F4',
                  }
                }}
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
                sx={{ 
                  borderRadius: '8px', 
                  py: 1.5,
                  borderWidth: '1.5px',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 89, 152, 0.04)',
                    borderColor: '#3b5998',
                  }
                }}
              >
                Facebook
              </Button>
            </Grid>
          </Grid>
          
          <Box mt={4} textAlign="center">
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ 
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'none',
                  }
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 5, textAlign: 'center' }}>
            By signing up, you agree to our{' '}
            <Link component={RouterLink} to="/terms">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link component={RouterLink} to="/privacy-policy">
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage; 