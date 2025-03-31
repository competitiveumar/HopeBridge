import React, { useEffect, useRef } from 'react';
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
import { useDonation } from '../contexts/DonationContext';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentInfo = location.state || {};
  const { addSuccessfulDonation } = useDonation();
  const donationProcessed = useRef(false);
  
  // Redirect to home page if page is accessed directly without payment info
  useEffect(() => {
    if (!paymentInfo.paymentIds) {
      navigate('/');
      return;
    }
    
    // Only process the donation once to prevent infinite loop
    if (!donationProcessed.current && paymentInfo.projectId && paymentInfo.amount) {
      console.log('Processing donation for project:', paymentInfo.projectId, 'Amount:', paymentInfo.amount);
      console.log('Full payment info:', paymentInfo);
      donationProcessed.current = true;
      
      // Get project details directly from the navigation state if available
      const projectName = paymentInfo.projectName || null;
      const projectImage = paymentInfo.projectImage || null;
      
      console.log('Project details from navigation state:', {
        name: projectName,
        image: projectImage,
        projectId: paymentInfo.projectId
      });
      
      // Fallback: Try to get detailed project info from cartItems if not in navigation state
      let finalProjectName = projectName;
      let finalProjectImage = projectImage;
      
      if ((!finalProjectName || !finalProjectImage) && paymentInfo.projectData && paymentInfo.projectData.length > 0) {
        console.log('Looking up project details from projectData:', paymentInfo.projectData);
        
        // First try to get data directly from projectData
        const projectDataItem = paymentInfo.projectData.find(item => item.projectId === paymentInfo.projectId);
        if (projectDataItem) {
          finalProjectName = finalProjectName || projectDataItem.name;
          finalProjectImage = finalProjectImage || projectDataItem.image;
          console.log('Found project details in projectData:', { name: finalProjectName, image: finalProjectImage });
        }
        
        // Fallback to cart items if still not found
        if (!finalProjectName || !finalProjectImage) {
          const cartItem = JSON.parse(localStorage.getItem('cartItems') || '[]')
            .find(item => item.projectId === paymentInfo.projectId);
          
          if (cartItem) {
            finalProjectName = finalProjectName || cartItem.name;
            finalProjectImage = finalProjectImage || cartItem.image;
            console.log('Found project details from cart:', { name: finalProjectName, image: finalProjectImage });
          }
        }
      }
      
      // Create a unique donation record
      const donationRecord = {
        projectId: paymentInfo.projectId,
        amount: paymentInfo.amount,
        timestamp: new Date().toISOString(),
        paymentId: paymentInfo.paymentIds[0],
        currency: paymentInfo.currency || 'USD',
        isRecurring: paymentInfo.isRecurring || false,
        recurringFrequency: paymentInfo.recurringFrequency || null,
        name: finalProjectName, // Include project name in the donation record
        image: finalProjectImage,  // Include project image in the donation record
        // Add currency conversion information if applicable
        originalAmountUsd: paymentInfo.originalAmountUsd,
        exchangeRate: paymentInfo.exchangeRate
      };
      
      console.log('Adding donation record to context:', donationRecord);
      
      // Log the donation to ensure it's processed
      addSuccessfulDonation(donationRecord);
      
      // Store the fact that this payment was processed in localStorage
      // This prevents duplicates if user refreshes the success page
      const processedPayments = JSON.parse(localStorage.getItem('processedPayments') || '[]');
      processedPayments.push(paymentInfo.paymentIds[0]);
      localStorage.setItem('processedPayments', JSON.stringify(processedPayments));
    }
  }, [navigate, paymentInfo, addSuccessfulDonation]);
  
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
          
          {/* Display original USD amount if currency conversion was applied */}
          {paymentInfo.originalAmountUsd && paymentInfo.currency !== 'USD' && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Recipient Receives
              </Typography>
              <Typography variant="body1" gutterBottom>
                {paymentInfo.originalAmountUsd?.toLocaleString('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                })}
              </Typography>
            </Grid>
          )}
          
          {/* Display exchange rate if available */}
          {paymentInfo.exchangeRate && paymentInfo.currency !== 'USD' && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Exchange Rate
              </Typography>
              <Typography variant="body1" gutterBottom>
                1 USD = {paymentInfo.exchangeRate.toFixed(4)} {paymentInfo.currency}
              </Typography>
            </Grid>
          )}
          
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