import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Divider,
  useTheme,
  CardActions,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { giftCardService } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const AmountButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '80px',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  fontWeight: selected ? 'bold' : 'normal',
  backgroundColor: selected ? theme.palette.primary.light : 'transparent',
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.action.hover,
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1740&auto=format&fit=crop")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const GiftCardsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const theme = useTheme();
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [selectedCardType, setSelectedCardType] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    senderName: currentUser ? currentUser.displayName || '' : '',
    senderEmail: currentUser ? currentUser.email || '' : '',
    recipientName: '',
    recipientEmail: '',
    message: '',
  });
  const [deliveryOption, setDeliveryOption] = useState('send_instantly');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  
  // Fetch gift card designs on component mount
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        const response = await giftCardService.getDesigns();
        setDesigns(response.data);
        if (response.data.length > 0) {
          setSelectedDesign(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching gift card designs:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load gift card designs. Please try again later.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDesigns();
  }, []);
  
  // Handle amount selection
  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };
  
  // Handle custom amount change
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) > 0)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle card type selection
  const handleCardTypeChange = (e) => {
    setSelectedCardType(e.target.value);
  };
  
  // Handle delivery option change
  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Create cart item for the gift card
      const cartItem = {
        type: 'gift_card',
        amount: selectedAmount || parseFloat(customAmount),
        cardType: selectedCardType,
        details: {
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          recipientName: formData.recipientName,
          recipientEmail: formData.recipientEmail,
          message: formData.message,
          deliveryOption,
          ...(deliveryOption === 'schedule_delivery' && {
            scheduledDate,
            scheduledTime
          })
        }
      };
      
      // Add to cart
      await addToCart(cartItem);
      
      // Navigate to cart page
      navigate('/cart');
      
    } catch (error) {
      console.error('Error adding gift card to cart:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add gift card to cart. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Check if form is valid
  const isFormValid = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    const isValidAmount = amount > 0;
    const isValidDelivery = deliveryOption === 'send_instantly' || 
      (deliveryOption === 'schedule_delivery' && scheduledDate && scheduledTime);
    
    return (
      selectedCardType &&
      isValidAmount &&
      isValidDelivery &&
      formData.senderName.trim() !== '' &&
      formData.senderEmail.trim() !== '' &&
      formData.recipientName.trim() !== '' &&
      formData.recipientEmail.trim() !== ''
    );
  };
  
  // Render loading state
  if (loading && designs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  const giftCardTypes = [
    {
      id: 1,
      title: 'Birthday Gift Card',
      description: 'Make their special day even more meaningful with a donation in their name.',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1740&auto=format&fit=crop',
      minAmount: 25
    },
    {
      id: 2,
      title: 'Holiday Gift Card',
      description: 'Spread joy and make a difference during the holiday season.',
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1740&auto=format&fit=crop',
      minAmount: 25
    },
    {
      id: 3,
      title: 'Thank You Gift Card',
      description: 'Show your gratitude while supporting important causes.',
      image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=1470&auto=format&fit=crop',
      minAmount: 25
    },
    {
      id: 4,
      title: 'Corporate Gift Card',
      description: 'Perfect for employee recognition and client appreciation.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1740&auto=format&fit=crop',
      minAmount: 50
    }
  ];

  const featuredCauses = [
    {
      id: 1,
      title: 'Education for All',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1740&auto=format&fit=crop',
      description: 'Support education initiatives worldwide'
    },
    {
      id: 2,
      title: 'Environmental Conservation',
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?q=80&w=1740&auto=format&fit=crop',
      description: 'Help protect our planet'
    },
    {
      id: 3,
      title: 'Healthcare Access',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1740&auto=format&fit=crop',
      description: 'Provide medical care to those in need'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Gift Cards for Good
          </Typography>
          <Typography variant="h5" paragraph>
            Give the gift of giving - let them choose the cause they care about most
          </Typography>
        </Container>
      </HeroSection>

      {/* Gift Card Types Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Choose Your Gift Card
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {giftCardTypes.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={card.image}
                  alt={card.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                    Starting from ${card.minAmount}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => {
                      setSelectedCardType('digital');
                      setSelectedAmount(card.minAmount);
                      setCustomAmount('');
                      // Scroll to gift card options
                      document.getElementById('gift-card-options').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                  >
                    Select
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1740&auto=format&fit=crop"
                  alt="Choose a Gift Card"
                  sx={{ mb: 2, borderRadius: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  1. Choose a Gift Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select from our range of themed gift cards
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image="https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1740&auto=format&fit=crop"
                  alt="Personalize Message"
                  sx={{ mb: 2, borderRadius: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  2. Personalize It
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your personal message and recipient details
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image="https://images.unsplash.com/photo-1593526613712-7b4b9a707330?q=80&w=1740&auto=format&fit=crop"
                  alt="Send Gift Card"
                  sx={{ mb: 2, borderRadius: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  3. Send It
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose to send it now or schedule for later
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Causes Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Featured Causes
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Recipients can choose from these and many more causes
        </Typography>
        <Grid container spacing={4}>
          {featuredCauses.map((cause) => (
            <Grid item xs={12} md={4} key={cause.id}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={cause.image}
                  alt={cause.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {cause.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cause.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Gift card options */}
      <Grid container spacing={4} id="gift-card-options">
        <Grid item xs={12} sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={selectedCardType}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setSelectedCardType(newValue);
              }
            }}
            aria-label="gift card type"
          >
            <ToggleButton value="digital" aria-label="digital gift card">
              Digital Gift Card
            </ToggleButton>
            <ToggleButton value="print" aria-label="print at home">
              Print at Home
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        
        {/* Digital Gift Card */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              height: '100%', 
              p: 3,
              border: selectedCardType === 'digital' ? 2 : 1,
              borderColor: selectedCardType === 'digital' ? 'primary.main' : 'divider',
            }}
          >
            <Box 
              sx={{ 
                height: 180, 
                mb: 2, 
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image="https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=1740&auto=format&fit=crop"
                alt="Digital Gift Card"
                sx={{
                  objectFit: 'cover',
                  filter: selectedCardType === 'digital' ? 'none' : 'grayscale(100%)',
                  transition: 'filter 0.3s ease-in-out',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                }}
              >
                <Typography variant="h5">Digital Gift Card</Typography>
              </Box>
            </Box>
            
            {/* Amount options */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[25, 50, 100].map((amount) => (
                <Grid item xs={12} key={amount}>
                  <Paper 
                    elevation={selectedCardType === 'digital' && selectedAmount === amount ? 3 : 1}
                    sx={{ 
                      p: 2, 
                      border: selectedCardType === 'digital' && selectedAmount === amount ? 2 : 1,
                      borderColor: selectedCardType === 'digital' && selectedAmount === amount ? 'primary.main' : 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">£{amount}</Typography>
                      <Button 
                        variant={selectedCardType === 'digital' && selectedAmount === amount ? 'contained' : 'outlined'}
                        onClick={() => {
                          setSelectedCardType('digital');
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                      >
                        Select
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {/* Custom amount */}
            <Typography variant="body2" align="center" gutterBottom>
              Custom Amount
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <TextField
                placeholder="Enter amount"
                value={selectedCardType === 'digital' ? customAmount : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (/^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) > 0)) {
                    setCustomAmount(value);
                    if (value !== '') {
                      setSelectedCardType('digital');
                      setSelectedAmount(null);
                    }
                  }
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">£</InputAdornment>,
                }}
                sx={{ maxWidth: '300px' }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Print at Home */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              height: '100%', 
              p: 3,
              border: selectedCardType === 'print' ? 2 : 1,
              borderColor: selectedCardType === 'print' ? 'primary.main' : 'divider',
            }}
          >
            <Box 
              sx={{ 
                height: 180, 
                mb: 2, 
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image="https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1740&auto=format&fit=crop"
                alt="Print at Home Gift Card"
                sx={{
                  objectFit: 'cover',
                  filter: selectedCardType === 'print' ? 'none' : 'grayscale(100%)',
                  transition: 'filter 0.3s ease-in-out',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                }}
              >
                <Typography variant="h5">Print at Home</Typography>
              </Box>
            </Box>
            
            {/* Amount options */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[25, 50, 100].map((amount) => (
                <Grid item xs={12} key={amount}>
                  <Paper 
                    elevation={selectedCardType === 'print' && selectedAmount === amount ? 3 : 1}
                    sx={{ 
                      p: 2, 
                      border: selectedCardType === 'print' && selectedAmount === amount ? 2 : 1,
                      borderColor: selectedCardType === 'print' && selectedAmount === amount ? 'primary.main' : 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">£{amount}</Typography>
                      <Button 
                        variant={selectedCardType === 'print' && selectedAmount === amount ? 'contained' : 'outlined'}
                        onClick={() => {
                          setSelectedCardType('print');
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                      >
                        Select
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {/* Custom amount */}
            <Typography variant="body2" align="center" gutterBottom>
              Custom Amount
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <TextField
                placeholder="Enter amount"
                value={selectedCardType === 'print' ? customAmount : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (/^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) > 0)) {
                    setCustomAmount(value);
                    if (value !== '') {
                      setSelectedCardType('print');
                      setSelectedAmount(null);
                    }
                  }
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">£</InputAdornment>,
                }}
                sx={{ maxWidth: '300px' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Delivery options */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Delivery Options
        </Typography>
        <Paper elevation={1} sx={{ p: 3 }}>
          <RadioGroup
            value={deliveryOption}
            onChange={handleDeliveryOptionChange}
          >
            <FormControlLabel 
              value="send_instantly" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="subtitle1">Send Instantly</Typography>
                  <Typography variant="body2" color="text.secondary">Deliver immediately via email</Typography>
                </Box>
              } 
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel 
              value="schedule_delivery" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="subtitle1">Schedule Delivery</Typography>
                  <Typography variant="body2" color="text.secondary">Choose a future date and time</Typography>
                </Box>
              } 
            />
          </RadioGroup>

          {/* Schedule delivery options */}
          {deliveryOption === 'schedule_delivery' && (
            <Box sx={{ mt: 2, pl: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Delivery Date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Delivery Time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
      
      {/* Personalization form */}
      <Box sx={{ mt: 6, mb: 8 }}>
        <Typography variant="h5" gutterBottom>
          Personalize Your Gift
        </Typography>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                From
              </Typography>
              <TextField
                fullWidth
                label="Your Name"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Your Email"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleInputChange}
                margin="normal"
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                To
              </Typography>
              <TextField
                fullWidth
                label="Recipient's Name"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Recipient's Email"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                margin="normal"
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Message (Optional)"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
                placeholder="Enter a personal message to be included with your gift card."
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                disabled={!isFormValid() || loading}
                sx={{ minWidth: '200px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Continue to Payment'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GiftCardsPage; 