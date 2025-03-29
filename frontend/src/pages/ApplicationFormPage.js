import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ApplicationFormPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Form validation schema
  const validationSchema = [
    // Step 1: Organization Information
    Yup.object({
      organizationName: Yup.string().required('Organization name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().matches(/^[0-9+-]+$/, 'Invalid phone number').required('Phone number is required'),
      website: Yup.string().url('Invalid URL').nullable(),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zipCode: Yup.string().required('ZIP code is required'),
    }),
    // Step 2: Organization Details
    Yup.object({
      organizationType: Yup.string().required('Organization type is required'),
      taxIdNumber: Yup.string().required('Tax ID number is required'),
      foundingYear: Yup.number()
        .required('Founding year is required')
        .min(1800, 'Year must be after 1800')
        .max(new Date().getFullYear(), `Year must be before or in ${new Date().getFullYear()}`),
      missionStatement: Yup.string().required('Mission statement is required'),
      description: Yup.string()
        .required('Organization description is required')
        .min(50, 'Description must be at least 50 characters'),
    }),
    // Step 3: Contact Information
    Yup.object({
      contactFirstName: Yup.string().required('First name is required'),
      contactLastName: Yup.string().required('Last name is required'),
      contactEmail: Yup.string().email('Invalid email address').required('Email is required'),
      contactPhone: Yup.string().matches(/^[0-9+-]+$/, 'Invalid phone number').required('Phone number is required'),
      contactPosition: Yup.string().required('Position is required'),
    }),
    // Step 4: Additional Information
    Yup.object({
      primaryFocusArea: Yup.string().required('Primary focus area is required'),
      secondaryFocusAreas: Yup.array().min(1, 'Select at least one secondary focus area'),
      annualBudget: Yup.string().required('Annual budget is required'),
      staffSize: Yup.number().required('Staff size is required').min(1, 'Staff size must be at least 1'),
      hasVolunteers: Yup.boolean(),
      volunteerCount: Yup.number().when('hasVolunteers', {
        is: true,
        then: () => Yup.number().required('Volunteer count is required').min(0, 'Volunteer count must be at least 0'),
        otherwise: () => Yup.number().nullable()
      }),
      additionalInformation: Yup.string(),
      agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
    }),
  ];

  // Form steps
  const steps = ['Organization Information', 'Organization Details', 'Contact Information', 'Additional Information'];

  // Initial form values
  const initialValues = {
    // Step 1: Organization Information
    organizationName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Step 2: Organization Details
    organizationType: '',
    taxIdNumber: '',
    foundingYear: '',
    missionStatement: '',
    description: '',
    
    // Step 3: Contact Information
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    contactPosition: '',
    
    // Step 4: Additional Information
    primaryFocusArea: '',
    secondaryFocusAreas: [],
    annualBudget: '',
    staffSize: '',
    hasVolunteers: false,
    volunteerCount: '',
    additionalInformation: '',
    agreeToTerms: false,
  };

  // Organization types
  const organizationTypes = [
    'Nonprofit Organization (501c3)',
    'Public Charity',
    'Private Foundation',
    'Social Enterprise',
    'Community Organization',
    'Educational Institution',
    'Religious Organization',
    'Other',
  ];

  // Focus areas
  const focusAreas = [
    'Education',
    'Health',
    'Environment',
    'Human Rights',
    'Poverty Alleviation',
    'Arts & Culture',
    'Disaster Relief',
    'Animal Welfare',
    'Community Development',
    'International Development',
    'Youth Development',
    'Women & Girls',
    'Refugees & Migration',
    'Technology',
    'Other',
  ];

  // Annual budget options
  const budgetRanges = [
    'Under $50,000',
    '$50,000 - $100,000',
    '$100,000 - $250,000',
    '$250,000 - $500,000',
    '$500,000 - $1 million',
    '$1 million - $5 million',
    '$5 million - $10 million',
    'Over $10 million',
  ];

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // In a real application, this would be an API call to the backend
      // const response = await axios.post('/api/applications/', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // First close any existing snackbar
      setSnackbar(prev => ({ ...prev, open: false }));
      
      // Then show the success message
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: 'Form submitted successfully',
          severity: 'success',
        });
        
        // Reset form after successful submission
        formik.resetForm();
        setActiveStep(0);
      }, 100);

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
      }, 3100);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setSnackbar({
        open: true,
        message: 'Error submitting application. Please try again later.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema[activeStep],
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        await handleSubmit(values);
      } else {
        setActiveStep(prevStep => prevStep + 1);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  // Handle step navigation
  const handleNext = () => {
    formik.validateForm().then(errors => {
      if (Object.keys(errors).length === 0) {
        if (activeStep === steps.length - 1) {
          formik.submitForm(); // Changed from handleSubmit to submitForm
        } else {
          setActiveStep(prevStep => prevStep + 1);
        }
      } else {
        // Trigger validation display
        Object.keys(errors).forEach(field => {
          formik.setFieldTouched(field, true);
        });
        formik.validateForm();
      }
    });
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Render form steps
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="organizationName"
                name="organizationName"
                label="Organization Name"
                value={formik.values.organizationName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.organizationName && Boolean(formik.errors.organizationName)}
                helperText={formik.touched.organizationName && formik.errors.organizationName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="website"
                name="website"
                label="Website"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.touched.website && formik.errors.website}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="state"
                name="state"
                label="State/Province"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="zipCode"
                name="zipCode"
                label="ZIP/Postal Code"
                value={formik.values.zipCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                helperText={formik.touched.zipCode && formik.errors.zipCode}
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.organizationType && Boolean(formik.errors.organizationType)}>
                <InputLabel id="organizationType-label" required>Organization Type</InputLabel>
                <Select
                  labelId="organizationType-label"
                  id="organizationType"
                  name="organizationType"
                  value={formik.values.organizationType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Organization Type"
                >
                  {organizationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.organizationType && formik.errors.organizationType && (
                  <FormHelperText>{formik.errors.organizationType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="taxIdNumber"
                name="taxIdNumber"
                label="Tax ID Number"
                value={formik.values.taxIdNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.taxIdNumber && Boolean(formik.errors.taxIdNumber)}
                helperText={formik.touched.taxIdNumber && formik.errors.taxIdNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="foundingYear"
                name="foundingYear"
                label="Founding Year"
                type="number"
                value={formik.values.foundingYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.foundingYear && Boolean(formik.errors.foundingYear)}
                helperText={formik.touched.foundingYear && formik.errors.foundingYear}
                required
                inputProps={{ min: 1800, max: new Date().getFullYear() }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="missionStatement"
                name="missionStatement"
                label="Mission Statement"
                value={formik.values.missionStatement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.missionStatement && Boolean(formik.errors.missionStatement)}
                helperText={formik.touched.missionStatement && formik.errors.missionStatement}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Organization Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={
                  (formik.touched.description && formik.errors.description) ||
                  'Please provide a detailed description of your organization, its activities, and impact.'
                }
                required
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="contactFirstName"
                name="contactFirstName"
                label="First Name"
                value={formik.values.contactFirstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactFirstName && Boolean(formik.errors.contactFirstName)}
                helperText={formik.touched.contactFirstName && formik.errors.contactFirstName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="contactLastName"
                name="contactLastName"
                label="Last Name"
                value={formik.values.contactLastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactLastName && Boolean(formik.errors.contactLastName)}
                helperText={formik.touched.contactLastName && formik.errors.contactLastName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="contactEmail"
                name="contactEmail"
                label="Email"
                type="email"
                value={formik.values.contactEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactEmail && Boolean(formik.errors.contactEmail)}
                helperText={formik.touched.contactEmail && formik.errors.contactEmail}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="contactPhone"
                name="contactPhone"
                label="Phone Number"
                value={formik.values.contactPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactPhone && Boolean(formik.errors.contactPhone)}
                helperText={formik.touched.contactPhone && formik.errors.contactPhone}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="contactPosition"
                name="contactPosition"
                label="Position/Title"
                value={formik.values.contactPosition}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactPosition && Boolean(formik.errors.contactPosition)}
                helperText={formik.touched.contactPosition && formik.errors.contactPosition}
                required
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.primaryFocusArea && Boolean(formik.errors.primaryFocusArea)}>
                <InputLabel id="primaryFocusArea-label" required>Primary Focus Area</InputLabel>
                <Select
                  labelId="primaryFocusArea-label"
                  id="primaryFocusArea"
                  name="primaryFocusArea"
                  value={formik.values.primaryFocusArea}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Primary Focus Area"
                >
                  {focusAreas.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.primaryFocusArea && formik.errors.primaryFocusArea && (
                  <FormHelperText>{formik.errors.primaryFocusArea}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                error={formik.touched.secondaryFocusAreas && Boolean(formik.errors.secondaryFocusAreas)}
                component="fieldset"
              >
                <FormLabel component="legend">Secondary Focus Areas (Select all that apply)</FormLabel>
                <FormGroup>
                  <Grid container>
                    {focusAreas.filter(area => area !== formik.values.primaryFocusArea).map((area) => (
                      <Grid item xs={12} sm={6} md={4} key={area}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.secondaryFocusAreas.includes(area)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  formik.setFieldValue('secondaryFocusAreas', [...formik.values.secondaryFocusAreas, area]);
                                } else {
                                  formik.setFieldValue(
                                    'secondaryFocusAreas',
                                    formik.values.secondaryFocusAreas.filter((a) => a !== area)
                                  );
                                }
                              }}
                              name={`secondaryFocusAreas-${area}`}
                            />
                          }
                          label={area}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
                {formik.touched.secondaryFocusAreas && formik.errors.secondaryFocusAreas && (
                  <FormHelperText>{formik.errors.secondaryFocusAreas}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.annualBudget && Boolean(formik.errors.annualBudget)}>
                <InputLabel id="annualBudget-label" required>Annual Budget</InputLabel>
                <Select
                  labelId="annualBudget-label"
                  id="annualBudget"
                  name="annualBudget"
                  value={formik.values.annualBudget}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Annual Budget"
                >
                  {budgetRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.annualBudget && formik.errors.annualBudget && (
                  <FormHelperText>{formik.errors.annualBudget}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="staffSize"
                name="staffSize"
                label="Staff Size"
                type="number"
                value={formik.values.staffSize}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.staffSize && Boolean(formik.errors.staffSize)}
                helperText={formik.touched.staffSize && formik.errors.staffSize}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.hasVolunteers}
                    onChange={(e) => {
                      formik.setFieldValue('hasVolunteers', e.target.checked);
                      if (!e.target.checked) {
                        formik.setFieldValue('volunteerCount', '');
                      }
                    }}
                    name="hasVolunteers"
                  />
                }
                label="Does your organization work with volunteers?"
              />
            </Grid>
            {formik.values.hasVolunteers && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="volunteerCount"
                  name="volunteerCount"
                  label="Number of Volunteers"
                  type="number"
                  value={formik.values.volunteerCount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.volunteerCount && Boolean(formik.errors.volunteerCount)}
                  helperText={formik.touched.volunteerCount && formik.errors.volunteerCount}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="additionalInformation"
                name="additionalInformation"
                label="Additional Information"
                value={formik.values.additionalInformation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.additionalInformation && Boolean(formik.errors.additionalInformation)}
                helperText={
                  (formik.touched.additionalInformation && formik.errors.additionalInformation) ||
                  'Please provide any additional information that might be relevant to your application.'
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl error={formik.touched.agreeToTerms && Boolean(formik.errors.agreeToTerms)}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.agreeToTerms}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="agreeToTerms"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the terms and conditions and privacy policy
                    </Typography>
                  }
                />
                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                  <FormHelperText error>{formik.errors.agreeToTerms}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" color="primary" gutterBottom>
            Online Application Form
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={formik.handleSubmit}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </form>
        </Paper>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ bottom: { xs: 90, sm: 24 } }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
            elevation={6}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ApplicationFormPage; 