import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Radio,
  RadioGroup,
  FormLabel,
  InputAdornment,
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import PaymentIcon from '@mui/icons-material/Payment';
import PublicIcon from '@mui/icons-material/Public';

// Initialize Stripe with the provided key
const stripePromise = loadStripe("pk_test_51QHsF0G1gQ9FCYqU9uxmuDnYM7j2JHHsatURg9MoIuU9fTtpQIxBkY3loT8upksRxJcrg0m4dnkmWEg9lz4QhisR00dVkROIrX");

// Default currency options
const currencyOptions = [
  { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (GBP)', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen (JPY)', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar (CAD)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (AUD)', symbol: 'A$' }
];

// CurrencySelector component
const CurrencySelector = ({ selectedCurrency, onChange, exchangeRates, loading }) => {
  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
      <InputLabel id="currency-select-label">Select Your Currency</InputLabel>
      <Select
        labelId="currency-select-label"
        id="currency-select"
        value={selectedCurrency}
        onChange={onChange}
        label="Select Your Currency"
        startAdornment={
          <InputAdornment position="start">
            <PublicIcon />
          </InputAdornment>
        }
      >
        {currencyOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>{option.label}</span>
              {loading ? (
                <CircularProgress size={16} />
              ) : (
                exchangeRates[option.value] && (
                  <Typography variant="body2" color="text.secondary">
                    1 USD = {exchangeRates[option.value].toFixed(4)} {option.value}
                  </Typography>
                )
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Credit/Debit Card Form with Stripe
const CreditDebitForm = ({ onSuccess, onError, processing, setProcessing, selectedCurrency, exchangeRates }) => {
  const { currentUser } = useAuth();
  const { clearCart, getCartTotal, isRecurring, recurringFrequency } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(currentUser?.email || '');
  const [name, setName] = useState(currentUser?.displayName || '');
  
  // Get the appropriate currency symbol
  const getCurrencySymbol = (currency) => {
    const option = currencyOptions.find(opt => opt.value === currency);
    return option ? option.symbol : '$';
  };
  
  // Convert amount based on selected currency
  const convertAmount = (amount, toCurrency) => {
    if (!exchangeRates || !exchangeRates[toCurrency]) {
      return amount; // Return original amount if rates aren't available
    }
    return amount * exchangeRates[toCurrency];
  };
  
  const baseAmount = getCartTotal();
  const convertedAmount = convertAmount(baseAmount, selectedCurrency);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
          email: email,
        },
      });
      
      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Check if backend server is running before attempting API call
      try {
        let backendAvailable = false;
        
        // Only attempt to ping health check endpoint if not on localhost (as it may not exist yet)
        if (window.location.hostname !== 'localhost' && process.env.NODE_ENV !== 'development') {
          try {
            // Try to ping backend health check endpoint with short timeout
            await axios.get('/api/health-check/', { timeout: 2000 });
            backendAvailable = true;
          } catch (healthCheckError) {
            console.log('Health check failed, proceeding with caution:', healthCheckError.message);
            // Continue anyway and let the main API call attempt to work
          }
        } else {
          // Skip health check in development mode
          console.log('Skipping health check in development environment');
          backendAvailable = false;
        }
        
        // Only attempt the real API call if the backend is available or we're not in development
        if (backendAvailable || (process.env.NODE_ENV !== 'development' && window.location.hostname !== 'localhost')) {
          // Set a timeout of 10 seconds for the API call
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          // Create payment intent through your backend
          const { data } = await axios.post('/api/donations/create-payment-intent/', {
            amount: convertedAmount,
            currency: selectedCurrency,
            payment_method_id: paymentMethod.id,
            is_recurring: isRecurring,
            recurring_frequency: isRecurring ? recurringFrequency : null,
            email: email,
            name: name,
            // Include original amount for proper recipient processing
            original_amount_usd: baseAmount,
            exchange_rate: exchangeRates[selectedCurrency] || 1
          }, { 
            signal: controller.signal,
            timeout: 10000
          });
          
          clearTimeout(timeoutId);
          
          // Handle additional actions like 3D Secure
          if (data.requires_action) {
            const { error } = await stripe.handleCardAction(data.payment_intent_client_secret);
            if (error) {
              throw new Error(error.message);
            }
          }
          
          // Payment was successful
          clearCart();
          onSuccess([data.payment_id || 'stripe_payment_' + Date.now()]);
        } else {
          // In development, skip the API call and use the fallback
          throw new Error('Development environment detected - using fallback');
        }
      } catch (apiError) {
        // Check if error is because of timeout
        const isTimeout = apiError.code === 'ECONNABORTED' || 
                         apiError.message.includes('timeout') || 
                         apiError.message.includes('aborted');
        
        if (isTimeout) {
          console.log('API timeout - using development fallback');
        } else {
          console.log(`API Error: ${apiError.message} - using development fallback`);
        }
        
        // In development environment, simulate successful payment
        // For production, this would be an error
        if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
          console.log('Using development fallback for payment processing');
          // Simulate success after a short delay
          clearCart();
          onSuccess(['dev_stripe_payment_' + Date.now()]);
        } else {
          throw new Error('Payment processing service is currently unavailable. Please try again later.');
        }
      }
      
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
      onError(err.message);
      setProcessing(false);
    } finally {
      setProcessing(false);
    }
  };
  
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Credit/Debit Card
        </Typography>
        
        {!currentUser && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
        )}
        
        <Box mt={3} sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
          <CardElement options={cardElementOptions} />
        </Box>
        
        <Box mt={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <LockIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Your payment information is encrypted and secure.
          </Typography>
        </Box>
      </Box>
      
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={processing || !stripe}
        sx={{ 
          py: 1.5, 
          backgroundColor: '#4CAF50',
          '&:hover': {
            backgroundColor: '#388E3C',
          }
        }}
      >
        {processing ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Pay ${convertedAmount.toLocaleString('en-US', { style: 'currency', currency: selectedCurrency })}`
        )}
      </Button>
      
      {/* Conversion information */}
      {selectedCurrency !== 'USD' && (
        <Box mt={2} p={1} sx={{ backgroundColor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            You'll be charged {convertedAmount.toLocaleString('en-US', { style: 'currency', currency: selectedCurrency })}.
            The recipient will receive {baseAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.
          </Typography>
        </Box>
      )}
      
      {/* Test card information */}
      <Box mt={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          For testing, use these card details:
        </Typography>
        <Typography variant="body2">Card number: 4242 4242 4242 4242</Typography>
        <Typography variant="body2">Expiry: Any future date (MM/YY)</Typography>
        <Typography variant="body2">CVC: Any 3 digits</Typography>
        <Typography variant="body2">ZIP: Any 5 digits</Typography>
      </Box>
    </form>
  );
};

// Other Payment Methods
const OtherPaymentForm = ({ onSuccess, onError, processing, setProcessing, selectedCurrency }) => {
  const { clearCart, getCartTotal } = useCart();
  const [paymentType, setPaymentType] = useState('bank_transfer');
  
  const handleOtherPaymentSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    
    try {
      // Simulate other payment method
      setTimeout(() => {
        clearCart();
        onSuccess([`${paymentType}_payment_` + Date.now()]);
        setProcessing(false);
      }, 1500);
    } catch (err) {
      onError(err.message);
      setProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleOtherPaymentSubmit}>
      <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend">Select Payment Method</FormLabel>
        <RadioGroup
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <FormControlLabel value="bank_transfer" control={<Radio />} label="Bank Transfer" />
          <FormControlLabel value="crypto" control={<Radio />} label="Cryptocurrency" />
          <FormControlLabel value="check" control={<Radio />} label="Check" />
        </RadioGroup>
      </FormControl>
      
      {paymentType === 'bank_transfer' && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>Bank Name: HopeBridge Foundation</Typography>
          <Typography variant="body2" gutterBottom>Account Number: XXXX-XXXX-XXXX-1234</Typography>
          <Typography variant="body2" gutterBottom>Routing Number: XXX-XXX-XXX</Typography>
          <Typography variant="body2" gutterBottom>SWIFT/BIC: HBFXUSXX</Typography>
        </Box>
      )}
      
      {paymentType === 'crypto' && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>Bitcoin Address: 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5</Typography>
          <Typography variant="body2" gutterBottom>Ethereum Address: 0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7</Typography>
        </Box>
      )}
      
      {paymentType === 'check' && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>Make checks payable to: HopeBridge Foundation</Typography>
          <Typography variant="body2" gutterBottom>Mail to: 123 Hope Street, Charity City, CH 12345</Typography>
        </Box>
      )}
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={processing}
        sx={{ py: 1.5 }}
      >
        {processing ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Confirm Payment'
        )}
      </Button>
    </form>
  );
};

// Main Checkout Page
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getTotalItems, isRecurring, recurringFrequency } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_debit');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Prevent accessing checkout with empty cart
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      
      try {
        // Attempt to fetch from backend API
        let ratesData = {};
        
        try {
          // Try to fetch from our backend first
          const { data } = await axios.get('/api/donations/exchange-rates/refresh/');
          
          if (data.success && data.rates) {
            // Convert API response to our format
            data.rates.forEach(rate => {
              ratesData[rate.target_currency] = rate.rate;
            });
            
            console.log('Fetched exchange rates from backend:', ratesData);
          } else {
            throw new Error('Invalid response format from backend');
          }
        } catch (apiError) {
          console.log('Could not fetch from backend, using fallback API:', apiError.message);
          
          // Fallback to a public API
          const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          
          if (response.data && response.data.rates) {
            ratesData = response.data.rates;
            console.log('Fetched exchange rates from public API:', ratesData);
          }
        }
        
        // If we still don't have rates, use defaults
        if (Object.keys(ratesData).length === 0) {
          console.log('Using default exchange rates');
          ratesData = {
            USD: 1.0,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.32,
            CAD: 1.25,
            AUD: 1.33
          };
        }
        
        setExchangeRates(ratesData);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Use fallback values if API call fails
        setExchangeRates({
          USD: 1.0,
          EUR: 0.85,
          GBP: 0.73,
          JPY: 110.32,
          CAD: 1.25,
          AUD: 1.33
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchExchangeRates();
  }, []);
  
  const handleSuccess = (paymentIds) => {
    // Collect projectIds and complete project data from cart items that are donations
    const projectData = cartItems
      .filter(item => item.type === 'donation' && item.projectId)
      .map(item => ({
        projectId: item.projectId,
        amount: item.price * item.quantity,
        name: item.name,
        image: item.image,
        description: item.description
      }));
    
    console.log('Project data for payment success:', projectData);
    
    // If there are multiple projects, use the first one's ID for now
    // In a real app, we would track all project donations separately
    const firstProject = projectData.length > 0 ? projectData[0] : null;
    const projectId = firstProject ? firstProject.projectId : null;
    
    navigate('/payment-success', { 
      state: { 
        paymentIds, 
        amount: getCartTotal(), 
        currency: selectedCurrency,
        isRecurring,
        recurringFrequency,
        projectId,
        projectData,
        // Include project name and image directly for easier access
        projectName: firstProject ? firstProject.name : null,
        projectImage: firstProject ? firstProject.image : null,
        // Include currency conversion details if applicable
        originalAmountUsd: selectedCurrency !== 'USD' ? baseAmount : null,
        exchangeRate: selectedCurrency !== 'USD' ? exchangeRates[selectedCurrency] : null
      } 
    });
  };
  
  const handleError = (message) => {
    setError(message);
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };
  
  // Calculate converted amount based on selected currency
  const convertAmount = (amount, toCurrency) => {
    if (!exchangeRates || !exchangeRates[toCurrency]) {
      return amount; // Return original amount if rates aren't available
    }
    return amount * exchangeRates[toCurrency];
  };
  
  const baseAmount = getCartTotal();
  const convertedAmount = convertAmount(baseAmount, selectedCurrency);
  
  const renderPaymentForm = () => {
    const formProps = {
      onSuccess: handleSuccess,
      onError: handleError,
      processing,
      setProcessing,
      selectedCurrency,
      exchangeRates
    };
    
    switch (paymentMethod) {
      case 'credit_debit':
        return (
          <Elements stripe={stripePromise}>
            <CreditDebitForm {...formProps} />
          </Elements>
        );
      case 'other':
        return <OtherPaymentForm {...formProps} />;
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Secure Checkout
      </Typography>
      
      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
              </Typography>
              
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                  </Typography>
                  <Typography variant="body2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>
                ${getCartTotal().toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Fees:</Typography>
              <Typography>$0.00</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">
                {convertedAmount.toLocaleString('en-US', { style: 'currency', currency: selectedCurrency })}
              </Typography>
            </Box>
            
            {isRecurring && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You will be charged {recurringFrequency} until you cancel.
              </Typography>
            )}
            
            {/* Display conversion rate information if not USD */}
            {selectedCurrency !== 'USD' && !loading && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                1 USD = {exchangeRates[selectedCurrency]?.toFixed(4) || '—'} {selectedCurrency}
              </Typography>
            )}
            
            <Box sx={{ mt: 3 }}>
              <CurrencySelector
                selectedCurrency={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                exchangeRates={exchangeRates}
                loading={loading}
              />
            </Box>
          </Paper>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/cart')}
            sx={{ mt: 2 }}
          >
            Return to Cart
          </Button>
        </Grid>
        
        {/* Payment Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            {/* Payment Method Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box
                  onClick={() => setPaymentMethod('credit_debit')}
                  sx={{
                    border: '1px solid',
                    borderColor: paymentMethod === 'credit_debit' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    p: 2,
                    width: { xs: '100%', sm: 'calc(50% - 8px)' },
                    bgcolor: paymentMethod === 'credit_debit' ? 'action.selected' : 'background.paper',
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon sx={{ mr: 1 }} /> Credit/Debit Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pay securely with your card via Stripe
                  </Typography>
                </Box>
                
                <Box
                  onClick={() => setPaymentMethod('other')}
                  sx={{
                    border: '1px solid',
                    borderColor: paymentMethod === 'other' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    p: 2,
                    width: { xs: '100%', sm: 'calc(50% - 8px)' },
                    bgcolor: paymentMethod === 'other' ? 'action.selected' : 'background.paper',
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon sx={{ mr: 1 }} /> Other Payment Methods
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bank transfer, cryptocurrency, etc.
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Payment Form */}
            {renderPaymentForm()}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CheckoutPage; 