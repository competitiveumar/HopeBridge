import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { resetPassword } = useAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear any previous error or success message when user types
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    try {
      setIsSubmitting(true);
      await resetPassword(email);
      setSuccessMessage('Password reset link sent! Check your email inbox.');
      setEmail(''); // Clear the field after successful submission
    } catch (error) {
      console.error('Password reset error:', error);
      // Set appropriate error message based on error code
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ 
      py: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 64px)', // Adjust for your app's header height
    }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 2,
        width: '100%',
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Forgot Password
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
            EMAIL
          </Typography>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            variant="outlined"
            margin="normal"
            sx={{ 
              mb: 3,
              mt: 0,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#FAFAFA'
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              backgroundColor: '#BCCE4C',
              '&:hover': {
                backgroundColor: '#A8B943',
              },
              textTransform: 'uppercase',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              <Link component={RouterLink} to="/login" sx={{ color: 'text.secondary' }}>
                Back to Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage; 