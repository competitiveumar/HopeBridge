import React, { useState } from 'react';
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  LinearProgress,
  CardHeader,
  CardMedia,
  CardActions,
  ListItemAvatar,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../context/AuthContext';

// Mock user data
const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  avatar: '/images/avatars/john.jpg',
  joinDate: '2023-01-15',
  totalDonations: 1250,
  campaignsSupported: 8,
};

// Mock donations data
const mockDonations = [
  {
    id: 1,
    campaignId: 1,
    campaignTitle: 'Clean Water Initiative',
    amount: 250,
    date: '2023-05-10',
    status: 'completed',
  },
  {
    id: 2,
    campaignId: 3,
    campaignTitle: 'Emergency Relief Fund',
    amount: 500,
    date: '2023-04-22',
    status: 'completed',
  },
  {
    id: 3,
    campaignId: 2,
    campaignTitle: 'Education for All',
    amount: 100,
    date: '2023-03-15',
    status: 'completed',
  },
  {
    id: 4,
    campaignId: 5,
    campaignTitle: 'Medical Supplies for Clinics',
    amount: 400,
    date: '2023-02-28',
    status: 'completed',
  },
];

// Mock saved campaigns
const mockSavedCampaigns = [
  {
    id: 1,
    title: 'Clean Water Initiative',
    description: 'Providing clean water to communities in need across Africa.',
    image: '/images/campaigns/water.jpg',
    raised: 12500,
    goal: 25000,
    daysLeft: 15,
  },
  {
    id: 6,
    title: 'Women Empowerment Initiative',
    description: 'Supporting women entrepreneurs in developing countries.',
    image: '/images/campaigns/women.jpg',
    raised: 22000,
    goal: 35000,
    daysLeft: 25,
  },
];

const DashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLogout = async () => {
    try {
      // In a real app, this would call the logout function from AuthContext
      // await logout();
      
      // For demo purposes, just redirect to home
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h3" color="primary.main">
              ${mockUser.totalDonations}
            </Typography>
            <Typography variant="body1">Total Donations</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h3" color="primary.main">
              {mockUser.campaignsSupported}
            </Typography>
            <Typography variant="body1">Campaigns Supported</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h3" color="primary.main">
              {mockSavedCampaigns.length}
            </Typography>
            <Typography variant="body1">Saved Campaigns</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Recent Donations
      </Typography>
      <Paper>
        {mockDonations.slice(0, 3).map((donation) => (
          <Box key={donation.id} sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <Typography variant="subtitle1">{donation.campaignTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(donation.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="h6" color="primary.main">
                  ${donation.amount}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/dashboard/donations"
            color="primary"
            onClick={() => setSelectedTab(2)}
          >
            View All Donations
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Saved Campaigns
      </Typography>
      <Grid container spacing={3}>
        {mockSavedCampaigns.map((campaign) => (
          <Grid item key={campaign.id} xs={12} md={6}>
            <Card>
              <Box
                sx={{
                  height: 140,
                  backgroundImage: `url(${campaign.image || 'https://source.unsplash.com/random?charity'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {campaign.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {campaign.description}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      ${campaign.raised.toLocaleString()} raised
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${campaign.goal.toLocaleString()} goal
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(campaign.raised / campaign.goal) * 100}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
                <Button
                  component={RouterLink}
                  to={`/campaigns/${campaign.id}`}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  View Campaign
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Profile Component
  const Profile = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Profile
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2}>
          <Avatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop"
                alt={mockUser.firstName + ' ' + mockUser.lastName}
                sx={{ width: 100, height: 100, mx: 'auto' }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h5" component="h2">
                {mockUser.firstName + ' ' + mockUser.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {mockUser.email}
              </Typography>
              <Typography variant="body2">
                Member since: {new Date(mockUser.joinDate).toLocaleDateString('en-GB')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                size="small"
                sx={{ mb: 1, width: { xs: '100%', md: 'auto' } }}
              >
                Edit Profile
              </Button>
              <br />
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                sx={{ width: { xs: '100%', md: 'auto' } }}
              >
                Create Campaign
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1471&auto=format&fit=crop"
                alt="Total Donated"
                sx={{ width: 60, height: 60, borderRadius: '50%', mb: 2, mx: 'auto', objectFit: 'cover' }}
              />
              <Typography variant="h4" component="div" gutterBottom>
                £{mockUser.totalDonations}
              </Typography>
              <Typography variant="body1">
                Total Donated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1559066653-edfd1e6bbbd5?q=80&w=1470&auto=format&fit=crop"
                alt="Campaigns Supported"
                sx={{ width: 60, height: 60, borderRadius: '50%', mb: 2, mx: 'auto', objectFit: 'cover' }}
              />
              <Typography variant="h4" component="div" gutterBottom>
                {mockUser.campaignsSupported}
              </Typography>
              <Typography variant="body1">
                Campaigns Supported
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1469571486292-b53601019a8a?q=80&w=1470&auto=format&fit=crop"
                alt="People Impacted"
                sx={{ width: 60, height: 60, borderRadius: '50%', mb: 2, mx: 'auto', objectFit: 'cover' }}
              />
              <Typography variant="h4" component="div" gutterBottom>
                {mockSavedCampaigns.length}
              </Typography>
              <Typography variant="body1">
                People Impacted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1574607383476-f517f260d236?q=80&w=1472&auto=format&fit=crop"
                alt="Volunteer Hours"
                sx={{ width: 60, height: 60, borderRadius: '50%', mb: 2, mx: 'auto', objectFit: 'cover' }}
              />
              <Typography variant="h4" component="div" gutterBottom>
                {mockSavedCampaigns.length}
              </Typography>
              <Typography variant="body1">
                Volunteer Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Recent Donations
            </Typography>
      <Paper>
        {mockDonations.slice(0, 3).map((donation) => (
          <Box key={donation.id} sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <Typography variant="subtitle1">{donation.campaignTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(donation.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="h6" color="primary.main">
                  ${donation.amount}
            </Typography>
          </Grid>
        </Grid>
          </Box>
        ))}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/dashboard/donations"
            color="primary"
            onClick={() => setSelectedTab(2)}
          >
            View All Donations
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Saved Campaigns
      </Typography>
      <Grid container spacing={3}>
        {mockSavedCampaigns.map((campaign) => (
          <Grid item key={campaign.id} xs={12} md={6}>
            <Card>
              <Box
                sx={{
                  height: 140,
                  backgroundImage: `url(${campaign.image || 'https://source.unsplash.com/random?charity'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {campaign.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {campaign.description}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      ${campaign.raised.toLocaleString()} raised
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${campaign.goal.toLocaleString()} goal
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(campaign.raised / campaign.goal) * 100}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
                <Button
                  component={RouterLink}
                  to={`/campaigns/${campaign.id}`}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  View Campaign
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Saved Campaigns Component
  const SavedCampaigns = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Saved Campaigns
      </Typography>
      {mockSavedCampaigns.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            You haven't saved any campaigns yet.
          </Typography>
          <Button component={RouterLink} to="/campaigns" variant="contained" color="primary">
            Explore Campaigns
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {mockSavedCampaigns.map((campaign) => (
            <Grid item key={campaign.id} xs={12} md={6}>
              <Card>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${campaign.image || 'https://source.unsplash.com/random?charity'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {campaign.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {campaign.description}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        ${campaign.raised.toLocaleString()} raised
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${campaign.goal.toLocaleString()} goal
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(campaign.raised / campaign.goal) * 100}
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      component={RouterLink}
                      to={`/campaigns/${campaign.id}`}
                      variant="outlined"
                      size="small"
                    >
                      View Campaign
                    </Button>
                    <Button
                      component={RouterLink}
                      to={`/donate?campaign=${campaign.id}`}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Donate
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // Donation History Component
  const DonationHistory = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Donation History
      </Typography>
      {mockDonations.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            You haven't made any donations yet.
          </Typography>
          <Button component={RouterLink} to="/campaigns" variant="contained" color="primary">
            Explore Campaigns
          </Button>
        </Paper>
      ) : (
        <Paper>
          {mockDonations.map((donation, index) => (
            <React.Fragment key={donation.id}>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">{donation.campaignTitle}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(donation.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          donation.status === 'completed'
                            ? 'success.main'
                            : donation.status === 'pending'
                            ? 'warning.main'
                            : 'error.main',
                      }}
                    >
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Typography variant="h5" color="primary.main">
                      ${donation.amount}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={`/campaigns/${donation.campaignId}`}
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      View Campaign
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              {index < mockDonations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>
      )}
    </Box>
  );

  // Settings Component
  const Settings = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Account Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>
        <Typography variant="body1" paragraph>
          Manage your email and notification preferences.
        </Typography>
        <Button variant="contained" color="primary">
          Update Preferences
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <Typography variant="body1" paragraph>
          Update your password to keep your account secure.
        </Typography>
        <Button variant="contained" color="primary">
          Change Password
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Delete Account
        </Typography>
        <Typography variant="body1" paragraph>
          Permanently delete your account and all associated data.
        </Typography>
        <Button variant="outlined" color="error">
          Delete Account
        </Button>
      </Paper>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ mb: 3, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={mockUser.avatar}
                alt={`${mockUser.firstName} ${mockUser.lastName}`}
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1">
                  {mockUser.firstName} {mockUser.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mockUser.email}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                borderRight: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  alignItems: 'flex-start',
                  textAlign: 'left',
                },
              }}
            >
              <Tab
                icon={<DashboardIcon />}
                iconPosition="start"
                label="Dashboard"
                id="vertical-tab-0"
                aria-controls="vertical-tabpanel-0"
              />
              <Tab
                icon={<PersonIcon />}
                iconPosition="start"
                label="Profile"
                id="vertical-tab-1"
                aria-controls="vertical-tabpanel-1"
              />
              <Tab
                icon={<HistoryIcon />}
                iconPosition="start"
                label="Donation History"
                id="vertical-tab-2"
                aria-controls="vertical-tabpanel-2"
              />
              <Tab
                icon={<FavoriteIcon />}
                iconPosition="start"
                label="Saved Campaigns"
                id="vertical-tab-3"
                aria-controls="vertical-tabpanel-3"
              />
              <Tab
                icon={<SettingsIcon />}
                iconPosition="start"
                label="Settings"
                id="vertical-tab-4"
                aria-controls="vertical-tabpanel-4"
              />
            </Tabs>
            <Divider />
            <List>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            <Box
              role="tabpanel"
              hidden={selectedTab !== 0}
              id="vertical-tabpanel-0"
              aria-labelledby="vertical-tab-0"
            >
              {selectedTab === 0 && <DashboardOverview />}
            </Box>
            <Box
              role="tabpanel"
              hidden={selectedTab !== 1}
              id="vertical-tabpanel-1"
              aria-labelledby="vertical-tab-1"
            >
              {selectedTab === 1 && <Profile />}
            </Box>
            <Box
              role="tabpanel"
              hidden={selectedTab !== 2}
              id="vertical-tabpanel-2"
              aria-labelledby="vertical-tab-2"
            >
              {selectedTab === 2 && <DonationHistory />}
            </Box>
            <Box
              role="tabpanel"
              hidden={selectedTab !== 3}
              id="vertical-tabpanel-3"
              aria-labelledby="vertical-tab-3"
            >
              {selectedTab === 3 && <SavedCampaigns />}
            </Box>
            <Box
              role="tabpanel"
              hidden={selectedTab !== 4}
              id="vertical-tabpanel-4"
              aria-labelledby="vertical-tab-4"
            >
              {selectedTab === 4 && <Settings />}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 