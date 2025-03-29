import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SearchIcon from '@mui/icons-material/Search';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useCart } from '../contexts/CartContext';

// Import axios from our mock in test environment or real axios in production
let axios;
if (process.env.NODE_ENV === 'test') {
  axios = require('../tests/mocks/axios').default;
} else {
  axios = require('axios').default;
}

// Mock data for campaigns (would come from API in real app)
const featuredCampaigns = [
  {
    id: 1,
    title: 'Clean Water Initiative',
    description: 'Providing clean water to communities in need across Africa.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop',
    raised: 12500,
    goal: 25000,
    daysLeft: 15,
  },
  {
    id: 2,
    title: 'Education for All',
    description: 'Supporting education for underprivileged children worldwide.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1422&auto=format&fit=crop',
    raised: 18000,
    goal: 30000,
    daysLeft: 22,
  },
  {
    id: 3,
    title: 'Emergency Relief Fund',
    description: 'Immediate assistance for communities affected by natural disasters.',
    image: 'https://images.unsplash.com/photo-1587653263995-422546a7a569?q=80&w=1470&auto=format&fit=crop',
    raised: 45000,
    goal: 50000,
    daysLeft: 5,
  },
];

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Regular Donor',
    quote: 'HopeBridge has made it so easy for me to contribute to causes I care about. I love seeing the direct impact of my donations.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Volunteer',
    quote: 'Volunteering with HopeBridge has been one of the most rewarding experiences of my life. The team is dedicated and passionate.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    role: 'Campaign Beneficiary',
    quote: 'The support from HopeBridge donors helped our community rebuild after the flood. We are forever grateful.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop',
  },
];

// Replace ukProjects with worldwideProjects
const worldwideProjects = [
  {
    id: 1,
    title: 'Clean Water Wells in Ethiopia',
    description: 'Building sustainable water wells to provide clean drinking water to rural communities in Ethiopia.',
    location: 'Africa',
    category: 'Water & Sanitation',
    raised: 28000,
    goal: 35000,
    theme: 'Infrastructure',
    size: 'Large',
    image: 'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Education Center in Mumbai',
    description: 'Creating a modern education center for underprivileged children in Mumbai slums.',
    location: 'Asia',
    category: 'Education',
    raised: 15000,
    goal: 25000,
    theme: 'Education',
    size: 'Medium',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1473&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Amazon Rainforest Conservation',
    description: 'Protecting indigenous lands and preserving biodiversity in the Amazon rainforest.',
    location: 'South America',
    category: 'Environment',
    raised: 45000,
    goal: 60000,
    theme: 'Conservation',
    size: 'Large',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1472&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'London Food Bank Network',
    description: 'Expanding food bank networks to reach more families in need across London.',
    location: 'Europe',
    category: 'Food Security',
    raised: 12000,
    goal: 15000,
    theme: 'Community Support',
    size: 'Medium',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Australian Wildlife Recovery',
    description: 'Supporting wildlife rehabilitation centers affected by bushfires in Australia.',
    location: 'Oceania',
    category: 'Wildlife',
    raised: 32000,
    goal: 40000,
    theme: 'Conservation',
    size: 'Large',
    image: 'https://images.unsplash.com/photo-1578326457399-3b34dbbf23b8?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Digital Skills Training in Mexico',
    description: 'Providing technology education and job skills training to youth in Mexico City.',
    location: 'North America',
    category: 'Education',
    raised: 18000,
    goal: 30000,
    theme: 'Education',
    size: 'Medium',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Solar Power for Rural India',
    description: 'Installing solar panels in remote villages to provide sustainable electricity.',
    location: 'Asia',
    category: 'Energy',
    raised: 55000,
    goal: 75000,
    theme: 'Infrastructure',
    size: 'Large',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1472&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'Healthcare Access in Kenya',
    description: 'Building mobile clinics to provide healthcare services in rural Kenya.',
    location: 'Africa',
    category: 'Healthcare',
    raised: 42000,
    goal: 50000,
    theme: 'Healthcare',
    size: 'Large',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop',
  }
];

const categories = ['All Categories', 'Water & Sanitation', 'Education', 'Environment', 'Food Security', 'Healthcare', 'Energy', 'Wildlife'];
const locations = ['All Locations', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
const projectSizes = ['Any Size', 'Small', 'Medium', 'Large'];
const themes = ['All Themes', 'Infrastructure', 'Education', 'Conservation', 'Community Support', 'Healthcare'];

const HomePage = () => {
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [donationAmount, setDonationAmount] = useState('25');
  const [customAmount, setCustomAmount] = useState('');
  const [openDonateDialog, setOpenDonateDialog] = useState(false);
  const [campaigns, setCampaigns] = useState(featuredCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [location, setLocation] = useState('All Locations');
  const [projectSize, setProjectSize] = useState('Any Size');
  const [themeFilter, setThemeFilter] = useState('All Themes');
  const [email, setEmail] = useState('');
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [filteredProjects, setFilteredProjects] = useState(worldwideProjects);
  const projectsPerPage = 3;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // In a real app, we would fetch campaigns from the API
  useEffect(() => {
    // Example API call (commented out since we're using mock data)
    // const fetchCampaigns = async () => {
    //   try {
    //     const response = await axios.get('/api/campaigns/featured');
    //     setCampaigns(response.data);
    //   } catch (error) {
    //     console.error('Error fetching campaigns:', error);
    //   }
    // };
    // fetchCampaigns();
  }, []);

  // Filter projects based on search criteria
  useEffect(() => {
    let filtered = worldwideProjects;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query)
      );
    }

    if (category !== 'All Categories') {
      filtered = filtered.filter(project => project.category === category);
    }

    if (location !== 'All Locations') {
      filtered = filtered.filter(project => project.location === location);
    }

    if (projectSize !== 'Any Size') {
      filtered = filtered.filter(project => project.size === projectSize);
    }

    if (themeFilter !== 'All Themes') {
      filtered = filtered.filter(project => project.theme === themeFilter);
    }

    setFilteredProjects(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchQuery, category, location, projectSize, themeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (page - 1) * projectsPerPage;
  const displayedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  const handleOpenDonateDialog = (newsItem = null) => {
    setSelectedNewsItem(newsItem);
    setOpenDonateDialog(true);
  };

  const handleCloseDonateDialog = () => {
    setOpenDonateDialog(false);
    setSelectedNewsItem(null);
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
    const amount = donationAmount === 'custom' ? customAmount : donationAmount;
    
    // Create cart item with proper structure
    const cartItem = {
      id: Date.now(),
      type: 'donation',
      amount: parseFloat(amount),
      name: selectedNewsItem?.isProject 
        ? `Project Donation: ${selectedNewsItem.title}`
        : `Donation for ${selectedNewsItem.title}`,
      description: selectedNewsItem?.description || '',
      price: parseFloat(amount),
      quantity: 1,
      currency: 'GBP',
      projectId: selectedNewsItem?.isProject ? selectedNewsItem.id : null
    };
    
    try {
      // Add to cart using CartContext
      addToCart(cartItem);
      
      // Close dialog and reset state
      handleCloseDonateDialog();
      
      // Navigate to cart
      navigate('/cart');
      
    } catch (error) {
      console.error('Error adding donation to cart:', error);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call to subscribe the user
      // await axios.post('/api/newsletter/subscribe', { email });
      setShowSubscriptionSuccess(true);
      setEmail('');
      setTimeout(() => {
        setShowSubscriptionSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };

  const impactStats = [
    { value: '24+', label: 'Years' },
    { value: '35,000', label: 'Donors' },
    { value: '$650M+', label: 'Total Donations' },
    { value: '31,000+', label: 'Projects Funded' },
    { value: '55+', label: 'Countries Reached' },
  ];

  const newsItems = [
    {
      title: 'Prose Book',
      description: 'Explore poems from around the world written by the HopeBridge community.',
      buttonText: 'Give Now',
    },
    {
      title: 'Give + Get Matched',
      description: 'This Giving Monday, your favorite causes get even more love.',
      buttonText: 'Give Now',
    },
    {
      title: 'Unwrap a World of Good',
      description: 'Surprise them with the gift of global impact HopeBridge Gift Cards!',
      buttonText: 'Give Now',
    },
  ];

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      {/* Hero Section with Video or Image Background */}
      <Box 
        sx={{ 
          position: 'relative',
          height: '80vh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1470&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" color="white" gutterBottom>
          Make a Difference Today
        </Typography>
          <Typography variant="h5" color="white" mb={4} sx={{ maxWidth: 600 }}>
          Support vetted nonprofits and make a lasting impact in communities worldwide.
        </Typography>
        <Button
          variant="contained"
          color="primary"
            size="large"
          component={RouterLink}
          to="/donations"
            sx={{ mr: 2 }}
        >
          Donate Now
        </Button>
          <Button 
            variant="outlined" 
            color="inherit"
            component={RouterLink}
            to="/events"
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Join an Event
          </Button>
        </Container>
      </Box>

      {/* Mission Statement */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">
          HopeBridge is the largest global crowdfunding community
        </Typography>
        <Typography variant="h6">
          connecting nonprofits, donors, and companies
        </Typography>
        <Typography variant="h6">
          in nearly every country.
        </Typography>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          How it Works
        </Typography>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Non-Profits
                  </Typography>
                  <Typography>
                    Nonprofits around the world apply and join HopeBridge to access funding, build new skills, and to make important connections.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Donors
                  </Typography>
                  <Typography>
                    People like you give to your favorite projects; you feel great when you get updates about how your money is put to work by trusted organizations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Companies
                  </Typography>
                  <Typography>
                    Generous companies and their employees further support faith-driven missions with donations and grants, helping local communities thrive.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Impact Stats */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" gutterBottom>1.2M+</Typography>
              <Typography variant="body1">People Helped</Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <PublicIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" gutterBottom>42</Typography>
              <Typography variant="body1">Countries Reached</Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <VolunteerActivismIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" gutterBottom>£8.5M</Typography>
              <Typography variant="body1">Donations Raised</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Campaigns */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Featured Campaigns
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Support these urgent causes that need your help right now
                </Typography>
          <Grid container spacing={4}>
            {featuredCampaigns.map((campaign) => (
              <Grid item key={campaign.id} xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={campaign.image}
                    alt={campaign.title}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {campaign.title}
                </Typography>
                    <Typography color="text.secondary" paragraph>
                      {campaign.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Raised: £{campaign.raised.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Goal: £{campaign.goal.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ position: 'relative', mt: 1, mb: 2 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: 'grey.200',
                            borderRadius: 4,
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: `${(campaign.raised / campaign.goal) * 100}%`,
                            height: 8,
                            backgroundColor: 'primary.main',
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {campaign.daysLeft} days left
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenDonateDialog(campaign)}
                        >
                          Donate Now
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Our Mission */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1470&auto=format&fit=crop"
                alt="Our Mission"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Our Mission
        </Typography>
              <Typography variant="body1" paragraph>
                At HopeBridge, we believe in creating sustainable change through compassionate action. 
                Our platform connects donors with verified nonprofits around the world, ensuring your 
                contributions make the maximum impact.
          </Typography>
              <Typography variant="body1" paragraph>
                We focus on transparency, accountability, and efficiency in charitable giving. 
                Every donation is tracked, and we provide regular updates on how your generosity 
                is changing lives.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                component={RouterLink}
                to="/about"
                sx={{ mt: 2 }}
              >
                Learn More About Us
              </Button>
            </Grid>
            </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          What People Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {testimonials.map((testimonial) => (
            <Grid item key={testimonial.id} xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      component="img"
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1">{testimonial.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.quote}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          </Grid>
        </Container>

      {/* How to Help Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container>
        <Typography variant="h4" align="center" gutterBottom>
            How You Can Help
        </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1471&auto=format&fit=crop"
                  alt="Donate"
                  sx={{ width: 80, height: 80, mb: 2, borderRadius: '50%', objectFit: 'cover' }}
                />
                <Typography variant="h6" gutterBottom>Donate</Typography>
                <Typography variant="body2">
                  Make a one-time or recurring donation to support our causes. 
                  Even small amounts can make a big difference.
                    </Typography>
                    <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => handleOpenDonateDialog()}
                    >
                      Give Now
                    </Button>
              </Paper>
              </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1527&auto=format&fit=crop"
                  alt="Volunteer"
                  sx={{ width: 80, height: 80, mb: 2, borderRadius: '50%', objectFit: 'cover' }}
                />
                <Typography variant="h6" gutterBottom>Volunteer</Typography>
                <Typography variant="body2">
                  Join our volunteer network and contribute your time and skills 
                  to support our mission and programs.
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  component={RouterLink}
                  to="/events"
                >
                  Get Involved
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop"
                  alt="Fundraise"
                  sx={{ width: 80, height: 80, mb: 2, borderRadius: '50%', objectFit: 'cover' }}
                />
                <Typography variant="h6" gutterBottom>Fundraise</Typography>
                <Typography variant="body2">
                  Start your own fundraising campaign for a cause you care about.
                  Invite friends and family to join your effort.
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  component={RouterLink}
                  to="/nonprofits"
                >
                  Start Campaign
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Projects */}
      <Box sx={{ bgcolor: 'grey.200', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Search Projects
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search for projects, causes, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  label="Location"
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Project Size</InputLabel>
                <Select
                  value={projectSize}
                  onChange={(e) => setProjectSize(e.target.value)}
                  label="Project Size"
                >
                  {projectSizes.map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={themeFilter}
                  onChange={(e) => setThemeFilter(e.target.value)}
                  label="Theme"
                >
                  {themes.map((theme) => (
                    <MenuItem key={theme} value={theme}>{theme}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Search Results */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Search Results ({filteredProjects.length})
              </Typography>
              <Typography variant="body2">Page {page} of {totalPages}</Typography>
            </Box>
            
            <Grid container spacing={3}>
              {displayedProjects.map((project) => (
                <Grid item xs={12} key={project.id}>
                  <Card>
                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={project.image}
                          alt={project.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                    <CardContent>
                      <Typography variant="h6">{project.title}</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {project.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2">
                          Location: {project.location}
                        </Typography>
                        <Typography variant="body2">
                          Category: {project.category}
                        </Typography>
                        <Typography variant="body2">
                          Theme: {project.theme}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>
                          £{project.raised.toLocaleString()} raised of £{project.goal.toLocaleString()}
                        </Typography>
                        <Typography>
                          {Math.round((project.raised / project.goal) * 100)}% funded
                        </Typography>
                      </Box>
                          <Box sx={{ position: 'relative', mt: 2, mb: 2 }}>
                            <Box
                              sx={{
                                width: '100%',
                                height: 8,
                                backgroundColor: 'grey.200',
                                borderRadius: 4,
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: `${(project.raised / project.goal) * 100}%`,
                                height: 8,
                                backgroundColor: 'primary.main',
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleOpenDonateDialog({ 
                          ...project,
                          isProject: true
                        })}
                      >
                        Donate
                      </Button>
                    </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Updated Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(1)}
                sx={{ minWidth: 40, p: 0 }}
              >
                ⟪
              </Button>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{ minWidth: 40, p: 0 }}
              >
                ‹
              </Button>
              <Button
                variant="contained"
                sx={{ 
                  minWidth: 40, 
                  p: 0,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                {page}
              </Button>
              <Button
                variant="outlined"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                sx={{ minWidth: 40, p: 0 }}
              >
                ›
              </Button>
              <Button
                variant="outlined"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
                sx={{ minWidth: 40, p: 0 }}
              >
                ⟫
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Newsletter */}
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Subscribe to our Newsletter
        </Typography>
        <Container maxWidth="sm">
          <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <TextField
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" color="primary" type="submit">
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Cart Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Subscription Success Snackbar */}
      <Snackbar
        open={showSubscriptionSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSubscriptionSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSubscriptionSuccess(false)}>
          Subscription successful!
        </Alert>
      </Snackbar>

      {/* Donation Dialog */}
      <Dialog
        open={openDonateDialog}
        onClose={handleCloseDonateDialog}
        aria-labelledby="donation-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="donation-dialog-title">
          {selectedNewsItem ? (
            selectedNewsItem.isProject 
              ? `Donate to Project: ${selectedNewsItem.title}`
              : `Support ${selectedNewsItem.title}`
          ) : (
            'Make a Donation'
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            {selectedNewsItem ? (
              selectedNewsItem.isProject 
                ? `Support this project: ${selectedNewsItem.description}`
                : selectedNewsItem.description
            ) : (
              'Choose an amount to donate:'
            )}
          </DialogContentText>
          {selectedNewsItem?.isProject && selectedNewsItem.raised && selectedNewsItem.goal && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Project Progress: {Math.round((selectedNewsItem.raised / selectedNewsItem.goal) * 100)}% funded
              </Typography>
              <Typography variant="body2" color="text.secondary">
                £{selectedNewsItem.raised.toLocaleString()} raised of £{selectedNewsItem.goal.toLocaleString()}
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
            disabled={donationAmount === 'custom' && !customAmount}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage; 