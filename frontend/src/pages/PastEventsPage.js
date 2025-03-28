import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link as RouterLink } from 'react-router-dom';

const PastEventsPage = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    fetchPastEvents();
  }, [category, search, page]);

  const fetchPastEvents = async () => {
    try {
      setLoading(true);
      
      // Mock data for development
      setTimeout(() => {
        const allPastEvents = [
          {
            id: 1,
            title: 'London Marathon 2023',
            description: 'Over 2,000 runners joined Team Red Cross for the TCS London Marathon 2023, raising over £500,000 for humanitarian causes.',
            image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1470&auto=format&fit=crop',
            date: '2023-04-23',
            location: 'London',
            category: 'fundraising',
            funds_raised: '£532,000',
            participants: '2,150',
            impact: 'Provided emergency relief to 15,000 people affected by natural disasters.'
          },
          {
            id: 2,
            title: 'International Aid Conference 2023',
            description: 'Leading experts gathered to discuss innovative approaches to humanitarian aid delivery in challenging environments.',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop',
            date: '2023-09-15',
            location: 'Manchester',
            category: 'conference',
            funds_raised: 'N/A',
            participants: '750',
            impact: 'Established new partnerships with 12 international aid organisations.'
          },
          {
            id: 3,
            title: 'Refugee Support Programme 2023',
            description: 'Volunteers provided language support, employment assistance, and social integration to refugees in their new communities.',
            image: 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?q=80&w=1472&auto=format&fit=crop',
            date: '2023-06-20',
            location: 'Multiple Locations',
            category: 'volunteer',
            funds_raised: 'N/A',
            participants: '350',
            impact: 'Supported over 1,200 refugees in their transition to life in the UK.'
          },
          {
            id: 4,
            title: 'Community Gardens Project 2023',
            description: 'Created sustainable community gardens that provided fresh produce for local food banks while bringing communities together.',
            image: 'https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?q=80&w=1470&auto=format&fit=crop',
            date: '2023-05-15',
            location: 'Bristol, Manchester, Edinburgh',
            category: 'community',
            funds_raised: '£15,000',
            participants: '180',
            impact: 'Established 8 community gardens that produced 2 tonnes of fresh produce for food banks.'
          },
          {
            id: 5,
            title: 'Winter Emergency Response 2022',
            description: 'Volunteers provided emergency support during severe winter storms, including shelter, warm meals, and medical assistance.',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1513&auto=format&fit=crop',
            date: '2022-01-10',
            location: 'Northern UK',
            category: 'volunteer',
            funds_raised: 'N/A',
            participants: '420',
            impact: 'Provided emergency support to over 3,000 people affected by extreme weather.'
          },
          {
            id: 6,
            title: 'Charity Gala Dinner 2022',
            description: 'An elegant evening of fine dining and entertainment that raised significant funds for vital humanitarian programmes.',
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1469&auto=format&fit=crop',
            date: '2022-11-25',
            location: 'London',
            category: 'fundraising',
            funds_raised: '£325,000',
            participants: '300',
            impact: 'Funded clean water projects providing safe drinking water to 28,000 people.'
          },
          {
            id: 7,
            title: 'Youth Mental Health Awareness Day 2022',
            description: 'A community-wide event to raise awareness about youth mental health issues and provide resources for support.',
            image: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=1630&auto=format&fit=crop',
            date: '2022-10-10',
            location: 'Nationwide',
            category: 'community',
            funds_raised: '£50,000',
            participants: '5,000',
            impact: 'Connected 1,200 young people with mental health support services.'
          },
          {
            id: 8,
            title: 'Global Health Symposium 2022',
            description: 'Healthcare professionals and researchers gathered to address global health challenges and share innovative solutions.',
            image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&auto=format&fit=crop',
            date: '2022-06-15',
            location: 'Edinburgh',
            category: 'conference',
            funds_raised: 'N/A',
            participants: '600',
            impact: 'Launched 5 new global health research initiatives.'
          },
          {
            id: 9,
            title: 'Emergency First Aid Training 2022',
            description: 'Comprehensive training programme for community volunteers to provide emergency first aid in crisis situations.',
            image: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?q=80&w=1470&auto=format&fit=crop',
            date: '2022-08-22',
            location: 'Multiple Locations',
            category: 'volunteer',
            funds_raised: 'N/A',
            participants: '850',
            impact: 'Trained 850 community first responders who went on to assist in over 300 emergencies.'
          },
          {
            id: 10,
            title: 'International Disaster Response Conference 2021',
            description: 'Experts from around the world shared knowledge and best practices for coordinated disaster response efforts.',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop',
            date: '2021-10-04',
            location: 'London',
            category: 'conference',
            funds_raised: 'N/A',
            participants: '700',
            impact: 'Improved disaster response protocols for 35 international organisations.'
          },
          {
            id: 11,
            title: 'Great North Run 2021',
            description: 'Team Red Cross participants ran the world\'s largest half marathon, raising vital funds for crisis response.',
            image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1485&auto=format&fit=crop',
            date: '2021-09-12',
            location: 'Newcastle',
            category: 'fundraising',
            funds_raised: '£280,000',
            participants: '1,200',
            impact: 'Funded emergency medical care for 20,000 people in conflict zones.'
          },
          {
            id: 12,
            title: 'Community Arts Festival 2021',
            description: 'A celebration of local arts and culture that brought communities together while raising awareness of humanitarian issues.',
            image: 'https://images.unsplash.com/photo-1560541919-eb5c2da6a5a3?q=80&w=1469&auto=format&fit=crop',
            date: '2021-08-15',
            location: 'Bristol',
            category: 'community',
            funds_raised: '£35,000',
            participants: '2,500',
            impact: 'Funded arts therapy programmes for 300 refugees and asylum seekers.'
          },
        ];

        // Filter events based on search criteria
        let filteredEvents = [...allPastEvents];
        
        // Apply category filter
        if (category !== 'all') {
          filteredEvents = filteredEvents.filter(event => 
            event.category === category
          );
        }
        
        // Apply search
        if (search.trim()) {
          const searchLower = search.trim().toLowerCase();
          filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchLower) || 
            event.description.toLowerCase().includes(searchLower) ||
            event.location.toLowerCase().includes(searchLower)
          );
        }
        
        // Sort by date (newest first)
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Paginate
        const total = Math.ceil(filteredEvents.length / eventsPerPage);
        setTotalPages(total);
        
        const startIndex = (page - 1) * eventsPerPage;
        const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);
        
        setPastEvents(paginatedEvents);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching past events:', error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'long' })} ${date.getFullYear()}`;
  };

  return (
    <Box sx={{ bgcolor: '#f7f7f7', py: 4, minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: '40vh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1469406396016-2163d9d702e1?q=80&w=1470&auto=format&fit=crop")',
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
            Past Events & Impact
          </Typography>
          <Typography variant="h5">
            See what we've accomplished together
          </Typography>
        </Container>
      </Box>

      {/* Filters */}
      <Container sx={{ mt: 6, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth
              label="Search events"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="fundraising">Fundraising</MenuItem>
                <MenuItem value="volunteer">Volunteer</MenuItem>
                <MenuItem value="conference">Conferences</MenuItem>
                <MenuItem value="community">Community</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Container>

      {/* Past Events List */}
      <Container>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {pastEvents.length > 0 ? (
                pastEvents.map((event) => (
                  <Grid item key={event.id} xs={12} sm={6} md={4}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={event.image}
                        alt={event.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Chip
                          label={event.category.charAt(0).toUpperCase() + event.category.slice(1)} 
                          size="small"
                          color="primary" 
                          sx={{ mb: 2 }} 
                        />
                        <Typography variant="h5" component="h3" gutterBottom>
                          {event.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {event.location}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {formatDate(event.date)}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" paragraph>
                          {event.description}
                        </Typography>

                        {event.funds_raised !== 'N/A' && (
                          <Typography variant="body2" fontWeight="bold" color="success.main" mt={1}>
                            Funds Raised: {event.funds_raised}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ px: 1 }}>
                          Impact: {event.impact}
                        </Typography>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', width: '100%', py: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    No past events found matching your criteria.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setCategory('all');
                      setSearch('');
                    }}
                  >
                    View All Past Events
                  </Button>
                </Box>
              )}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', py: 6, mt: 8 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h2" color="white" gutterBottom>
                Join Our Upcoming Events
              </Typography>
              <Typography variant="body1" color="white">
                Be part of our future success stories. Check out our upcoming events and get involved today.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={RouterLink}
                to="/events"
              >
                View Upcoming Events
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default PastEventsPage; 