import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Typography, Snackbar, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { signInWithGoogle, signInWithFacebook, handleRedirectResult } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Styled components
const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1.2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '0.9rem',
}));

const GoogleButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#757575',
  border: '1px solid #dadce0',
  '&:hover': {
    backgroundColor: '#f1f3f4',
    border: '1px solid #dadce0',
  },
}));

const FacebookButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#1877F2',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#166fe5',
  },
}));

const OrDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(2, 0),
}));

const SocialLogin = ({ onSocialLoginSuccess, mode = 'login' }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'error' });
  const [loading, setLoading] = useState({ google: false, facebook: false });

  // Check for redirect result on component mount (for handling mobile browsers)
  useEffect(() => {
    const checkRedirectResult = async () => {
      const result = await handleRedirectResult();
      if (result && result.success) {
        if (onSocialLoginSuccess) {
          onSocialLoginSuccess(result.user);
        }
      } else if (result && !result.success) {
        setAlert({
          open: true,
          message: result.error || 'Authentication failed. Please try again.',
          severity: 'error'
        });
      }
    };
    
    checkRedirectResult();
  }, [onSocialLoginSuccess]);

  const handleSocialLogin = async (provider) => {
    try {
      // Set loading state for the specific provider
      setLoading({ ...loading, [provider]: true });
      
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else {
        result = await signInWithFacebook();
      }
      
      if (result.success) {
        // Clear any previous errors
        setAlert({ open: false, message: '', severity: 'success' });
        
        // Pass the user data to the parent component
        if (onSocialLoginSuccess) {
          await onSocialLoginSuccess(result.user);
        } else {
          navigate('/dashboard');
        }
      } else {
        // Show error message from Firebase
        const errorMessage = getErrorMessage(result.errorCode) || result.error;
        setAlert({
          open: true,
          message: errorMessage || `${provider} login failed. Please try again.`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setAlert({
        open: true,
        message: error.message || 'Authentication failed. Please try again.',
        severity: 'error'
      });
    } finally {
      // Clear loading state
      setLoading({ ...loading, [provider]: false });
    }
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.';
      case 'auth/cancelled-popup-request':
        return 'The authentication popup was closed before completing the sign-in.';
      case 'auth/popup-blocked':
        return 'The authentication popup was blocked by the browser. Please enable popups for this site.';
      case 'auth/popup-closed-by-user':
        return 'The authentication popup was closed before completing the sign-in.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations for your Firebase project.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed. Contact support.';
      default:
        return null;
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <GoogleButton
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={() => handleSocialLogin('google')}
        disabled={loading.google || loading.facebook}
      >
        {loading.google ? 'Please wait...' : mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
      </GoogleButton>
      
      <FacebookButton
        variant="contained"
        startIcon={<FacebookIcon />}
        onClick={() => handleSocialLogin('facebook')}
        disabled={loading.google || loading.facebook}
      >
        {loading.facebook ? 'Please wait...' : mode === 'login' ? 'Continue with Facebook' : 'Sign up with Facebook'}
      </FacebookButton>
      
      <OrDivider>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </OrDivider>
      
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SocialLogin; 