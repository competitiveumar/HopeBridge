import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { register, socialAuth } from '../../services/authService';
import SocialLogin from '../../components/SocialLogin/SocialLogin';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    agree_terms: false
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agree_terms' ? checked : value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    if (!formData.agree_terms) {
      newErrors.agree_terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      });
      
      setAlert({
        open: true,
        message: 'Registration successful! You can now log in.',
        severity: 'success'
      });
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || 'Registration failed. Please try again.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleSocialLoginSuccess = async (userData) => {
    setLoading(true);
    
    try {
      // Extract provider from providerData
      let provider = 'unknown';
      if (userData.providerData && userData.providerData.length > 0) {
        const providerId = userData.providerData[0].providerId || '';
        // Convert provider ID to simple name (google.com -> google)
        provider = providerId.replace('.com', '');
      }
      
      console.log('Social signup success, user data:', userData);
      
      // Get the access token
      const token = userData.accessToken || userData.stsTokenManager?.accessToken;
      
      if (!token) {
        throw new Error('No access token available from authentication provider');
      }
      
      // Call the backend to authenticate
      const response = await socialAuth(provider, token, userData);
      
      // Show success message
      setAlert({
        open: true,
        message: 'Account created successfully! Redirecting to dashboard...',
        severity: 'success'
      });
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Social signup failed:', error);
      setAlert({
        open: true,
        message: error.message || `Social signup with ${provider} failed. Please try again.`,
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | HopeBridge</title>
      </Helmet>
      
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 8
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              width: '100%',
              borderRadius: 2
            }}
          >
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
                Sign Up
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Join the HopeBridge community
              </Typography>
            </Box>
            
            <SocialLogin 
              onSocialLoginSuccess={handleSocialLoginSuccess}
              mode="signup"
            />
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    name="first_name"
                    autoComplete="given-name"
                    autoFocus
                    value={formData.first_name}
                    onChange={handleChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    autoComplete="family-name"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                  />
                </Grid>
              </Grid>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                autoComplete="new-password"
                value={formData.confirm_password}
                onChange={handleChange}
                error={!!errors.confirm_password}
                helperText={errors.confirm_password}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    name="agree_terms"
                    checked={formData.agree_terms}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link component={RouterLink} to="/terms" underline="hover">
                      Terms and Conditions
                    </Link>
                  </Typography>
                }
                sx={{ mt: 2 }}
              />
              {errors.agree_terms && (
                <Typography variant="caption" color="error">
                  {errors.agree_terms}
                </Typography>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    variant="body2"
                    fontWeight="bold"
                    underline="hover"
                  >
                    Log In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            variant="filled"
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default SignUp; 