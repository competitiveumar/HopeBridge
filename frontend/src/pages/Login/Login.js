import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { login, socialAuth } from '../../services/authService';
import SocialLogin from '../../components/SocialLogin/SocialLogin';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || 'Login failed. Please check your credentials.',
        severity: 'error'
      });
    } finally {
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
      
      console.log('Social login success, user data:', userData);
      
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
        message: 'Login successful! Redirecting to dashboard...',
        severity: 'success'
      });
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Social login failed:', error);
      setAlert({
        open: true,
        message: error.message || `Social login with ${provider} failed. Please try again.`,
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
        <title>Login | HopeBridge</title>
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
                Log In
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Welcome back to HopeBridge
              </Typography>
            </Box>
            
            <SocialLogin 
              onSocialLoginSuccess={handleSocialLoginSuccess}
              mode="login"
            />
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              
              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Link 
                  component={RouterLink} 
                  to="/forgot-password" 
                  variant="body2"
                  underline="hover"
                >
                  Forgot password?
                </Link>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Log In'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/signup" 
                    variant="body2"
                    fontWeight="bold"
                    underline="hover"
                  >
                    Sign Up
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

export default Login; 