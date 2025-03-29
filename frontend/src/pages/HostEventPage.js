import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CategoryIcon from '@mui/icons-material/Category';

const HostEventPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    description: '',
    location: '',
    eventDate: '',
    targetAmount: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organisation: '',
    agreeTerms: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const steps = ['Event Details', 'Personal Information', 'Review & Submit'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // In a real app, would send form data to backend here
    console.log('Form submitted:', formData);
  };

  const eventTypes = [
    { value: 'community', label: 'Community Event' },
    { value: 'sports', label: 'Sports Challenge' },
    { value: 'gala', label: 'Gala/Dinner' },
    { value: 'concert', label: 'Concert/Performance' },
    { value: 'auction', label: 'Auction' },
    { value: 'raffle', label: 'Raffle/Lottery' },
    { value: 'virtual', label: 'Virtual Event' },
    { value: 'other', label: 'Other' },
  ];

  const resources = [
    {
      title: 'Run a Successful Fundraising Event',
      content: 'Learn tips for planning and executing a successful charity fundraiser.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1469&auto=format&fit=crop'
    },
    {
      title: 'Promoting Your Event',
      content: 'Strategies to spread the word and attract participants and donors.',
      image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1470&auto=format&fit=crop'
    },
    {
      title: 'Legal Requirements',
      content: 'Understand the legal aspects of fundraising in the UK.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop'
    },
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Event Name"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    label="Event Type"
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Target Amount (£)"
                  name="targetAmount"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Event Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Event Date"
                  name="eventDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.eventDate}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 3, ml: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box component="form" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organisation (if applicable)"
                  name="organisation"
                  value={formData.organisation}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleBack} sx={{ mt: 3, mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 3, ml: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Name:</strong> {formData.eventName || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Type:</strong> {formData.eventType ? eventTypes.find(type => type.value === formData.eventType)?.label : 'Not selected'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Location:</strong> {formData.location || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DateRangeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Date:</strong> {formData.eventDate || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Target Amount:</strong> {formData.targetAmount ? `£${formData.targetAmount}` : 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {formData.description || 'No description provided.'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {`${formData.firstName || ''} ${formData.lastName || ''}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {formData.email || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Phone:</strong> {formData.phone || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Organisation:</strong> {formData.organisation || 'Not provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Alert severity="info" sx={{ mt: 4 }}>
              <AlertTitle>Please Note</AlertTitle>
              By submitting this form, you agree to our terms and conditions for hosting fundraising events.
              A member of our team will contact you within 2 working days to discuss your event proposal.
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleBack} sx={{ mt: 3, mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 3, ml: 1 }}
              >
                Submit Application
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: '#f7f7f7', py: 4, minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: '40vh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1412&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Host Your Own Fundraising Event
          </Typography>
          <Typography variant="h5">
            Make a difference in your community with our support
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: 8 }}>
        {formSubmitted ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Thank You for Your Application!
            </Typography>
            <Typography variant="body1" paragraph>
              We've received your event proposal and a member of our team will contact you at {formData.email} within 2 working days to discuss next steps.
            </Typography>
            <Typography variant="body1" paragraph>
              Reference number: EF-{Math.floor(Math.random() * 10000)}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              href="/events" 
              sx={{ mt: 2 }}
            >
              Return to Events Page
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Event Application
                </Typography>
                <Typography variant="body1" paragraph>
                  Complete the form below to apply to host your own fundraising event. Our team will review your application and contact you to provide support for your initiative.
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {renderStepContent(activeStep)}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Why Host a Fundraising Event?
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Make a tangible difference in your local community" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Bring people together for a good cause" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Raise awareness about important issues" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Develop valuable skills and experience" />
                  </ListItem>
                </List>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Our Support Includes
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Personalised fundraising page" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Marketing materials and templates" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Dedicated support from our team" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Secure donation processing" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Fundraising Resources */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Fundraising Resources
          </Typography>
          <Typography variant="body1" paragraph>
            We've compiled helpful resources to ensure your fundraising event is a success.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {resources.map((resource, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="160"
                    image={resource.image}
                    alt={resource.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {resource.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQs */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Frequently Asked Questions
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">What types of events can I host?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                You can host a wide variety of events, including but not limited to charity runs, bake sales, 
                auctions, gala dinners, concerts, sports tournaments, and virtual events. We encourage creativity 
                and are open to discussing any event ideas you may have.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Is there a minimum amount I need to raise?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                There is no minimum amount required, but we encourage setting ambitious yet achievable targets. 
                Our team can help you determine an appropriate fundraising goal based on your event type and scale.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">How long does the approval process take?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Our team typically reviews applications within 2 working days. After initial review, 
                we'll schedule a call to discuss your event in more detail and provide guidance on next steps.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Are there any fees involved?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                There are no fees to host an event. Our support services, including fundraising pages and 
                promotional materials, are provided free of charge. Standard payment processing fees may apply 
                to online donations (typically 2-3%).
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </Box>
  );
};

export default HostEventPage; 