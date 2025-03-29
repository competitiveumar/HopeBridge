// Add donation categories with images
const donationCategories = [
  {
    id: 1,
    title: 'Education',
    description: 'Support education initiatives for children and adults worldwide',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1422&auto=format&fit=crop',
    target: 150000,
    raised: 89750
  },
  {
    id: 2,
    title: 'Healthcare',
    description: 'Provide essential medical services to underserved communities',
    image: 'https://images.unsplash.com/photo-1631815590058-860e4f81e108?q=80&w=1471&auto=format&fit=crop',
    target: 200000,
    raised: 132500
  },
  {
    id: 3,
    title: 'Clean Water',
    description: 'Bring clean water solutions to areas facing water scarcity',
    image: 'https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?q=80&w=1470&auto=format&fit=crop',
    target: 100000,
    raised: 67800
  },
  {
    id: 4,
    title: 'Disaster Relief',
    description: 'Provide immediate assistance to communities affected by disasters',
    image: 'https://images.unsplash.com/photo-1629739884942-3eb43d1e34b5?q=80&w=1473&auto=format&fit=crop',
    target: 250000,
    raised: 198000
  }
];

// Featured campaigns with images
const featuredCampaigns = [
  {
    id: 101,
    title: 'Schools for Tomorrow',
    description: 'Building 10 new schools in rural communities across East Africa',
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?q=80&w=1374&auto=format&fit=crop',
    goal: 100000,
    raised: 67500,
    daysLeft: 45,
    location: 'East Africa'
  },
  {
    id: 102,
    title: 'Clean Water Initiative',
    description: 'Installing water filtration systems in 20 villages in South Asia',
    image: 'https://images.unsplash.com/photo-1504502350688-00f5d59bbdeb?q=80&w=1470&auto=format&fit=crop',
    goal: 75000,
    raised: 48200,
    daysLeft: 30,
    location: 'South Asia'
  },
  {
    id: 103,
    title: 'Emergency Medical Supplies',
    description: 'Delivering essential medical supplies to understaffed rural clinics',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1470&auto=format&fit=crop',
    goal: 50000,
    raised: 32150,
    daysLeft: 20,
    location: 'West Africa'
  }
];

// Success stories with images
const successStories = [
  {
    id: 201,
    title: 'Community Garden Project',
    description: 'How a small grant transformed an urban neighborhood through community gardening',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1470&auto=format&fit=crop',
    impact: '250 families now have access to fresh produce'
  },
  {
    id: 202,
    title: 'Mobile Health Clinic',
    description: 'A fleet of mobile clinics bringing healthcare to remote villages',
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=1470&auto=format&fit=crop',
    impact: 'Over 10,000 patients treated in the first year'
  }
];

// Hero Section
<Box
  sx={{
    height: '60vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop")',
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
      Make a Difference Today
    </Typography>
    <Typography variant="h5" sx={{ mb: 4 }}>
      Your donation can change lives and build stronger communities
    </Typography>
    <Button 
      variant="contained" 
      color="secondary" 
      size="large"
      onClick={() => setOpenDonateDialog(true)}
    >
      Donate Now
    </Button>
  </Container>
</Box>

{/* Donation Categories */}
<Container sx={{ py: 8 }}>
  <Typography variant="h4" component="h2" align="center" gutterBottom>
    Choose a Cause
  </Typography>
  <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
    Support the causes that matter most to you
  </Typography>
  
  <Grid container spacing={4}>
    {donationCategories.map((category) => (
      <Grid item key={category.id} xs={12} sm={6} md={3}>
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
            height="180"
            image={category.image}
            alt={category.title}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {category.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {category.description}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>£{(category.raised/100).toLocaleString()}</strong> raised of £{(category.target/100).toLocaleString()} goal
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(category.raised / category.target) * 100} 
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              color="primary"
              onClick={() => handleCategorySelect(category)}
              fullWidth
            >
              Donate
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>

{/* Impact Video Section */}
<Box sx={{ py: 8, bgcolor: 'grey.100' }}>
  <Container>
    <Grid container spacing={6} alignItems="center">
      <Grid item xs={12} md={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          See Your Impact
        </Typography>
        <Typography variant="body1" paragraph>
          When you donate through HopeBridge, you're making a real difference in people's lives. Watch how your contributions transform communities and create lasting change.
        </Typography>
        <Typography variant="body1" paragraph>
          We ensure that your donations reach the intended beneficiaries and are used efficiently to maximize impact.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={() => setOpenDonateDialog(true)}
        >
          Make a Donation
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src="https://www.youtube.com/embed/QCh6CfA1Spw"
            title="Your Donation Impact"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Box>
      </Grid>
    </Grid>
  </Container>
</Box>

{/* Featured Campaigns */}
<Container sx={{ py: 8 }}>
  <Typography variant="h4" component="h2" align="center" gutterBottom>
    Featured Campaigns
  </Typography>
  <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
    These campaigns need your support right now
  </Typography>
  
  <Grid container spacing={4}>
    {featuredCampaigns.map((campaign) => (
      <Grid item key={campaign.id} xs={12} md={4}>
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
            image={campaign.image}
            alt={campaign.title}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {campaign.location}
              </Typography>
              <Chip label={`${campaign.daysLeft} days left`} size="small" color="secondary" />
            </Box>
            
            <Typography variant="h5" component="h3" gutterBottom>
              {campaign.title}
            </Typography>
            <Typography variant="body2" paragraph>
              {campaign.description}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  <strong>£{(campaign.raised/100).toLocaleString()}</strong> raised
                </Typography>
                <Typography variant="body2">
                  £{(campaign.goal/100).toLocaleString()} goal
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(campaign.raised / campaign.goal) * 100} 
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              color="primary"
              fullWidth
              onClick={() => handleCampaignSelect(campaign)}
            >
              Donate
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>

{/* Success Stories */}
<Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
  <Container>
    <Typography variant="h4" component="h2" align="center" gutterBottom>
      Success Stories
    </Typography>
    <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
      See how your donations have made a difference
    </Typography>
    
    <Grid container spacing={6}>
      {successStories.map((story, index) => (
        <Grid item key={story.id} xs={12}>
          <Grid container spacing={4} alignItems="center" direction={index % 2 === 0 ? 'row' : 'row-reverse'}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={story.image}
                alt={story.title}
                sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {story.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {story.description}
              </Typography>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Impact:
                </Typography>
                <Typography variant="body1">
                  {story.impact}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>

{/* Why Donate Section */}
<Container sx={{ py: 8 }}>
  <Typography variant="h4" component="h2" align="center" gutterBottom>
    Why Donate Through HopeBridge?
  </Typography>
  <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
    We ensure your donation creates the greatest possible impact
  </Typography>
  
  <Grid container spacing={4}>
    <Grid item xs={12} sm={6} md={3}>
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop"
          alt="Transparency"
          sx={{ width: 120, height: 120, borderRadius: '50%', mb: 2, objectFit: 'cover' }}
        />
        <Typography variant="h6" gutterBottom>
          100% Transparency
        </Typography>
        <Typography variant="body2">
          Track exactly where your donation goes and the impact it creates
        </Typography>
      </Box>
    </Grid>
    
    <Grid item xs={12} sm={6} md={3}>
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop"
          alt="Low Fees"
          sx={{ width: 120, height: 120, borderRadius: '50%', mb: 2, objectFit: 'cover' }}
        />
        <Typography variant="h6" gutterBottom>
          Low Overhead
        </Typography>
        <Typography variant="body2">
          We ensure that more of your donation reaches those in need
        </Typography>
      </Box>
    </Grid>
    
    <Grid item xs={12} sm={6} md={3}>
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1336&auto=format&fit=crop"
          alt="Verified Projects"
          sx={{ width: 120, height: 120, borderRadius: '50%', mb: 2, objectFit: 'cover' }}
        />
        <Typography variant="h6" gutterBottom>
          Verified Projects
        </Typography>
        <Typography variant="body2">
          All projects are carefully vetted to ensure legitimacy and impact
        </Typography>
      </Box>
    </Grid>
    
    <Grid item xs={12} sm={6} md={3}>
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1590402494610-2c378a9114c6?q=80&w=1470&auto=format&fit=crop"
          alt="Tax Benefits"
          sx={{ width: 120, height: 120, borderRadius: '50%', mb: 2, objectFit: 'cover' }}
        />
        <Typography variant="h6" gutterBottom>
          Tax Benefits
        </Typography>
        <Typography variant="body2">
          Receive tax deduction receipts for all your eligible donations
        </Typography>
      </Box>
    </Grid>
  </Grid>
</Container> 