import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  CircularProgress,
  Link,
  InputAdornment,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

const EventsPage = () => {
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    fetchEvents();
  }, [page, eventType, date, location]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Mock data for development - Updated with British Red Cross related events
      setTimeout(() => {
        const allEvents = [
          {
            id: 1,
            title: 'London Marathon 2025',
            description: 'Join Team Red Cross for the TCS London Marathon 2025. Run through the heart of London and help people in crisis.',
            image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-04-13',
            end_date: '2025-04-13',
            location: 'London',
            event_type: 'fundraising',
            tags: ['CHALLENGE', 'RUNNING'],
            url: 'https://www.redcross.org.uk/get-involved/fundraising-and-events/london-marathon',
          },
          {
            id: 2,
            title: 'Great North Run 2025',
            description: "Take on the world's biggest half marathon. Run from Newcastle to South Shields and make a difference to people in crisis.",
            image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1485&auto=format&fit=crop',
            start_date: '2025-09-07',
            end_date: '2025-09-07',
            location: 'Newcastle',
            event_type: 'fundraising',
            tags: ['CHALLENGE', 'RUNNING'],
            url: 'https://www.redcross.org.uk/get-involved/fundraising-and-events/great-north-run',
          },
          {
            id: 3,
            title: 'Mount Kilimanjaro Trek 2025',
            description: 'Challenge yourself to climb Africa\'s highest peak while raising vital funds for people in crisis. A life-changing adventure awaits.',
            image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-06-15',
            end_date: '2025-06-28',
            location: 'Tanzania',
            event_type: 'fundraising',
            tags: ['CHALLENGE', 'WALKING', 'OVERSEAS'],
            url: 'https://www.redcross.org.uk/get-involved/fundraising-and-events/overseas-challenges',
          },
          {
            id: 4,
            title: 'Arctic Challenge 2025',
            description: 'Experience the adventure of a lifetime in the Arctic Circle. Dog sledding, ice fishing, and northern lights await in this unique challenge.',
            image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-02-20',
            end_date: '2025-03-01',
            location: 'Arctic Circle',
            event_type: 'fundraising',
            tags: ['CHALLENGE', 'ADVENTURE', 'OVERSEAS'],
            url: 'https://www.redcross.org.uk/get-involved/fundraising-and-events/overseas-challenges',
          },
          {
            id: 5,
            title: 'Community Support Weekend',
            description: 'Join thousands across the UK in supporting communities in crisis. Help with local projects that make a real difference.',
            image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-05-04',
            end_date: '2025-05-10',
            location: 'Nationwide',
            event_type: 'community',
            tags: ['SOCIAL', 'COMMUNITY'],
            url: 'https://www.redcross.org.uk/get-involved/volunteer',
          },
          {
            id: 6,
            title: 'Vietnam to Cambodia Cycle 2025',
            description: 'Cycle through stunning landscapes from Vietnam to Cambodia, experiencing Southeast Asian culture while supporting humanitarian causes.',
            image: 'https://images.unsplash.com/photo-1465310477141-6fb93167a273?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-11-01',
            end_date: '2025-11-14',
            location: 'Southeast Asia',
            event_type: 'fundraising',
            tags: ['CHALLENGE', 'CYCLING', 'OVERSEAS'],
            url: 'https://www.redcross.org.uk/get-involved/fundraising-and-events/overseas-challenges',
          },
          {
            id: 7,
            title: 'International Aid Conference 2026',
            description: 'Join leading experts in discussing humanitarian aid strategies and innovative approaches to global challenges.',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1470&auto=format&fit=crop',
            start_date: '2026-03-15',
            end_date: '2026-03-25',
            location: 'London',
            event_type: 'conference',
            tags: ['PROFESSIONAL', 'NETWORKING'],
            url: 'https://www.redcross.org.uk/about-us/what-we-do/international',
          },
          {
            id: 8,
            title: 'Global Health Symposium',
            description: 'A gathering of healthcare professionals, researchers, and aid workers to discuss global health challenges and solutions.',
            image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&auto=format&fit=crop',
            start_date: '2026-05-10',
            end_date: '2026-05-20',
            location: 'Manchester',
            event_type: 'conference',
            tags: ['HEALTH', 'PROFESSIONAL'],
            url: 'https://www.redcross.org.uk/about-us/what-we-do/health-and-social-care',
          },
          {
            id: 9,
            title: 'Community Gardens Project',
            description: 'Help create sustainable community gardens in urban areas that provide fresh produce for local food banks.',
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-08-15',
            end_date: '2025-08-16',
            location: 'Multiple UK Cities',
            event_type: 'volunteer',
            tags: ['ENVIRONMENT', 'COMMUNITY'],
            url: 'https://www.redcross.org.uk/get-involved/volunteer',
          },
          {
            id: 10,
            title: 'Refugee Support Programme',
            description: 'Volunteer to help refugees and asylum seekers settle into their new communities with language support, employment assistance, and more.',
            image: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?q=80&w=1468&auto=format&fit=crop',
            start_date: '2025-06-20',
            end_date: '2025-12-20',
            location: 'Nationwide',
            event_type: 'volunteer',
            tags: ['SOCIAL', 'SUPPORT'],
            url: 'https://www.redcross.org.uk/get-involved/volunteer',
          },
          {
            id: 11,
            title: 'Emergency Response Training',
            description: 'Get trained as an emergency response volunteer to help in times of crisis, from natural disasters to local emergencies.',
            image: 'https://images.unsplash.com/photo-1503435824048-a799a3a84bf7?q=80&w=1374&auto=format&fit=crop',
            start_date: '2025-07-10',
            end_date: '2025-07-12',
            location: 'Birmingham',
            event_type: 'volunteer',
            tags: ['TRAINING', 'EMERGENCY'],
            url: 'https://www.redcross.org.uk/get-involved/volunteer',
          },
          {
            id: 12,
            title: 'Neighbourhood Cleanup Initiative',
            description: 'Join your neighbours in cleaning up local parks and streets, making communities safer and more beautiful for everyone.',
            image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-05-25',
            end_date: '2025-05-25',
            location: 'Various UK Locations',
            event_type: 'community',
            tags: ['ENVIRONMENT', 'LOCAL'],
            url: 'https://www.redcross.org.uk/get-involved/volunteer',
          },
          {
            id: 13,
            title: 'Community Resilience Forum',
            description: 'A conference focused on building stronger, more resilient communities that can withstand and recover from crises.',
            image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-09-22',
            end_date: '2025-09-24',
            location: 'Edinburgh',
            event_type: 'conference',
            tags: ['EDUCATION', 'PLANNING'],
            url: 'https://www.redcross.org.uk/about-us/what-we-do/building-resilient-communities',
          },
          {
            id: 14,
            title: 'Charity Gala Dinner',
            description: 'An elegant evening of fine dining and entertainment to raise funds for vital humanitarian programmes.',
            image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1470&auto=format&fit=crop',
            start_date: '2025-11-15',
            end_date: '2025-11-15',
            location: 'London',
            event_type: 'fundraising',
            tags: ['FORMAL', 'SOCIAL'],
            url: 'https://www.redcross.org.uk/get-involved/fundraising-and-events',
          },
          {
            id: 15,
            title: 'Community Arts Festival',
            description: 'A celebration of local arts and culture, bringing communities together while raising awareness of humanitarian issues.',
            image: 'https://images.unsplash.com/photo-1560541919-eb5c2da6a5a3?q=80&w=1469&auto=format&fit=crop',
            start_date: '2025-08-08',
            end_date: '2025-08-10',
            location: 'Bristol',
            event_type: 'community',
            tags: ['ARTS', 'CULTURE'],
            url: 'https://www.redcross.org.uk/get-involved',
          },
        ];

        // Filter events based on search criteria
        let filteredEvents = [...allEvents]; // Create a new array to avoid mutating the original
        
        console.log('Total events before filtering:', filteredEvents.length);
        console.log('Current event type filter:', eventType);
        
        // Location filter - case insensitive, includes partial matches
        if (location.trim()) {
          filteredEvents = filteredEvents.filter(event => 
            event.location.toLowerCase().includes(location.trim().toLowerCase())
          );
          console.log('Events after location filter:', filteredEvents.length);
        }
        
        // Event type filter - exact match
        if (eventType) {
          filteredEvents = filteredEvents.filter(event => 
            event.event_type.toLowerCase() === eventType.toLowerCase()
          );
          console.log('Events after type filter:', filteredEvents.length);
          console.log('Conference events:', filteredEvents.filter(e => e.event_type === 'conference').map(e => e.title));
        }
        
        // Date filter
        if (date) {
          const today = new Date();
          const filterDate = new Date();
          
          switch(date) {
            case 'this-month': {
              const currentMonth = today.getMonth();
              const currentYear = today.getFullYear();
              filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.start_date);
                return eventDate.getMonth() === currentMonth && 
                       eventDate.getFullYear() === currentYear;
              });
              break;
            }
            case 'next-month': {
              const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1);
              filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.start_date);
                return eventDate.getMonth() === nextMonth.getMonth() && 
                       eventDate.getFullYear() === nextMonth.getFullYear();
              });
              break;
            }
            case 'three-months': {
              const threeMonthsLater = new Date(today);
              threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
              filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.start_date);
                return eventDate >= today && eventDate <= threeMonthsLater;
              });
              break;
            }
            case 'six-months': {
              const sixMonthsLater = new Date(today);
              sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
              filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.start_date);
                return eventDate >= today && eventDate <= sixMonthsLater;
              });
              break;
            }
            case '2025':
              filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.start_date);
                return eventDate.getFullYear() === 2025;
              });
              break;
            case '2026':
              filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.start_date);
                return eventDate.getFullYear() === 2026;
              });
              break;
            default:
              break;
          }
          console.log('Events after date filter:', filteredEvents.length);
        }

        // Sort events by date
        filteredEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

        // Calculate pagination
        const startIndex = (page - 1) * eventsPerPage;
        const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);
        const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

        setEvents(paginatedEvents);
        setTotalPages(totalPages);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchEvents();
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const formatDateRange = (startDate, endDate) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    };
    
    return `${formatDate(startDate)} to ${formatDate(endDate)}`;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (category) => {
    if (category === 'all') {
      setEventType('');
    } else if (category === 'Fundraising') {
      setEventType('fundraising');
    } else if (category === 'Volunteer') {
      setEventType('volunteer');
    } else if (category === 'Conference') {
      setEventType('conference');
    } else if (category === 'Community') {
      setEventType('community');
    }
    setPage(1);
  };

  const handleEventRegister = (event) => {
    // Implement event registration logic
  };

  const handleHostEventClick = () => {
    window.location.href = '/host-event';
  };

  return (
    <Box sx={{ bgcolor: '#f7f7f7', py: 4, minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: '50vh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1470&auto=format&fit=crop")',
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
            Events & Activities
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Join us in making a difference through our events and fundraisers
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => {
              const upcomingSection = document.getElementById('upcoming-events');
              upcomingSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View Upcoming Events
          </Button>
        </Container>
      </Box>

      {/* Event Categories */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={6} sm={4} md={2}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-5px)'
                }
              }}
              onClick={() => handleFilterChange('all')}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1470&auto=format&fit=crop"
                alt="All Events"
                sx={{ width: 80, height: 80, borderRadius: '50%', mb: 1, objectFit: 'cover' }}
              />
              <Typography variant="subtitle1" align="center">
                All Events
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-5px)'
                }
              }}
              onClick={() => handleFilterChange('Fundraising')}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1556484687-30636164638b?q=80&w=1374&auto=format&fit=crop"
                alt="Fundraising"
                sx={{ width: 80, height: 80, borderRadius: '50%', mb: 1, objectFit: 'cover' }}
              />
              <Typography variant="subtitle1" align="center">
                Fundraising
              </Typography>
            </Box>
            </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-5px)'
                }
              }}
              onClick={() => handleFilterChange('Volunteer')}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1470&auto=format&fit=crop"
                alt="Volunteer"
                sx={{ width: 80, height: 80, borderRadius: '50%', mb: 1, objectFit: 'cover' }}
              />
              <Typography variant="subtitle1" align="center">
                Volunteer
              </Typography>
            </Box>
            </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-5px)'
                }
              }}
              onClick={() => handleFilterChange('Conference')}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"
                alt="Conferences"
                sx={{ width: 80, height: 80, borderRadius: '50%', mb: 1, objectFit: 'cover' }}
              />
              <Typography variant="subtitle1" align="center">
                Conferences
              </Typography>
            </Box>
            </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Box
                sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                transition: '0.3s',
                  '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-5px)'
                }
              }}
              onClick={() => handleFilterChange('Community')}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1470&auto=format&fit=crop"
                alt="Community"
                sx={{ width: 80, height: 80, borderRadius: '50%', mb: 1, objectFit: 'cover' }}
              />
              <Typography variant="subtitle1" align="center">
                Community
              </Typography>
            </Box>
          </Grid>
          </Grid>
        </Container>

      {/* Upcoming Events Section */}
      <Box id="upcoming-events" sx={{ py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Upcoming Events
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            Find an event near you and get involved
          </Typography>
          
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.image}
                    alt={event.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip
                      label={event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)} 
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
                        {formatDateRange(event.start_date, event.end_date)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      variant="contained" 
                      color="primary"
                      fullWidth
                      onClick={() => handleEventRegister(event)}
                    >
                      Register
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {events.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                {eventType === 'conference' 
                  ? 'No upcoming conferences events'
                  : 'No events found for the selected category.'}
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => handleFilterChange('all')}
              >
                View All Events
              </Button>
            </Box>
          )}

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
        </Container>
      </Box>

      {/* Impact Video Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/blFLw54vJOI"
                title="Event Impact"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              The Impact of Your Participation
            </Typography>
            <Typography variant="body1" paragraph>
              When you attend our events, you're doing more than just showing up. You're actively contributing to meaningful change around the world.
            </Typography>
            <Typography variant="body1" paragraph>
              Our events have helped us raise millions of pounds for causes ranging from education and healthcare to disaster relief and environmental conservation.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              component={RouterLink}
              to="/past-events"
              sx={{ mt: 2 }}
            >
              See Past Events
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Host Your Own Event */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Host Your Own Fundraising Event
            </Typography>
            <Typography variant="body1" paragraph>
              Want to make a difference in your community? Host your own fundraising event with our support and resources.
            </Typography>
            <Typography variant="body1" paragraph>
              Whether it's a bake sale, charity run, or gala dinner, we'll provide you with the tools, guidance, and promotional support to make your event a success.
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
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              onClick={handleHostEventClick}
            >
              Start Planning Your Event
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1412&auto=format&fit=crop"
              alt="Host Your Own Event"
              sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventsPage; 