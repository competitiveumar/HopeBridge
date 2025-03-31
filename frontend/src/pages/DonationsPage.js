import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  LinearProgress,
  Chip,
  InputLabel,
  Divider,
  Link,
  Snackbar,
  Alert,
  Pagination,
} from '@mui/material';
import axios from 'axios';
// import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../contexts/CartContext';
import { useDonation } from '../contexts/DonationContext';

// Remove the Stripe initialization that's causing errors
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const DonationsPage = () => {
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity, removeFromCart, addOrUpdateDonation } = useCart();
  const { getUpdatedProjectTotal } = useDonation();
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [projects, setProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmounts, setDonationAmounts] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(6);
  
  // Hardcoded projects data
  const allProjects = [
    {
      id: 1,
      title: "Clean Water Initiative",
      description: "Provide clean drinking water to communities in need",
      image: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?q=80&w=1740&auto=format&fit=crop",
      raised: 15000,
      goal: 25000,
      category: "water",
      location: "East Africa"
    },
    {
      id: 2,
      title: "Education for All",
      description: "Support education for underprivileged children",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1740&auto=format&fit=crop",
      raised: 30000,
      goal: 50000,
      category: "education",
      location: "South Asia"
    },
    {
      id: 3,
      title: "Emergency Medical Aid",
      description: "Provide essential medical supplies to remote areas",
      image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?q=80&w=1740&auto=format&fit=crop",
      raised: 45000,
      goal: 75000,
      category: "health",
      location: "Global"
    },
    {
      id: 4,
      title: "Sustainable Agriculture",
      description: "Support local farmers with sustainable farming methods",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop",
      raised: 12000,
      goal: 30000,
      category: "agriculture",
      location: "Southeast Asia"
    },
    {
      id: 5,
      title: "Women's Empowerment",
      description: "Support women entrepreneurs in developing countries",
      image: "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?q=80&w=1740&auto=format&fit=crop",
      raised: 28000,
      goal: 40000,
      category: "empowerment",
      location: "Global"
    },
    {
      id: 6,
      title: "Disaster Relief Fund",
      description: "Emergency support for natural disaster victims",
      image: "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=1740&auto=format&fit=crop",
      raised: 80000,
      goal: 100000,
      category: "emergency",
      location: "Worldwide"
    },
    {
      id: 7,
      title: "Youth Sports Program",
      description: "Provide sports equipment and training for youth",
      image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1740&auto=format&fit=crop",
      raised: 18000,
      goal: 35000,
      category: "youth",
      location: "Urban Communities"
    },
    {
      id: 8,
      title: "Mental Health Support",
      description: "Expand access to mental health services",
      image: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?q=80&w=1740&auto=format&fit=crop",
      raised: 42000,
      goal: 60000,
      category: "health",
      location: "Global"
    },
    {
      id: 9,
      title: "Ocean Cleanup",
      description: "Remove plastic waste from marine ecosystems",
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1740&auto=format&fit=crop",
      raised: 65000,
      goal: 90000,
      category: "environment",
      location: "Coastal Regions"
    },
    {
      id: 10,
      title: "Elderly Care Program",
      description: "Support services for elderly in need",
      image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=1598&auto=format&fit=crop",
      raised: 25000,
      goal: 45000,
      category: "elderly",
      location: "Urban Areas"
    },
    {
      id: 11,
      title: "Wildlife Conservation",
      description: "Protect endangered species and their habitats",
      image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1740&auto=format&fit=crop",
      raised: 55000,
      goal: 80000,
      category: "environment",
      location: "Global"
    },
    {
      id: 12,
      title: "Digital Literacy",
      description: "Provide computer education to underserved communities",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1740&auto=format&fit=crop",
      raised: 32000,
      goal: 50000,
      category: "education",
      location: "Global"
    },
    {
      id: 13,
      title: "Food Security Initiative",
      description: "Combat hunger in vulnerable communities",
      image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=1740&auto=format&fit=crop",
      raised: 38000,
      goal: 70000,
      category: "food",
      location: "Global"
    },
    {
      id: 14,
      title: "Renewable Energy Project",
      description: "Bring solar power to remote villages",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1740&auto=format&fit=crop",
      raised: 70000,
      goal: 120000,
      category: "energy",
      location: "Rural Areas"
    },
    {
      id: 15,
      title: "Art Therapy Program",
      description: "Support healing through creative expression",
      image: "https://images.unsplash.com/photo-1499892477393-f675706cbe6e?q=80&w=1740&auto=format&fit=crop",
      raised: 22000,
      goal: 40000,
      category: "health",
      location: "Global"
    }
  ];

  useEffect(() => {
    fetchProjects();
  }, [category, location, status, sortBy]);

  // Pre-fill donation amounts from cart when component mounts
  useEffect(() => {
    if (projects.length > 0 && cartItems.length > 0) {
      const newDonationAmounts = { ...donationAmounts };
      
      // Check for donation items in cart
      cartItems.forEach(item => {
        if (item.type === 'donation') {
          // Find matching project
          const project = projects.find(p => p.title === item.name);
          if (project) {
            // Pre-fill the donation amount
            newDonationAmounts[project.id] = item.price.toString();
          }
        }
      });
      
      setDonationAmounts(newDonationAmounts);
    }
  }, [projects, cartItems, donationAmounts]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Use the allProjects array instead of mockProjects
      setTimeout(() => {
        setProjects(allProjects);
        
        // Initialize donation amounts
        const amounts = {};
        allProjects.forEach(project => {
          amounts[project.id] = '';
        });
        setDonationAmounts(amounts);
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
      setLoading(false);
    }
  };

  const handleDonationAmountChange = (projectId, value) => {
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (sanitizedValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    // Ensure only 2 decimal places
    const parts = sanitizedValue.split('.');
    if (parts[1] && parts[1].length > 2) return;
    
    setDonationAmounts(prev => ({
      ...prev,
      [projectId]: sanitizedValue
    }));
  };

  const handleDonate = async (projectId) => {
    try {
      const amount = donationAmounts[projectId];
      
      // Validate amount
      if (!amount || isNaN(amount)) {
        setSuccessMessage('Please enter a valid donation amount');
        return;
      }
      
      const numericAmount = parseFloat(amount);
      if (numericAmount <= 0) {
        setSuccessMessage('Donation amount must be greater than 0');
        return;
      }
      
      if (numericAmount > 1000000) {
        setSuccessMessage('Donation amount cannot exceed £1,000,000');
        return;
      }

      const project = allProjects.find(p => p.id === projectId);
      if (!project) {
        setSuccessMessage('Project not found');
        return;
      }
      
      // Format amount to 2 decimal places
      const formattedAmount = numericAmount.toFixed(2);
      
      // Create donation item with complete project details
      const donationItem = {
        id: `donation-${projectId}-${Date.now()}`,
        type: 'donation',
        name: project.title,
        description: project.description,
        amount: parseFloat(formattedAmount),
        price: parseFloat(formattedAmount),
        quantity: 1,
        currency: 'GBP',
        projectId: project.id,
        image: project.image,
        category: project.category,
        organization: project.organization || 'HopeBridge'
      };

      // Add or update the donation in the cart
      const result = addOrUpdateDonation(donationItem);
      
      // Set appropriate success message
      if (result === 'updated') {
        setSuccessMessage(`Donation updated to £${formattedAmount}`);
      } else {
        setSuccessMessage(`£${formattedAmount} donation added to cart`);
      }
      
      // Clear the donation amount for this project
      setDonationAmounts(prev => ({
        ...prev,
        [projectId]: ''
      }));
      
      // Navigate to cart page
      navigate('/cart');
    } catch (err) {
      console.error('Error processing donation:', err);
      setSuccessMessage('Failed to process donation. Please try again.');
    }
  };

  const filteredProjects = category === 'All' 
    ? allProjects 
    : allProjects.filter(project => project.category === category);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  
  // Update currentProjects when filters or pagination changes
  useEffect(() => {
    const paginatedProjects = filteredProjects.slice(
      (page - 1) * projectsPerPage,
      page * projectsPerPage
    );
    setCurrentProjects(paginatedProjects);
  }, [filteredProjects, page, projectsPerPage]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  // Calculate updated project totals including recent donations
  const getDisplayTotal = (project) => {
    if (!project || !project.raised) return 0;
    return getUpdatedProjectTotal(project.id, project.raised);
  };

  // Calculate updated progress percentage
  const getDisplayProgress = (project) => {
    if (!project || !project.raised || !project.goal) return 0;
    const updatedTotal = getDisplayTotal(project);
    const progress = Math.min(Math.round((updatedTotal / project.goal) * 100), 100);
    return progress;
  };

  return (
    <Box sx={{ py: 4, bgcolor: '#f9f9f9' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            For Donations
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Give to make the world a better place
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Category
              </Typography>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  displayEmpty
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="water">Water</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="health">Health</MenuItem>
                  <MenuItem value="environment">Environment</MenuItem>
                  <MenuItem value="emergency">Emergency Relief</MenuItem>
                  <MenuItem value="food">Food Security</MenuItem>
                  <MenuItem value="energy">Energy</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Location
              </Typography>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="United States">United States</MenuItem>
                  <MenuItem value="Africa">Africa</MenuItem>
                  <MenuItem value="Asia">Asia</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="Global">Global</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Status
              </Typography>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        {/* Sort */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Sort by:
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
            >
              <MenuItem value="Most Relevant">Most Relevant</MenuItem>
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Most Funded">Most Funded</MenuItem>
              <MenuItem value="Most Urgent">Most Urgent</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Projects List */}
        {loading ? (
          <LinearProgress />
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : (
          <Box>
            <Grid container spacing={4}>
              {currentProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={project.image}
                      alt={project.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {project.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {project.location}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {getDisplayProgress(project)}% Complete
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            £{getDisplayTotal(project).toLocaleString()} of £{project.goal.toLocaleString()}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={getDisplayProgress(project)} 
                          sx={{ height: 10, borderRadius: 5, mt: 1 }}
                        />
                      </Box>
                      
                      {/* Custom Donation Amount Input */}
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <TextField
                          type="text"
                          size="small"
                          placeholder="Enter donation amount"
                          value={donationAmounts[project.id] || ''}
                          onChange={(e) => handleDonationAmountChange(project.id, e.target.value)}
                          fullWidth
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>£</Typography>,
                          }}
                          helperText="Enter amount between £1 and £1,000,000"
                        />
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 2 }}
                        onClick={() => handleDonate(project.id)}
                        disabled={!donationAmounts[project.id] || isNaN(donationAmounts[project.id]) || parseFloat(donationAmounts[project.id]) <= 0}
                      >
                        Donate Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Pagination */}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      </Container>
      
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={3000} 
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DonationsPage; 