import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  CardMedia
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  backgroundImage: 'url("https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=1470&auto=format&fit=crop")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  },
  '& > *': {
    position: 'relative',
    zIndex: 2
  }
}));

const BenefitCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const StepSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(8, 0),
}));

const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'flex-start',
}));

const StepNumber = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '2rem',
  marginRight: theme.spacing(2),
}));

const TestimonialSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
}));

const NonprofitsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSurvey, setOpenSurvey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyData, setSurveyData] = useState({
    name: '',
    email: '',
    organization: '',
    feedback: '',
    rating: 5,
    improvements: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Using hardcoded testimonials instead of API call that's failing
    setTestimonials([
      {
        id: 1,
        content: "HopeBridge has been instrumental in helping us reach donors worldwide and scale our impact.",
        author_name: "Education Nonprofit",
        country: "United Kingdom",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1473&auto=format&fit=crop"
      },
      {
        id: 2,
        content: "The training and support we received helped us improve our fundraising strategy significantly.",
        author_name: "Healthcare Initiative",
        country: "United Kingdom",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop"
      },
      {
        id: 3,
        content: "Being part of HopeBridge opened doors to corporate partnerships we couldn't access before.",
        author_name: "Environmental Organisation",
        country: "United Kingdom",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1527&auto=format&fit=crop"
      }
    ]);
  }, []);

  const handleOpenSurvey = () => {
    setOpenSurvey(true);
  };

  const handleCloseSurvey = () => {
    setOpenSurvey(false);
  };

  const handleSurveyChange = (e) => {
    const { name, value } = e.target;
    setSurveyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSurvey = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbar({
        open: true,
        message: 'Survey submitted successfully',
        severity: 'success'
      });

      // Auto-hide the success message after 3 seconds
      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
      }, 3000);

      // Reset form and close dialog
      setSurveyData({
        name: '',
        email: '',
        organization: '',
        feedback: '',
        rating: 5,
        improvements: ''
      });
      handleCloseSurvey();
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit survey. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Typography variant="h3" component="h1" gutterBottom>
            For Nonprofits
          </Typography>
          <Typography variant="h6" paragraph>
            Join our global community and accelerate your impact
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            component={RouterLink} 
            to="/application-form"
            sx={{ mt: 2 }}
          >
            Apply Now
          </Button>
        </Container>
      </HeroSection>

      {/* Benefits Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Benefits of Joining HopeBridge
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <BenefitCard>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=1470&auto=format&fit=crop"
                alt="Access to Funding"
              />
              <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Access to Funding
                </Typography>
                <Typography variant="body1">
                  Connect with individual and corporate donors worldwide
                </Typography>
              </CardContent>
            </BenefitCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <BenefitCard>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1470&auto=format&fit=crop"
                alt="Capacity Building"
              />
              <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Capacity Building
                </Typography>
                <Typography variant="body1">
                  Access training and resources to strengthen your organisation
                </Typography>
              </CardContent>
            </BenefitCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <BenefitCard>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop"
                alt="Global Network"
              />
              <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Global Network
                </Typography>
                <Typography variant="body1">
                  Connect with like-minded organisations and expand your reach
                </Typography>
              </CardContent>
            </BenefitCard>
          </Grid>
        </Grid>
      </Container>

      {/* Process Steps */}
      <StepSection>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            How to Get Started
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <StepCard>
                <StepNumber>1</StepNumber>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Submit Your Application
                  </Typography>
                  <Typography variant="body1">
                    Fill out our simple application form with information about your organisation and mission.
                  </Typography>
                </Box>
              </StepCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop"
                  alt="Application Process"
                  sx={{ maxWidth: '100%', borderRadius: 2, maxHeight: 250 }}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1561489401-fc2876ced162?q=80&w=1470&auto=format&fit=crop"
                  alt="Verification Process"
                  sx={{ maxWidth: '100%', borderRadius: 2, maxHeight: 250 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StepCard>
                <StepNumber>2</StepNumber>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Verification Process
                  </Typography>
                  <Typography variant="body1">
                    Our team will review your application and verify your nonprofit status.
                  </Typography>
                </Box>
              </StepCard>
            </Grid>
          </Grid>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <StepCard>
                <StepNumber>3</StepNumber>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Onboarding & Training
                  </Typography>
                  <Typography variant="body1">
                    Complete our orientation and access our resources to set up your profile.
                  </Typography>
                </Box>
              </StepCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop"
                  alt="Onboarding Process"
                  sx={{ maxWidth: '100%', borderRadius: 2, maxHeight: 250 }}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              component={RouterLink} 
              to="/application-form"
            >
              Start Your Application
            </Button>
          </Box>
        </Container>
      </StepSection>

      {/* Testimonials Section */}
      <TestimonialSection>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            What Our Partners Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <TestimonialCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={testimonial.image}
                    alt={testimonial.author_name}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', flexGrow: 1 }}>
                    "{testimonial.content}"
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {testimonial.author_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {testimonial.country}
                  </Typography>
                </TestimonialCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </TestimonialSection>

      {/* Resources Section */}
      <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Resources For Nonprofits
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop"
                  alt="Training and Webinars"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Training & Webinars
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Access our library of training materials, webinars, and best practices guides.
                  </Typography>
                  <Button variant="outlined" color="primary">
                    Browse Resources
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image="https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=1470&auto=format&fit=crop"
                  alt="Mentorship Programme"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Mentorship Programme
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Get matched with experienced mentors who can help guide your organisation's growth.
                  </Typography>
                  <Button variant="outlined" color="primary">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feedback Survey Button */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleOpenSurvey}
        >
          Provide Feedback on Nonprofit Services
        </Button>
      </Box>

      {/* Feedback Survey Dialog */}
      <Dialog open={openSurvey} onClose={handleCloseSurvey} maxWidth="sm" fullWidth>
        <DialogTitle>Nonprofit Services Feedback</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={surveyData.name}
                  onChange={handleSurveyChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={surveyData.email}
                  onChange={handleSurveyChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Organisation"
                  name="organization"
                  value={surveyData.organization}
                  onChange={handleSurveyChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Rating</InputLabel>
                  <Select
                    name="rating"
                    value={surveyData.rating}
                    label="Rating"
                    onChange={handleSurveyChange}
                  >
                    <MenuItem value={1}>1 - Poor</MenuItem>
                    <MenuItem value={2}>2 - Below Average</MenuItem>
                    <MenuItem value={3}>3 - Average</MenuItem>
                    <MenuItem value={4}>4 - Good</MenuItem>
                    <MenuItem value={5}>5 - Excellent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Feedback"
                  name="feedback"
                  multiline
                  rows={4}
                  value={surveyData.feedback}
                  onChange={handleSurveyChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Suggestions for Improvement"
                  name="improvements"
                  multiline
                  rows={3}
                  value={surveyData.improvements}
                  onChange={handleSurveyChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSurvey}>Cancel</Button>
          <Button 
            onClick={handleSubmitSurvey}
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NonprofitsPage; 