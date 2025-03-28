// Campaign data with direct image links
const campaigns = [
  {
    id: 1,
    title: 'Clean Water for Rural Communities',
    description: 'Help us bring clean water to 25 villages in Eastern Africa, benefiting over 15,000 people. This project will install water wells, filtration systems, and provide hygiene education.',
    image: 'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?q=80&w=1470&auto=format&fit=crop',
    targetAmount: 150000,
    raisedAmount: 98750,
    daysLeft: 45,
    location: 'Eastern Africa',
    category: 'Water',
    featured: true
  },
  {
    id: 2,
    title: 'School Rebuilding Project',
    description: 'Support our efforts to rebuild 5 schools damaged by natural disasters in Southeast Asia. The project will create safe, modern learning environments for 2,500 children.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1473&auto=format&fit=crop',
    targetAmount: 200000,
    raisedAmount: 143200,
    daysLeft: 60,
    location: 'Southeast Asia',
    category: 'Education',
    featured: true
  },
  {
    id: 3,
    title: 'Emergency Medical Supplies',
    description: 'Provide essential medical supplies to underequipped clinics in conflict zones. Your support will help medical professionals treat thousands of vulnerable patients.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&auto=format&fit=crop',
    targetAmount: 100000,
    raisedAmount: 87650,
    daysLeft: 15,
    location: 'Middle East',
    category: 'Healthcare',
    featured: true
  },
  {
    id: 4,
    title: 'Sustainable Agriculture Initiative',
    description: 'Empower farming communities with sustainable agriculture techniques and equipment. This project will help 500 farmers increase their crop yields while protecting the environment.',
    image: 'https://images.unsplash.com/photo-1592982573971-2c40ac8d85de?q=80&w=1374&auto=format&fit=crop',
    targetAmount: 120000,
    raisedAmount: 42300,
    daysLeft: 90,
    location: 'South America',
    category: 'Food & Agriculture',
    featured: false
  },
  {
    id: 5,
    title: 'Youth Education Scholarships',
    description: 'Provide educational scholarships to 100 talented but underprivileged students. Your support will cover tuition, books, and living expenses for promising young minds.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1422&auto=format&fit=crop',
    targetAmount: 180000,
    raisedAmount: 95400,
    daysLeft: 75,
    location: 'United Kingdom',
    category: 'Education',
    featured: false
  },
  {
    id: 6,
    title: 'Refugee Support Program',
    description: 'Help provide shelter, food, clothing, and integration support for refugee families. This program will assist 200 families as they rebuild their lives in new communities.',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1470&auto=format&fit=crop',
    targetAmount: 250000,
    raisedAmount: 178900,
    daysLeft: 30,
    location: 'Europe',
    category: 'Humanitarian',
    featured: false
  },
  {
    id: 7,
    title: 'Community Health Workers Training',
    description: 'Train 300 community health workers to provide basic healthcare and health education in rural villages. This project will improve healthcare access for over 30,000 people.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop',
    targetAmount: 80000,
    raisedAmount: 36700,
    daysLeft: 60,
    location: 'West Africa',
    category: 'Healthcare',
    featured: false
  },
  {
    id: 8,
    title: 'Disaster Preparedness Initiative',
    description: 'Help vulnerable communities prepare for natural disasters through training, early warning systems, and resilient infrastructure. This project will protect 25,000 people.',
    image: 'https://images.unsplash.com/photo-1628528272954-b6b0e92afcc2?q=80&w=1374&auto=format&fit=crop',
    targetAmount: 175000,
    raisedAmount: 89300,
    daysLeft: 45,
    location: 'Caribbean',
    category: 'Disaster Relief',
    featured: false
  }
];

// Success story data with images
const successStories = [
  {
    id: 101,
    title: 'Clean Water Initiative',
    description: 'Our clean water campaign in Tanzania successfully installed 50 water wells, providing clean water to over 25,000 people across 20 villages. Local communities now have consistent access to safe drinking water, dramatically reducing waterborne illness rates.',
    image: 'https://images.unsplash.com/photo-1519606652832-adf3c1b227fa?q=80&w=1374&auto=format&fit=crop',
    raised: '£215,000',
    location: 'Tanzania',
    date: 'Completed January 2023'
  },
  {
    id: 102,
    title: 'School Rebuilding Project',
    description: 'After a devastating earthquake, we rebuilt 7 schools in Nepal, providing safe learning environments for 3,500 children. The schools are now earthquake-resistant and equipped with modern facilities, including computer labs and libraries.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1470&auto=format&fit=crop',
    raised: '£350,000',
    location: 'Nepal',
    date: 'Completed October 2022'
  }
];

// Categories with images
const campaignCategories = [
  {
    id: 'all',
    name: 'All Campaigns',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 'Education',
    name: 'Education',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1422&auto=format&fit=crop'
  },
  {
    id: 'Healthcare',
    name: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?q=80&w=1376&auto=format&fit=crop'
  },
  {
    id: 'Water',
    name: 'Clean Water',
    image: 'https://images.unsplash.com/photo-1581600140682-79c57b11808e?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 'Food & Agriculture',
    name: 'Food & Agriculture',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 'Humanitarian',
    name: 'Humanitarian',
    image: 'https://images.unsplash.com/photo-1623192795825-34d26a151abd?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 'Disaster Relief',
    name: 'Disaster Relief',
    image: 'https://images.unsplash.com/photo-1629739884942-3eb43d1e34b5?q=80&w=1473&auto=format&fit=crop'
  }
];

{/* Hero Section */}
<Box
  sx={{
    height: '60vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1470&auto=format&fit=crop")',
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
      Our Campaigns
    </Typography>
    <Typography variant="h5" sx={{ mb: 4 }}>
      Support projects that create lasting change around the world
    </Typography>
    <Button 
      variant="contained" 
      color="secondary" 
      size="large"
      component={RouterLink}
      to="#featured"
    >
      View Featured Campaigns
    </Button>
  </Container>
</Box>

{/* Categories Section */}
<Container sx={{ py: 6 }}>
  <Typography variant="h4" component="h2" align="center" gutterBottom>
    Browse by Category
  </Typography>
  
  <Grid container spacing={2} sx={{ mt: 2 }}>
    {campaignCategories.map((category) => (
      <Grid item key={category.id} xs={6} sm={4} md={3} lg={2}>
        <Card 
          onClick={() => handleCategoryFilter(category.id)}
          sx={{ 
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: '0.3s',
            bgcolor: selectedCategory === category.id ? 'primary.light' : 'background.paper',
            color: selectedCategory === category.id ? 'primary.contrastText' : 'text.primary',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 3
            }
          }}
        >
          <CardMedia
            component="img"
            height="100"
            image={category.image}
            alt={category.name}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
            <Typography variant="subtitle1" align="center">
              {category.name}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>

{/* Featured Campaigns */}
<Box id="featured" sx={{ py: 8, bgcolor: 'grey.100' }}>
  <Container>
    <Typography variant="h4" component="h2" align="center" gutterBottom>
      Featured Campaigns
    </Typography>
    <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
      These campaigns need your urgent support
    </Typography>
    
    <Grid container spacing={4}>
      {campaigns
        .filter(campaign => campaign.featured)
        .map((campaign) => (
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
                height="220"
                image={campaign.image}
                alt={campaign.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip label={campaign.category} size="small" color="primary" />
                  <Chip label={`${campaign.daysLeft} days left`} size="small" color="secondary" />
                </Box>
                
                <Typography variant="h5" component="h3" gutterBottom>
                  {campaign.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {campaign.location}
                  </Typography>
                </Box>
                
                <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                  {campaign.description.length > 120 
                    ? `${campaign.description.substring(0, 120)}...` 
                    : campaign.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>£{(campaign.raisedAmount/100).toLocaleString()}</strong> raised
                    </Typography>
                    <Typography variant="body2">
                      £{(campaign.targetAmount/100).toLocaleString()} goal
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(campaign.raisedAmount / campaign.targetAmount) * 100} 
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleCampaignDetails(campaign.id)}
                >
                  Learn More
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  color="primary"
                  onClick={() => handleDonateClick(campaign.id)}
                >
                  Donate
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  </Container>
</Box>

{/* Impact Video Section */}
<Container sx={{ py: 8 }}>
  <Grid container spacing={6} alignItems="center">
    <Grid item xs={12} md={6}>
      <Typography variant="h4" component="h2" gutterBottom>
        See Your Impact
      </Typography>
      <Typography variant="body1" paragraph>
        Watch how your donations are making a real difference in communities around the world. Our campaigns have helped millions of people gain access to clean water, education, healthcare, and more.
      </Typography>
      <Typography variant="body1" paragraph>
        We're committed to transparency and accountability. You'll receive regular updates on the projects you support, including photos, videos, and impact reports.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        size="large"
        sx={{ mt: 2 }}
        href="#all-campaigns"
      >
        Browse All Campaigns
      </Button>
    </Grid>
    <Grid item xs={12} md={6}>
      <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <iframe
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          src="https://www.youtube.com/embed/QCh6CfA1Spw"
          title="Campaign Impact"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Box>
    </Grid>
  </Grid>
</Container>

{/* Success Stories */}
<Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
  <Container>
    <Typography variant="h4" component="h2" align="center" gutterBottom>
      Success Stories
    </Typography>
    <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
      See how your generosity has transformed communities
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'white' }} />
                <Typography variant="body2">
                  {story.location}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Typography variant="body2">
                  {story.date}
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {story.description}
              </Typography>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Total Raised:
                </Typography>
                <Typography variant="h5">
                  {story.raised}
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                color="inherit"
                sx={{ mt: 2, borderColor: 'white', color: 'white' }}
                onClick={() => handleReadMoreClick(story.id)}
              >
                Read Full Story
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>

{/* All Campaigns */}
<Box id="all-campaigns" sx={{ py: 8 }}>
  <Container>
    <Typography variant="h4" component="h2" align="center" gutterBottom>
      All Campaigns
    </Typography>
    <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
      Browse all our current campaigns
    </Typography>
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search campaigns..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: { xs: '100%', sm: '300px' } }}
      />
      
      <FormControl size="small" sx={{ width: { xs: '100%', sm: '200px' }, mt: { xs: 2, sm: 0 } }}>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="recent">Most Recent</MenuItem>
          <MenuItem value="urgency">Urgency (Days Left)</MenuItem>
          <MenuItem value="progress">Progress (% Raised)</MenuItem>
        </Select>
      </FormControl>
    </Box>
    
    <Grid container spacing={4}>
      {filteredCampaigns.map((campaign) => (
        <Grid item key={campaign.id} xs={12} sm={6} md={4} lg={3}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 4
              }
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={campaign.image}
              alt={campaign.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Chip label={campaign.category} size="small" color="primary" />
                <Chip label={`${campaign.daysLeft} days`} size="small" color="secondary" />
              </Box>
              
              <Typography variant="h6" component="h3" gutterBottom>
                {campaign.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {campaign.location}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    <strong>£{(campaign.raisedAmount/100).toLocaleString()}</strong>
                  </Typography>
                  <Typography variant="body2">
                    {Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(campaign.raisedAmount / campaign.targetAmount) * 100} 
                  sx={{ height: 6, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="primary"
                onClick={() => handleCampaignDetails(campaign.id)}
              >
                Details
              </Button>
              <Button 
                size="small" 
                variant="contained"
                color="primary"
                onClick={() => handleDonateClick(campaign.id)}
              >
                Donate
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
    
    {filteredCampaigns.length === 0 && (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No campaigns found matching your criteria.
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        >
          Reset Filters
        </Button>
      </Box>
    )}
  </Container>
</Box>

{/* Create Campaign CTA */}
<Box 
  sx={{ 
    py: 8, 
    backgroundImage: 'url("https://images.unsplash.com/photo-1519971585347-61b4588c3f26?q=80&w=1470&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1
    }
  }}
>
  <Container sx={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center' }}>
    <Typography variant="h4" component="h2" gutterBottom>
      Start Your Own Campaign
    </Typography>
    <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
      Have a cause you're passionate about? Start your own fundraising campaign and rally your network to make a difference. We provide all the tools and support you need to succeed.
    </Typography>
    <Button 
      variant="contained" 
      color="secondary" 
      size="large"
      onClick={handleCreateCampaignClick}
    >
      Create a Campaign
    </Button>
  </Container>
</Box> 