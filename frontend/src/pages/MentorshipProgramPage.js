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
  Paper,
  Stepper,
  Step,
  StepLabel,
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  backgroundImage: 'url("https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1469&auto=format&fit=crop")',
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

const MentorshipProgramPage = () => {
  // Dialog states
  const [openConnectionDialog, setOpenConnectionDialog] = useState(false);
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Form states
  const [connectionForm, setConnectionForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    interests: '',
    preferredMentor: '',
    availability: '',
    goals: ''
  });

  const [applicationForm, setApplicationForm] = useState({
    organizationName: '',
    website: '',
    contactPerson: '',
    email: '',
    phone: '',
    missionStatement: '',
    challengesFaced: '',
    mentorshipGoals: '',
    preferredDuration: 'sixMonths',
    areasOfSupport: [],
    hasTeamBuyIn: false,
    commitment: false
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const steps = ['Application', 'Matching', 'Onboarding', 'Program Start'];

  const benefits = [
    {
      title: 'Expert Guidance',
      description: 'Get paired with experienced nonprofit leaders who understand your challenges.',
      icon: <PersonIcon fontSize="large" color="primary" />
    },
    {
      title: 'Networking Opportunities',
      description: 'Connect with a community of nonprofit professionals and expand your network.',
      icon: <GroupsIcon fontSize="large" color="primary" />
    },
    {
      title: 'Skill Development',
      description: 'Enhance your leadership and management skills through structured learning.',
      icon: <SchoolIcon fontSize="large" color="primary" />
    },
    {
      title: 'Growth Support',
      description: 'Receive guidance on scaling your organization and increasing impact.',
      icon: <TimelineIcon fontSize="large" color="primary" />
    }
  ];

  const mentors = [
    {
      name: 'Sarah Johnson',
      role: 'Executive Director',
      organization: 'Global Health Initiative',
      expertise: 'Healthcare Nonprofits, Grant Writing',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop'
    },
    {
      name: 'Michael Chen',
      role: 'Founder & CEO',
      organization: 'Education First Foundation',
      expertise: 'Education, Strategic Planning',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Director',
      organization: 'Community Development Alliance',
      expertise: 'Community Programs, Volunteer Management',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522&auto=format&fit=crop'
    }
  ];

  const areasOfSupport = [
    'Strategic Planning',
    'Fundraising',
    'Program Development',
    'Financial Management',
    'Board Development',
    'Marketing & Communications',
    'Volunteer Management',
    'Impact Measurement'
  ];

  const handleOpenConnectionDialog = () => {
    setOpenConnectionDialog(true);
  };

  const handleOpenApplicationDialog = () => {
    setOpenApplicationDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenConnectionDialog(false);
    setOpenApplicationDialog(false);
    setConnectionForm({
      name: '',
      email: '',
      organization: '',
      role: '',
      interests: '',
      preferredMentor: '',
      availability: '',
      goals: ''
    });
    setApplicationForm({
      organizationName: '',
      website: '',
      contactPerson: '',
      email: '',
      phone: '',
      missionStatement: '',
      challengesFaced: '',
      mentorshipGoals: '',
      preferredDuration: 'sixMonths',
      areasOfSupport: [],
      hasTeamBuyIn: false,
      commitment: false
    });
  };

  const handleConnectionChange = (e) => {
    const { name, value } = e.target;
    setConnectionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplicationChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      if (name === 'areasOfSupport') {
        setApplicationForm(prev => ({
          ...prev,
          areasOfSupport: checked
            ? [...prev.areasOfSupport, value]
            : prev.areasOfSupport.filter(area => area !== value)
        }));
      } else {
        setApplicationForm(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setApplicationForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleConnectionSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbar({
        open: true,
        message: 'Connection request submitted successfully! We will connect you with a mentor soon.',
        severity: 'success'
      });
      handleCloseDialogs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Connection request failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplicationSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbar({
        open: true,
        message: 'Mentorship application submitted successfully! We will review your application and get back to you soon.',
        severity: 'success'
      });
      handleCloseDialogs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Application submission failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography variant="h3" component="h1" gutterBottom>
            Mentorship Programme
          </Typography>
          <Typography variant="h6" paragraph>
            Connect with experienced nonprofit leaders and accelerate your organization's growth
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={handleOpenConnectionDialog}
          >
            Apply Now
          </Button>
        </Container>
      </HeroSection>

      {/* Program Benefits */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Program Benefits
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                {benefit.icon}
                <Typography variant="h6" component="h3" sx={{ my: 2 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Application Process */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center">
          Mentorship Application Process
          </Typography>
          <Stepper activeStep={-1} alternativeLabel sx={{ mt: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Box>

      {/* Featured Mentors */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Featured Mentors
        </Typography>
        <Grid container spacing={4}>
          {mentors.map((mentor, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image={mentor.image}
                  alt={mentor.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {mentor.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {mentor.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {mentor.organization}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Expertise:</strong> {mentor.expertise}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h2" gutterBottom>
                Ready to Transform Your Organization?
              </Typography>
              <Typography variant="body1" paragraph>
                Join our mentorship program and gain the guidance you need to make a bigger impact.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleOpenApplicationDialog}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Apply for Mentorship
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Connection Dialog */}
      <Dialog open={openConnectionDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Connect with a Nonprofit Leader</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={connectionForm.name}
                  onChange={handleConnectionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={connectionForm.email}
                  onChange={handleConnectionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Organization"
                  name="organization"
                  value={connectionForm.organization}
                  onChange={handleConnectionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Role"
                  name="role"
                  value={connectionForm.role}
                  onChange={handleConnectionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Areas of Interest"
                  name="interests"
                  multiline
                  rows={2}
                  value={connectionForm.interests}
                  onChange={handleConnectionChange}
                  helperText="What areas would you like guidance in?"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Preferred Mentor (Optional)"
                  name="preferredMentor"
                  value={connectionForm.preferredMentor}
                  onChange={handleConnectionChange}
                  helperText="If you have a specific mentor in mind from our featured mentors"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Availability"
                  name="availability"
                  value={connectionForm.availability}
                  onChange={handleConnectionChange}
                  helperText="What is your preferred meeting schedule?"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Goals"
                  name="goals"
                  multiline
                  rows={3}
                  value={connectionForm.goals}
                  onChange={handleConnectionChange}
                  helperText="What do you hope to achieve through this mentorship?"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button
            onClick={handleConnectionSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={openApplicationDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>Mentorship Program Application</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Organization Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Organization Name"
                  name="organizationName"
                  value={applicationForm.organizationName}
                  onChange={handleApplicationChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Website"
                  name="website"
                  value={applicationForm.website}
                  onChange={handleApplicationChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Contact Person"
                  name="contactPerson"
                  value={applicationForm.contactPerson}
                  onChange={handleApplicationChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={applicationForm.email}
                  onChange={handleApplicationChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={applicationForm.phone}
                  onChange={handleApplicationChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Mission Statement"
                  name="missionStatement"
                  multiline
                  rows={3}
                  value={applicationForm.missionStatement}
                  onChange={handleApplicationChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Mentorship Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Current Challenges"
                  name="challengesFaced"
                  multiline
                  rows={3}
                  value={applicationForm.challengesFaced}
                  onChange={handleApplicationChange}
                  helperText="Describe the main challenges your organization is currently facing"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Mentorship Goals"
                  name="mentorshipGoals"
                  multiline
                  rows={3}
                  value={applicationForm.mentorshipGoals}
                  onChange={handleApplicationChange}
                  helperText="What specific goals do you want to achieve through this mentorship?"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Preferred Program Duration</FormLabel>
                  <RadioGroup
                    name="preferredDuration"
                    value={applicationForm.preferredDuration}
                    onChange={handleApplicationChange}
                  >
                    <FormControlLabel value="threeMonths" control={<Radio />} label="3 months" />
                    <FormControlLabel value="sixMonths" control={<Radio />} label="6 months" />
                    <FormControlLabel value="oneYear" control={<Radio />} label="1 year" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Areas of Support Needed</FormLabel>
                  <Grid container spacing={2}>
                    {areasOfSupport.map((area) => (
                      <Grid item xs={12} sm={6} key={area}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={applicationForm.areasOfSupport.includes(area)}
                              onChange={handleApplicationChange}
                              name="areasOfSupport"
                              value={area}
                            />
                          }
                          label={area}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={applicationForm.hasTeamBuyIn}
                      onChange={handleApplicationChange}
                      name="hasTeamBuyIn"
                    />
                  }
                  label="I confirm that our team/board supports this mentorship application"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={applicationForm.commitment}
                      onChange={handleApplicationChange}
                      name="commitment"
                    />
                  }
                  label="I commit to actively participating in the mentorship program and implementing learned strategies"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button
            onClick={handleApplicationSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting || !applicationForm.hasTeamBuyIn || !applicationForm.commitment}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit Application'}
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

export default MentorshipProgramPage; 