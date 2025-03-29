import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  TextField, 
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(rgba(245, 245, 245, 0.8), rgba(245, 245, 245, 0.8))',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const ProjectCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const StepBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  height: '100%',
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
}));

const ImpactBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  height: '100%',
}));

const PartnerCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100px',
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

const DisastersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const projectsRef = useRef(null);
  const { addToCart } = useCart();
  const [selectedProject, setSelectedProject] = useState(null);
  const [donationAmount, setDonationAmount] = useState('25');
  const [customAmount, setCustomAmount] = useState('');
  const [openDonateDialog, setOpenDonateDialog] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Emergency Response Fund',
      description: 'Supporting immediate relief efforts worldwide',
      image: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?q=80&w=1470&auto=format&fit=crop',
      fundsRaised: 750000,
      fundingGoal: 1000000,
      progress: 75
    },
    {
      id: 2,
      title: 'Earthquake Relief',
      description: 'Providing emergency aid to communities',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1500&auto=format&fit=crop',
      fundsRaised: 300000,
      fundingGoal: 500000,
      progress: 60
    },
    {
      id: 3,
      title: 'Hurricane Recovery',
      description: 'Supporting long-term recovery efforts',
      image: 'https://images.unsplash.com/photo-1583797227225-4233106c5a2a?q=80&w=1500&auto=format&fit=crop',
      fundsRaised: 200000,
      fundingGoal: 500000,
      progress: 40
    }
  ]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Scroll to projects section if URL has #projects hash
    if (window.location.hash === '#projects') {
      setTimeout(() => {
        projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }

    // Fetch projects from API
    // This is commented out since we're using mock data for now
    /*
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/disasters/projects/?active=true');
        setProjects(response.data.results);
      } catch (error) {
        console.error('Error fetching disaster projects:', error);
      }
    };
    fetchProjects();
    */
  }, []);

  const handleOpenDonateDialog = (project) => {
    setSelectedProject(project);
    setOpenDonateDialog(true);
  };

  const handleCloseDonateDialog = () => {
    setOpenDonateDialog(false);
    setSelectedProject(null);
    setDonationAmount('25');
    setCustomAmount('');
  };

  const handleDonationAmountChange = (event) => {
    setDonationAmount(event.target.value);
    if (event.target.value === 'custom') {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (event) => {
    setCustomAmount(event.target.value);
  };

  const handleDonateSubmit = () => {
    // Add null check for selectedProject
    if (!selectedProject) {
      console.error('No project selected');
      return;
    }

    const amount = donationAmount === 'custom' ? customAmount : donationAmount;
    
    // Create cart item
    const cartItem = {
      id: `disaster-${selectedProject.id}-${Date.now()}`,
      type: 'donation',
      amount: parseFloat(amount),
      name: `Disaster Relief: ${selectedProject.title}`,
      description: selectedProject.description,
      price: parseFloat(amount),
      quantity: 1,
      currency: 'GBP',
      projectId: selectedProject.id,
      category: 'disaster'
    };
    
    try {
      // Add to cart using CartContext
      addToCart(cartItem);
      
      // Close dialog and reset state
      handleCloseDonateDialog();
      
    } catch (error) {
      console.error('Error adding donation to cart:', error);
    }
  };

  const handleDonateNow = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* Hero Section with Disaster Relief Image */}
      <Box
        sx={{
          height: '50vh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1587653263995-422546a7a569?q=80&w=1470&auto=format&fit=crop")',
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
        <Container sx={{ position: 'relative', zIndex: 2, color: 'white' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Disaster Relief
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Providing immediate assistance to regions affected by natural disasters
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleDonateNow}
          >
            Donate Now
          </Button>
        </Container>
      </Box>

      {/* Active Disaster Response Projects */}
      <Box ref={projectsRef} py={6}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Active Disaster Response Projects
          </Typography>
          <Grid container spacing={4} mt={2}>
            {projects.map((project) => (
              <Grid item xs={12} md={4} key={project.id}>
                <ProjectCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                  />
                  <CardContent>
                    <ProjectTitle variant="h6">
                      {project.title}
                    </ProjectTitle>
                    <Typography color="textSecondary" paragraph>
                      {project.description}
                    </Typography>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Progress: {project.progress}%
                      </Typography>
                      <ProgressBar
                        variant="determinate"
                        value={project.progress}
                        color="primary"
                      />
                      <Typography variant="body2" color="textSecondary">
                        £{project.fundsRaised.toLocaleString()} raised of £{project.fundingGoal.toLocaleString()}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleOpenDonateDialog(project)}
                    >
                      Donate Now
                    </Button>
                  </CardContent>
                </ProjectCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Donation Dialog */}
      <Dialog
        open={openDonateDialog}
        onClose={handleCloseDonateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Donate to {selectedProject?.title}
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            {selectedProject?.description}
          </Typography>
          {selectedProject && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Progress: {selectedProject.progress}% funded
              </Typography>
              <Typography variant="body2" color="text.secondary">
                £{selectedProject.fundsRaised.toLocaleString()} raised of £{selectedProject.fundingGoal.toLocaleString()}
              </Typography>
            </Box>
          )}
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
                    label="£10"
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControlLabel
                    value="25"
                    control={<Radio />}
                    label="£25"
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControlLabel
                    value="50"
                    control={<Radio />}
                    label="£50"
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControlLabel
                    value="100"
                    control={<Radio />}
                    label="£100"
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label="Custom amount"
                  />
                  {donationAmount === 'custom' && (
                    <TextField
                      fullWidth
                      label="Enter amount"
                      type="number"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">£</InputAdornment>,
                      }}
                      sx={{ mt: 1 }}
                    />
                  )}
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDonateDialog}>Cancel</Button>
          <Button 
            onClick={handleDonateSubmit} 
            variant="contained" 
            color="primary"
            disabled={!selectedProject || (donationAmount === 'custom' && !customAmount)}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      {/* Our Disaster Response Framework */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Disaster Response Framework
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
          A comprehensive approach to disaster relief and recovery
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1587653263995-422546a7a569?q=80&w=1470&auto=format&fit=crop"
                alt="Phase 1: Emergency Response"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>Phase 1: Emergency Response</Typography>
                <Typography variant="body2">Immediate action within 24-48 hours of disaster.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1500&auto=format&fit=crop"
                alt="Phase 2: Stabilization"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>Phase 2: Stabilization</Typography>
                <Typography variant="body2">Establishing sustainable support systems.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1474&auto=format&fit=crop"
                alt="Phase 3: Recovery"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>Phase 3: Recovery</Typography>
                <Typography variant="body2">Long-term rebuilding and community resilience.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* See Our Impact Video Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            See Our Impact
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
            Watch how your support makes a difference in disaster-affected communities
          </Typography>
          
          <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', maxWidth: 800, mx: 'auto' }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8 }}
              src="https://www.youtube.com/embed/WTdPnJMOr7Y"
              title="Disaster Relief Impact"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        </Container>
      </Box>

      {/* Impact Section */}
      <Box sx={{ bgcolor: 'primary.main', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ color: 'white' }}>
            Our Impact
          </Typography>
          <Box mt={6}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <ImpactBox>
                  <Typography variant="h2" component="div" gutterBottom>
                    $50M+
                  </Typography>
                  <Typography variant="body1">
                    Disaster Relief Funds Distributed
                  </Typography>
                </ImpactBox>
              </Grid>
              <Grid item xs={12} md={4}>
                <ImpactBox>
                  <Typography variant="h2" component="div" gutterBottom>
                    100+
                  </Typography>
                  <Typography variant="body1">
                    Disasters Responded To
                  </Typography>
                </ImpactBox>
              </Grid>
              <Grid item xs={12} md={4}>
                <ImpactBox>
                  <Typography variant="h2" component="div" gutterBottom>
                    1M+
                  </Typography>
                  <Typography variant="body1">
                    People Helped
                  </Typography>
                </ImpactBox>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Partners Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Our Response Partners
        </Typography>
        <Box mt={6}>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={6} md={3}>
              <PartnerCard elevation={2}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/800px-Adobe_Corporate_Logo.png"
                  alt="Adobe Logo"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </PartnerCard>
            </Grid>
            <Grid item xs={6} md={3}>
              <PartnerCard elevation={2}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cisco_logo.svg/1280px-Cisco_logo.svg.png"
                  alt="Cisco Logo"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </PartnerCard>
            </Grid>
            <Grid item xs={6} md={3}>
              <PartnerCard elevation={2}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png"
                  alt="eBay Logo"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </PartnerCard>
            </Grid>
            <Grid item xs={6} md={3}>
              <PartnerCard elevation={2}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/1005px-Intel_logo_%282006-2020%29.svg.png"
                  alt="Intel Logo"
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </PartnerCard>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Box mt={6}>
            <Accordion>
              <AccordionSummary expandIcon={<AddIcon />}>
                <Typography variant="h6">How quickly are disaster funds deployed?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We deploy emergency funds within 24-48 hours of a disaster. Our rapid response team works around the clock to ensure that aid reaches affected communities as quickly as possible. We have established protocols and partnerships that allow us to mobilize resources efficiently.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<AddIcon />}>
                <Typography variant="h6">How are partner organizations selected?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We carefully vet all partner organizations based on their track record, local presence, operational capacity, and financial transparency. We prioritize organizations that have deep roots in the communities they serve and have demonstrated effectiveness in disaster response and recovery efforts.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<AddIcon />}>
                <Typography variant="h6">What percentage of donations go directly to relief efforts?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  At least 90% of all donations go directly to relief efforts. We maintain a lean operational structure and leverage partnerships to maximize the impact of every dollar donated. Our financial statements are audited annually and available for public review to ensure complete transparency.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Container>
      </Box>

      {/* Snackbar for donation feedback */}
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

export default DisastersPage; 