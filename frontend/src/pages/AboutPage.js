import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  Paper,
  CircularProgress,
  Alert,
  CardMedia,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const AboutPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState({
    team_members: [],
    testimonials: [],
    partners: [],
    impact_stats: [],
    mission: '',
    vision: '',
    values: '',
    story: '',
  });

  useEffect(() => {
    const fetchAboutPageData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to the backend
        // const response = await axios.get('/api/about/page-data/');
        // setPageData(response.data);

        // For demo purposes, we'll use the mock data
        setTimeout(() => {
          setPageData({
            team_members: [
              {
                id: 1,
                name: 'Sarah Johnson',
                role: 'Executive Director',
                bio: 'Sarah has over 15 years of experience in nonprofit management and international development.',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop'
              },
              {
                id: 2,
                name: 'Michael Chen',
                role: 'Director of Operations',
                bio: 'Michael leads our global operations team, ensuring efficient aid delivery across all programs.',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop'
              },
              {
                id: 3,
                name: 'Emily Williams',
                role: 'Chief Financial Officer',
                bio: 'Emily oversees our financial strategy, ensuring transparency and accountability in all funding.',
                image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1374&auto=format&fit=crop'
              },
              {
                id: 4,
                name: 'David Patel',
                role: 'Director of Programs',
                bio: 'David develops and manages our program strategies to maximize impact in communities we serve.',
                image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1374&auto=format&fit=crop'
              },
              {
                id: 5,
                name: 'Lisa Martinez',
                role: 'Director of Partnerships',
                bio: 'Lisa builds strategic relationships with corporate partners, foundations and major donors.',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522&auto=format&fit=crop'
              },
              {
                id: 6,
                name: 'James Wilson',
                role: 'Director of Technology',
                bio: 'James leads our digital transformation initiatives and technology infrastructure development.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop'
              }
            ],
            testimonials: [
              {
                id: 1,
                quote: "HopeBridge's support has transformed our community. We've been able to build a new school that serves over 500 children.",
                author: "Maria Gonzalez",
                organization: "Education for All, Mexico",
              },
              {
                id: 2,
                quote: "The funding we received through HopeBridge helped us provide clean water to three villages that previously had no access.",
                author: "Emmanuel Okafor",
                organization: "Clean Water Initiative, Nigeria",
              },
              {
                id: 3,
                quote: "Working with HopeBridge has been seamless. Their platform made it easy for us to share our story and connect with donors worldwide.",
                author: "Priya Sharma",
                organization: "Women's Empowerment Collective, India",
              },
            ],
            impact_stats: [
              { id: 1, title: 'Total Donations', value: '$750M+' },
              { id: 2, title: 'Projects Funded', value: '31,000+' },
              { id: 3, title: 'Countries Reached', value: '175+' },
            ],
            mission: "To transform aid and philanthropy to accelerate community-led change.",
            vision: "Unleashing the potential of people to make positive change happen.",
            values: "Always open, committed to listening and learning, focused on community-led change.",
            story: "HopeBridge is the largest global crowdfunding community connecting nonprofits, donors, and companies in nearly every country. We help fellow nonprofits access the funding, tools, training, and support they need to serve their communities.",
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load about page data. Please try again later.');
        setLoading(false);
        console.error('Error fetching about page data:', err);
      }
    };

    fetchAboutPageData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box 
        sx={{ 
          height: '50vh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1470&auto=format&fit=crop")',
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
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2, color: 'white' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            About HopeBridge
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Building a brighter future through compassionate action
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={RouterLink}
            to="/donations"
          >
            Support Our Mission
          </Button>
        </Container>
      </Box>

      {/* Our Mission Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              At HopeBridge, we're committed to connecting donors with impactful nonprofit organisations worldwide. We believe in creating a transparent and efficient ecosystem that enables meaningful change through collective action.
            </Typography>
            <Typography variant="body1" paragraph>
              Our mission is to empower both donors and nonprofits by providing an innovative platform that simplifies the giving process while maximizing social impact. We envision a world where generosity knows no boundaries and where every contribution, no matter the size, can make a lasting difference.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop"
              alt="Our Mission"
              sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Video Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Our Story
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
            Watch how HopeBridge has grown from a small idea to a global movement
          </Typography>
          
          <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', maxWidth: 800, mx: 'auto' }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8 }}
              src="https://www.youtube.com/embed/RAzyjTSD_Ks"
              title="HopeBridge Story"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        </Container>
      </Box>

      {/* Team Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Our Leadership Team
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
          Meet the dedicated professionals guiding our mission
        </Typography>
        
        <Grid container spacing={4}>
          {pageData.team_members.map((member) => (
            <Grid item key={member.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="280"
                  image={member.image}
                  alt={member.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Values Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Values
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
          The principles that guide everything we do
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1470&auto=format&fit=crop"
                alt="Transparency"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>Transparency</Typography>
                <Typography variant="body2">We believe in complete openness about our operations and impact.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1470&auto=format&fit=crop"
                alt="Innovation"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>Innovation</Typography>
                <Typography variant="body2">Constantly improving our platform and processes for better impact.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1559024094-4a1e4495c3c1?q=80&w=1470&auto=format&fit=crop"
                alt="Collaboration"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>Collaboration</Typography>
                <Typography variant="body2">Working together to achieve greater social impact.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop"
                alt="Integrity"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>Integrity</Typography>
                <Typography variant="body2">Maintaining the highest ethical standards in all we do.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Our Impact */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Our Impact
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
          The difference we're making together
        </Typography>
        
        <Grid container spacing={6} justifyContent="center">
          {pageData.impact_stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }} key={stat.id}>
              <Box
                component="img"
                src={`https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1470&auto=format&fit=crop`}
                alt={stat.title}
                sx={{ width: 120, height: 120, borderRadius: '50%', mb: 2, objectFit: 'cover' }}
              />
              <Typography variant="h3" color="primary" gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="h6">
                {stat.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Journey Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Our Journey
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            Key milestones in our mission to transform HopeBridge
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1606836576983-8b458e75221d?q=80&w=1470&auto=format&fit=crop"
                  alt="2015: Foundation"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>2015: Foundation</Typography>
                  <Typography variant="body2">HopeBridge was founded with a vision to transform charitable giving.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1470&auto=format&fit=crop"
                  alt="2018: Global Expansion"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>2018: Global Expansion</Typography>
                  <Typography variant="body2">Expanded operations to 50+ countries worldwide.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop"
                  alt="2023: Innovation"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>2023: Innovation</Typography>
                  <Typography variant="body2">Launched new platform features and reached £100M in donations.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage; 