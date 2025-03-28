import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  IconButton,
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Checkbox,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import LinearProgress from '@mui/material/LinearProgress';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

// Generate a unique ID for anonymous users
const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Development mode checkout form without Stripe dependencies
const CheckoutForm = ({ onSuccess, onError, processing, setProcessing }) => {
  const { currentUser } = useAuth();
  const { clearCart, getSubtotal } = useCart();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    
    try {
      // In development, just simulate a successful payment after a brief delay
      setTimeout(() => {
        clearCart();
        onSuccess(['mock_donation_id']);
        setProcessing(false);
      }, 1500);
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
      onError(err.message);
      setProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {!currentUser && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
      )}
      
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Payment Information (Development Mode)
        </Typography>
        <Box mb={2}>
          <TextField
            label="Card Number"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Expiry (MM/YY)"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVC"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </Grid>
          </Grid>
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
        disabled={processing}
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
          `Pay ${getSubtotal().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
        )}
      </Button>
    </form>
  );
};

// Gift Card Form component
const GiftCardForm = () => {
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const { addGiftCard } = useCart();
  const { currentUser } = useAuth();
  
  const handleApplyGiftCard = async () => {
    if (!code.trim()) return;
    
    setApplying(true);
    setError(null);
    
    try {
      // Get session ID for anonymous users
      const sessionId = getOrCreateSessionId();
      
      const { data } = await axios.post('/api/donations/cart/add_gift_card/', {
        gift_card_code: code,
        session_id: !currentUser ? sessionId : undefined,
      });
      
      addGiftCard({ code, amount: data.amount });
      setCode('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply gift card');
    } finally {
      setApplying(false);
    }
  };
  
  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Add a Gift Card
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={9}>
          <TextField
            label="Gift Card Code"
            variant="outlined"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={applying}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleApplyGiftCard}
            disabled={!code.trim() || applying}
            fullWidth
            sx={{ height: '56px' }}
          >
            {applying ? <CircularProgress size={24} /> : 'Apply'}
          </Button>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

// CartPage component
const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getSubtotal, 
    getTotalItems,
    isRecurring,
    recurringFrequency,
    toggleRecurring,
    setRecurringFrequency,
    giftCard,
    removeGiftCard
  } = useCart();
  const [error, setError] = useState(null);
  
  const handleError = (message) => {
    setError(message);
  };
  
  const handleCloseSnackbar = () => {
    setError(null);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // If cart is empty, show message
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Shopping Cart
        </Typography>
        <Paper elevation={2} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add some donations to your cart to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/donations')}
            sx={{ mt: 2 }}
          >
            Browse Charities
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Shopping Cart
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/donations')}
            sx={{ 
              backgroundColor: '#8BC34A',
              '&:hover': {
                backgroundColor: '#689F38'
              }
            }}
          >
            Browse Charities
          </Button>
          <Typography variant="subtitle1">
            {getTotalItems()} Items
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Cart Items */}
        <List>
          {cartItems.map((item) => (
            <ListItem 
              key={item.id} 
              divider
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => removeFromCart(item.id)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar 
                  alt={item.name} 
                  src={item.image || `https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1470&auto=format&fit=crop`}
                  variant="rounded"
                  sx={{ width: 60, height: 60, mr: 1 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {item.type === 'gift_card' ? 'Gift Card' : 'Donation'}
                    </Typography>
                    {` — ${item.description ? item.description.substring(0, 60) + '...' : 'No description'}`}
                  </>
                }
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 100 }}>
                <Typography variant="subtitle1" component="div">
                  £{(item.amount || item.price || 0).toFixed(2)}
                </Typography>
                {item.type === 'gift_card' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Button 
                      size="small" 
                      onClick={() => removeGiftCard(item.id)}
                      startIcon={<DeleteOutlineIcon />}
                    >
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      sx={{ width: 50, mx: 1, '& input': { p: 1 } }}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          updateQuantity(item.id, value);
                        }
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
        
        {/* Recurring Donation Option */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isRecurring}
                    onChange={toggleRecurring}
                    color="primary"
                  />
                }
                label="Make this a recurring donation"
              />
            </Grid>
            {isRecurring && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="recurring-frequency-label">Frequency</InputLabel>
                  <Select
                    labelId="recurring-frequency-label"
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value)}
                    label="Frequency"
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="annually">Annually</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Box>
        
        {/* Gift Card Form */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gift Card
          </Typography>
          <GiftCardForm />
        </Box>
        
        {/* Checkout Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                We accept the following payment methods:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box component="img" src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" sx={{ height: 30 }} />
                <Box component="img" src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" sx={{ height: 30 }} />
                <Box component="img" src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" sx={{ height: 30 }} />
                <Box component="img" src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" sx={{ height: 30 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                All transactions are secure and encrypted. Your information is protected by industry-standard SSL technology.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>
                  ${(getSubtotal() || 0).toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>Free</Typography>
              </Box>
              
              {giftCard && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Gift Card:</Typography>
                  <Typography color="error">
                    -${Math.min(giftCard.amount || 0, getSubtotal() || 0).toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">
                  ${Math.max(0, (getSubtotal() || 0) - ((giftCard?.amount || 0))).toFixed(2)}
                </Typography>
              </Box>
              
              {isRecurring && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  You will be charged {recurringFrequency} until you cancel.
                </Typography>
              )}
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleCheckout}
                startIcon={<ShoppingCartCheckoutIcon />}
                disabled={cartItems.length === 0}
                sx={{ 
                  mt: 3,
                  py: 1.5, 
                  backgroundColor: '#4CAF50',
                  '&:hover': {
                    backgroundColor: '#388E3C',
                  }
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage; 