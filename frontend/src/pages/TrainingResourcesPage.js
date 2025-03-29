import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  backgroundImage: 'url("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop")',
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

const TrainingResourcesPage = () => {
  // Dialog states
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    expectations: ''
  });

  const [enrollmentForm, setEnrollmentForm] = useState({
    name: '',
    email: '',
    organization: '',
    experience: '',
    background: ''
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const webinars = [
    {
      title: 'Effective Fundraising Strategies',
      description: 'Learn proven techniques to maximize your fundraising efforts.',
      duration: '60 mins',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop',
      type: 'webinar'
    },
    {
      title: 'Digital Marketing for Nonprofits',
      description: 'Master social media and online marketing to reach more donors.',
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1474&auto=format&fit=crop',
      type: 'webinar'
    },
    {
      title: 'Grant Writing Workshop',
      description: 'Write compelling grant proposals that get results.',
      duration: '90 mins',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1740&auto=format&fit=crop',
      type: 'webinar'
    }
  ];

  const resources = [
    {
      title: 'Nonprofit Management Guide',
      description: 'Comprehensive guide covering all aspects of nonprofit management.',
      type: 'guide',
      format: 'PDF'
    },
    {
      title: 'Financial Planning Templates',
      description: 'Ready-to-use templates for budgeting and financial forecasting.',
      type: 'template',
      format: 'Excel'
    },
    {
      title: 'Impact Measurement Toolkit',
      description: 'Tools and frameworks for measuring your organization\'s impact.',
      type: 'toolkit',
      format: 'PDF + Excel'
    }
  ];

  const courses = [
    {
      title: 'Nonprofit Leadership Certification',
      description: 'Comprehensive training program for nonprofit leaders.',
      duration: '6 weeks',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop'
    },
    {
      title: 'Financial Management Essentials',
      description: 'Master nonprofit financial management and reporting.',
      duration: '4 weeks',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1470&auto=format&fit=crop'
    },
    {
      title: 'Volunteer Management',
      description: 'Learn to recruit, train, and retain valuable volunteers.',
      duration: '3 weeks',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1470&auto=format&fit=crop'
    }
  ];

  const handleRegisterClick = (webinar) => {
    setSelectedWebinar(webinar);
    setOpenRegisterDialog(true);
  };

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setOpenEnrollDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenRegisterDialog(false);
    setOpenEnrollDialog(false);
    setRegistrationForm({
      name: '',
      email: '',
      organization: '',
      role: '',
      expectations: ''
    });
    setEnrollmentForm({
      name: '',
      email: '',
      organization: '',
      experience: '',
      background: ''
    });
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnrollmentChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistrationSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbar({
        open: true,
        message: `Successfully registered for ${selectedWebinar.title}!`,
        severity: 'success'
      });
      handleCloseDialogs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Registration failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollmentSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbar({
        open: true,
        message: `Successfully enrolled in ${selectedCourse.title}!`,
        severity: 'success'
      });
      handleCloseDialogs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Enrollment failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (resource) => {
    // Create mock content based on resource type
    let content = '';
    if (resource.type === 'guide') {
      content = `# ${resource.title}\n\nComprehensive guide for nonprofit organizations\n\n## Table of Contents\n1. Introduction\n2. Best Practices\n3. Case Studies\n4. Implementation Guide\n5. Resources and Tools`;
    } else if (resource.type === 'template') {
      content = `${resource.title}\n\nFinancial Planning Template\n\nIncome Statement\nRevenue:\n- Donations\n- Grants\n- Events\n\nExpenses:\n- Programs\n- Administrative\n- Fundraising`;
    } else {
      content = `${resource.title}\n\nImpact Measurement Framework\n\n1. Define Goals\n2. Select Metrics\n3. Data Collection\n4. Analysis\n5. Reporting`;
    }

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.toLowerCase().replace(/ /g, '_')}.${resource.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success message
    setSnackbar({
      open: true,
      message: `${resource.title} downloaded successfully!`,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography variant="h3" component="h1" gutterBottom>
            Training & Resources
          </Typography>
          <Typography variant="h6" paragraph>
            Access our comprehensive library of training materials and resources
          </Typography>
        </Container>
      </HeroSection>

      {/* Upcoming Webinars Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Upcoming Webinars
        </Typography>
        <Grid container spacing={4}>
          {webinars.map((webinar, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={webinar.image}
                  alt={webinar.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {webinar.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {webinar.description}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Duration: {webinar.duration}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayCircleOutlineIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => handleRegisterClick(webinar)}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Resources Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Downloadable Resources
          </Typography>
          <List>
            {resources.map((resource, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 2,
                  bgcolor: 'white',
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <ListItemIcon>
                  <ArticleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={resource.title}
                  secondary={
                    <>
                      {resource.description}
                      <br />
                      <Typography component="span" variant="body2" color="primary">
                        Format: {resource.format}
                      </Typography>
                    </>
                  }
                />
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => handleDownload(resource)}
                >
                  Download
                </Button>
              </ListItem>
            ))}
          </List>
        </Container>
      </Box>

      {/* Online Courses Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Online Courses
        </Typography>
        <Grid container spacing={4}>
          {courses.map((course, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={course.image}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.description}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Duration: {course.duration}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SchoolIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => handleEnrollClick(course)}
                  >
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Registration Dialog */}
      <Dialog open={openRegisterDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Register for {selectedWebinar?.title}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={registrationForm.name}
                  onChange={handleRegistrationChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={registrationForm.email}
                  onChange={handleRegistrationChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Organization"
                  name="organization"
                  value={registrationForm.organization}
                  onChange={handleRegistrationChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Role"
                  name="role"
                  value={registrationForm.role}
                  onChange={handleRegistrationChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="What do you hope to learn?"
                  name="expectations"
                  multiline
                  rows={3}
                  value={registrationForm.expectations}
                  onChange={handleRegistrationChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button
            onClick={handleRegistrationSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enrollment Dialog */}
      <Dialog open={openEnrollDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Enroll in {selectedCourse?.title}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={enrollmentForm.name}
                  onChange={handleEnrollmentChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={enrollmentForm.email}
                  onChange={handleEnrollmentChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Organization"
                  name="organization"
                  value={enrollmentForm.organization}
                  onChange={handleEnrollmentChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    name="experience"
                    value={enrollmentForm.experience}
                    label="Experience Level"
                    onChange={handleEnrollmentChange}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Professional Background"
                  name="background"
                  multiline
                  rows={3}
                  value={enrollmentForm.background}
                  onChange={handleEnrollmentChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button
            onClick={handleEnrollmentSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Enroll'}
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
    </Box>
  );
};

export default TrainingResourcesPage; 