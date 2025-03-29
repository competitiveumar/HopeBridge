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

  const handleSocialLogin = (provider) => {
    // In a real app, this would handle social login/registration
    console.log(`Registering with ${provider}`);
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
            backgroundImage: 'url("https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1470&auto=format&fit=crop")',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => t.palette.grey[50],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', sm: 'block' },
          }}
        />
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
        }}
      >
        <Box
          sx={{
            my: { xs: 4, md: 8 },
            mx: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 2, sm: 3 }
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }}>
            <PersonAddIcon sx={{ fontSize: { xs: 20, sm: 30 } }} />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Create an Account
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
                  autoFocus={!isMobile}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '50px', sm: '56px' },
                      transition: 'all 0.3s ease',
                    }
                  }}
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
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '50px', sm: '56px' },
                      transition: 'all 0.3s ease',
                    }
                  }}
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
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '50px', sm: '56px' },
                      transition: 'all 0.3s ease',
                    }
                  }}
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
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '50px', sm: '56px' },
                      transition: 'all 0.3s ease',
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size={isMobile ? "small" : "medium"}
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
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '50px', sm: '56px' },
                      transition: 'all 0.3s ease',
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                          size={isMobile ? "small" : "medium"}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      color="primary"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      size={isMobile ? "small" : "medium"}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      I agree to the{' '}
                      <Link component={RouterLink} to="/terms">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link component={RouterLink} to="/privacy">
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
              sx={{ 
                mt: 3, 
                mb: 2,
                height: { xs: '44px', sm: '50px' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                transition: 'all 0.3s ease',
                opacity: formValid ? 1 : 0.7,
              }}
              disabled={!formValid || loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            <Box sx={{ 
              mt: { xs: 3, sm: 4 }, 
              textAlign: 'center' 
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Or register with
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'center',
                  gap: { xs: 1, sm: 2 }
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialLogin('google')}
                  fullWidth={isMobile}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: isMobile ? 1 : 0,
                    transition: 'all 0.3s ease' 
                  }}
                >
                  Google
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  onClick={() => handleSocialLogin('facebook')}
                  fullWidth={isMobile}
                  size={isMobile ? "small" : "medium"}
                  sx={{ transition: 'all 0.3s ease' }}
                >
                  Facebook
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage; 