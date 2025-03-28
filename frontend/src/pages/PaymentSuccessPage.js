import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { format } from 'date-fns';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentInfo = location.state || {};
  
  // Redirect to home page if page is accessed directly without payment info
  useEffect(() => {
    if (!paymentInfo.paymentIds) {
      navigate('/');
    }
  }, [navigate, paymentInfo]);
  
  if (!paymentInfo.paymentIds) {
    return null;
  }
  
  const paymentDate = new Date();
  const formattedDate = format(paymentDate, "MMMM dd, yyyy");
  const formattedTime = format(paymentDate, "hh:mm a");
  
  // Generate a reference number based on payment ID and timestamp
  const referenceNumber = `HB-${paymentDate.getTime().toString().substring(5)}`;
  
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 4 
        }}
      >
        <CheckCircleOutlineIcon 
          color="success" 
          sx={{ fontSize: 80, mb: 2 }} 
        />
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary">
          Thank you for your donation. Your contribution makes a difference.
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Transaction Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Transaction Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formattedDate}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Transaction Time
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formattedTime}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Reference Number
            </Typography>
            <Typography variant="body1" gutterBottom>
              {referenceNumber}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body1" gutterBottom>
              {paymentInfo.amount?.toLocaleString('en-US', { 
                style: 'currency', 
                currency: paymentInfo.currency || 'USD' 
              })}
            </Typography>
          </Grid>
          
          {paymentInfo.isRecurring && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Payment Schedule
              </Typography>
              <Typography variant="body1" gutterBottom>
                Recurring {paymentInfo.recurringFrequency}
              </Typography>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Payment Method
            </Typography>
            <Typography variant="body1" gutterBottom>
              {paymentInfo.paymentIds[0]?.includes('stripe') 
                ? 'Credit/Debit Card' 
                : paymentInfo.paymentIds[0]?.includes('paypal')
                  ? 'PayPal'
                  : 'Alternative Payment Method'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        A confirmation has been sent to your email address. Please check your inbox.
      </Alert>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')} 
          sx={{ minWidth: 150 }}
        >
          Return Home
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/donations')} 
          sx={{ minWidth: 150 }}
        >
          Donate Again
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentSuccessPage; 