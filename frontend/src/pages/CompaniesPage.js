import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  MenuItem, 
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  CardMedia
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(rgba(245, 245, 245, 0.8), rgba(245, 245, 245, 0.8))',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const SolutionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const SolutionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

const ImpactBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#333',
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  height: '100%',
}));

const CompanyCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// Validation schema for the contact form
const ContactFormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  company: Yup.string().required('Company name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string().required('Message is required'),
});

const CompaniesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const contactRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Scroll to contact form if URL has #contact hash
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        contactRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  const handleApplyNow = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      // In a real application, this would be an API call
      // await axios.post('/api/companies/applications/', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbar({
        open: true,
        message: 'Form submitted successfully',
        severity: 'success'
      });

      // Auto-hide the success message after 3 seconds
      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
      }, 3000);

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: 'There was an error sending your message. Please try again.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Corporate Solutions
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Partner with us to drive social impact and engage your stakeholders
          </Typography>
          <Box mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleApplyNow}
            >
              Apply Now
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Our Solutions Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Our Solutions
        </Typography>
        <Box mt={6}>
          <Grid container spacing={4}>
            {/* Employee Giving */}
            <Grid item xs={12} md={4}>
              <SolutionCard>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1470&auto=format&fit=crop"
                  alt="Employee Giving"
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <SolutionTitle variant="h5" component="h3">
                    Employee Giving
                  </SolutionTitle>
                  <Typography variant="body1">
                    Empower your employees to support causes they care about with matching gifts and volunteer programs
                  </Typography>
                </CardContent>
              </SolutionCard>
            </Grid>

            {/* Cause Marketing */}
            <Grid item xs={12} md={4}>
              <SolutionCard>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop"
                  alt="Cause Marketing"
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <SolutionTitle variant="h5" component="h3">
                    Cause Marketing
                  </SolutionTitle>
                  <Typography variant="body1">
                    Create meaningful campaigns that align with your brand values and resonate with customers
                  </Typography>
                </CardContent>
              </SolutionCard>
            </Grid>

            {/* Disaster Response */}
            <Grid item xs={12} md={4}>
              <SolutionCard>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1587653263995-422546a7a569?q=80&w=1470&auto=format&fit=crop"
                  alt="Disaster Response"
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <SolutionTitle variant="h5" component="h3">
                    Disaster Response
                  </SolutionTitle>
                  <Typography variant="body1">
                    Respond quickly and effectively to global disasters with our vetted nonprofit network
                  </Typography>
                </CardContent>
              </SolutionCard>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Trusted by Leading Companies */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Trusted by Leading Companies
        </Typography>
        <Box mt={6}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={6} md={3}>
              <Card elevation={2} sx={{ p: 3, height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png"
                  alt="Google Logo"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={2} sx={{ p: 3, height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
                  alt="Airbnb Logo"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={2} sx={{ p: 3, height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png"
                  alt="Microsoft Logo"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={2} sx={{ p: 3, height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Zoom_Logo_2022.svg/2560px-Zoom_Logo_2022.svg.png"
                  alt="Zoom Logo"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Impact Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Our Impact
        </Typography>
        <Box mt={6}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <ImpactBox>
                <Typography variant="h2" component="div" gutterBottom>
                  500+
                </Typography>
                <Typography variant="body1">
                  Corporate Partners
                </Typography>
              </ImpactBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <ImpactBox>
                <Typography variant="h2" component="div" gutterBottom>
                  $200M+
                </Typography>
                <Typography variant="body1">
                  Distributed Annually
                </Typography>
              </ImpactBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <ImpactBox>
                <Typography variant="h2" component="div" gutterBottom>
                  170+
                </Typography>
                <Typography variant="body1">
                  Countries Reached
                </Typography>
              </ImpactBox>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Contact Form Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }} ref={contactRef}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Get in Touch
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" paragraph>
            Ready to make a difference? Let's discuss how we can work together.
          </Typography>
          <Box mt={4}>
            <Formik
              initialValues={{
                name: '',
                company: '',
                email: '',
                message: ''
              }}
              validationSchema={ContactFormSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="name"
                        label="Your Name"
                        required
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="company"
                        label="Company Name"
                        required
                        error={touched.company && Boolean(errors.company)}
                        helperText={touched.company && errors.company}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="email"
                        label="Email Address"
                        type="email"
                        required
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="message"
                        label="Message"
                        multiline
                        rows={4}
                        required
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={isSubmitting}
                          endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                        >
                          Send Message
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompaniesPage; 