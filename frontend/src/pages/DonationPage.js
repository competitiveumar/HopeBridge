import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const DonationPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [donationAmount, setDonationAmount] = useState('25');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('general');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [donationComplete, setDonationComplete] = useState(false);

  const donationTypes = [
    { value: 'general', label: 'General Fund', icon: <FavoriteIcon color="primary" /> },
    { value: 'education', label: 'Education', icon: <SchoolIcon color="primary" /> },
    { value: 'healthcare', label: 'Healthcare', icon: <LocalHospitalIcon color="primary" /> },
    { value: 'housing', label: 'Housing', icon: <HomeIcon color="primary" /> },
    { value: 'food', label: 'Food Security', icon: <RestaurantIcon color="primary" /> },
  ];

  const steps = ['Donation Amount', 'Personal Information', 'Payment Details', 'Confirmation'];

  const handleDonationAmountChange = (event) => {
    setDonationAmount(event.target.value);
    if (event.target.value === 'custom') {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (event) => {
    setCustomAmount(event.target.value);
  };

  const handleDonationTypeChange = (event) => {
    setDonationType(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
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
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (donationAmount === 'custom' && (!customAmount || parseFloat(customAmount) <= 0)) {
        newErrors.customAmount = 'Please enter a valid donation amount';
      }
    } else if (activeStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    } else if (activeStep === 2) {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardName) newErrors.cardName = 'Name on card is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        // Process donation (would integrate with payment processor in real app)
        setDonationComplete(true);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Donation Amount
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
              <RadioGroup
                aria-label="donation-amount"
                name="donation-amount"
                value={donationAmount}
                onChange={handleDonationAmountChange}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <FormControlLabel
                      value="10"
                      control={<Radio />}
                      label="$10"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControlLabel
                      value="25"
                      control={<Radio />}
                      label="$25"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControlLabel
                      value="50"
                      control={<Radio />}
                      label="$50"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControlLabel
                      value="100"
                      control={<Radio />}
                      label="$100"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      value="custom"
                      control={<Radio />}
                      label="Custom Amount"
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>

            {donationAmount === 'custom' && (
              <TextField
                fullWidth
                margin="normal"
                id="custom-amount"
                label="Enter amount"
                type="number"
                variant="outlined"
                value={customAmount}
                onChange={handleCustomAmountChange}
                error={!!errors.customAmount}
                helperText={errors.customAmount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Select Donation Type
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                aria-label="donation-type"
                name="donation-type"
                value={donationType}
                onChange={handleDonationTypeChange}
              >
                <Grid container spacing={2}>
                  {donationTypes.map((type) => (
                    <Grid item xs={12} sm={6} key={type.value}>
                      <Paper
                        elevation={donationType === type.value ? 3 : 1}
                        sx={{
                          p: 2,
                          border: donationType === type.value ? 2 : 1,
                          borderColor: donationType === type.value ? 'primary.main' : 'divider',
                          borderRadius: 2,
                        }}
                      >
                        <FormControlLabel
                          value={type.value}
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {type.icon}
                              <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                            </Box>
                          }
                          sx={{ width: '100%' }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First name"
                  fullWidth
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  fullWidth
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Email address"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  variant="outlined"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  variant="outlined"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="state"
                  name="state"
                  label="State/Province/Region"
                  fullWidth
                  variant="outlined"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="zipCode"
                  name="zipCode"
                  label="Zip / Postal code"
                  fullWidth
                  variant="outlined"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="country"
                  name="country"
                  label="Country"
                  fullWidth
                  variant="outlined"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="cardName"
                  name="cardName"
                  label="Name on card"
                  fullWidth
                  variant="outlined"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  error={!!errors.cardName}
                  helperText={errors.cardName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="cardNumber"
                  name="cardNumber"
                  label="Card number"
                  fullWidth
                  variant="outlined"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="expiryDate"
                  name="expiryDate"
                  label="Expiry date (MM/YY)"
                  fullWidth
                  variant="outlined"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="cvv"
                  name="cvv"
                  label="CVV"
                  fullWidth
                  variant="outlined"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Donation Summary
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Donation Amount:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      ${donationAmount === 'custom' ? customAmount : donationAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Donation Type:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      {donationTypes.find((type) => type.value === donationType)?.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Donor Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      {formData.firstName} {formData.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      {formData.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      Credit Card ending in {formData.cardNumber.slice(-4)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Typography variant="body2" color="text.secondary" paragraph>
              By clicking "Complete Donation", you agree to our terms of service and privacy policy.
              Your donation will be processed securely.
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {donationComplete ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <FavoriteIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Thank You for Your Donation!
          </Typography>
          <Typography variant="body1" paragraph>
            Your donation of ${donationAmount === 'custom' ? customAmount : donationAmount} to our{' '}
            {donationTypes.find((type) => type.value === donationType)?.label} fund has been processed successfully.
          </Typography>
          <Typography variant="body1" paragraph>
            A receipt has been sent to {formData.email}.
          </Typography>
          <Alert severity="success" sx={{ mt: 2, mb: 4 }}>
            Your contribution will make a real difference in the lives of those we serve.
          </Alert>
          <Button variant="contained" color="primary" href="/">
            Return to Home
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Make a Donation
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
            Your generosity helps us continue our mission to support those in need.
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper sx={{ p: 3, mb: 4 }}>
            {getStepContent(activeStep)}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mt: 3, ml: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{ mt: 3, ml: 1 }}
            >
              {activeStep === steps.length - 1 ? 'Complete Donation' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default DonationPage; 