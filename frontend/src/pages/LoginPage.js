import React, { useState } from 'react';
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
  Avatar,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useAuth } from '../contexts/AuthContext';

// Copyright component
const Copyright = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" component={RouterLink} to="/">
        HopeBridge
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    // Clear login error when user types
    if (loginError) {
      setLoginError('');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
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
    if (validateForm()) {
      try {
        setLoginError('');
        setLoading(true);
        // Call the login function from AuthContext
        await login(formData.email, formData.password);
        
        // Redirect to home page on successful login
        navigate('/');
      } catch (error) {
        console.error('Login error:', error);
        // Set a user-friendly error message based on error code
        const errorCode = error.code || '';
        
        if (errorCode === 'auth/configuration-not-found') {
          setLoginError('Firebase configuration error. Please make sure Firebase is properly set up.');
          console.error('Firebase project not found. Check your configuration and make sure the project exists.');
        } else if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
          setLoginError('Invalid email or password');
        } else if (errorCode === 'auth/user-not-found') {
          setLoginError('No account found with this email');
        } else if (errorCode === 'auth/too-many-requests') {
          setLoginError('Too many failed attempts. Please try again later');
        } else if (errorCode === 'auth/user-disabled') {
          setLoginError('This account has been disabled. Please contact support.');
        } else {
          setLoginError(error.message || 'An error occurred during login. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    if (provider === 'Google') {
      try {
        setLoginError('');
        await loginWithGoogle();
        navigate('/');
      } catch (error) {
        console.error('Google login error:', error);
        setLoginError('An error occurred during Google login. Please try again.');
      }
    } else if (provider === 'Facebook') {
      try {
        setLoginError('');
        await loginWithFacebook();
        navigate('/');
      } catch (error) {
        console.error('Facebook login error:', error);
        if (error.code === 'auth/account-exists-with-different-credential') {
          setLoginError('An account already exists with the same email address but different sign-in credentials. Try signing in a different way.');
        } else {
          setLoginError('An error occurred during Facebook login. Please try again.');
        }
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1631&auto=format&fit=crop")',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.grey[50],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {loginError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {loginError}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Or sign in with
              </Typography>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ mr: 2 }}
              >
                Google
              </Button>
              <Button
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin('Facebook')}
              >
                Facebook
              </Button>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage; 