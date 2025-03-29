import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box, 
  Chip, 
  Divider, 
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Tab,
  Tabs,
  Paper,
  IconButton,
  CardActionArea,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Stack,
  Avatar,
  Link
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Share as ShareIcon, 
  Favorite as FavoriteIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

// Featured Story Component
const FeaturedStory = ({ story }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{
        mb: 6, 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: theme.shadows[10],
      }}
    >
      <CardMedia
        component="img"
        height="500"
        image={story.image}
        alt={story.title}
        sx={{
          filter: 'brightness(0.7)',
        }}
      />
          <Box
            sx={{
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              p: { xs: 3, md: 6 },
          color: 'white'
            }}
          >
            <Chip 
              label={story.category} 
          sx={{ mb: 2, bgcolor: theme.palette.primary.main, color: 'white' }}
            />
        <Typography variant="h3" component="h2" gutterBottom>
              {story.title}
            </Typography>
        <Typography variant="subtitle1" paragraph sx={{ mb: 3, maxWidth: '800px' }}>
              {story.excerpt}
            </Typography>
            <Button 
              variant="contained"
          component="a"
              href={story.externalLink}
              target="_blank"
              rel="noopener noreferrer"
          color="primary"
          endIcon={<ArrowForwardIcon />}
            >
              Read Full Story
            </Button>
          </Box>
    </Card>
  );
};

// Article Card Component
const ArticleCard = ({ article }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={article.image}
        alt={article.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={article.category} 
            size="small" 
            color="primary" 
            sx={{ mr: 1 }} 
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption" sx={{ mr: 2 }}>
              {new Date(article.date).toLocaleDateString()}
            </Typography>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">
              5 min read
          </Typography>
          </Box>
        </Box>
        
        <Typography variant="h6" component="h3" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {article.excerpt}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar sx={{ width: 24, height: 24, mr: 1 }} alt={article.author}>
            {article.author[0]}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {article.author}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          color="primary" 
          component="a"
          href={article.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon />}
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
};

// Video Card Component
const VideoCard = ({ video }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={video.category} 
            size="small" 
            color="primary" 
            sx={{ mr: 1 }} 
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
            {new Date(video.date).toLocaleDateString()}
          </Typography>
        </Box>
        
        <Typography variant="h6" component="h3" gutterBottom>
          {video.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {video.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Blog = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [featuredStory, setFeaturedStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    date: 'all',
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const itemsPerPage = 6;
  
  // Mock data for articles
  const mockArticles = [
    {
      id: 1,
      title: "Clean Water Initiative Transforms Rural Communities",
      excerpt: "Our latest clean water project has successfully brought safe drinking water to over 20,000 people in East Africa.",
      content: "Extended article content about clean water initiatives...",
      image: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?q=80&w=1740&auto=format&fit=crop",
      category: "Water",
      date: "2024-03-10",
      author: "Sarah Johnson",
      externalLink: "https://water.org/our-impact/all-stories/clean-water-transforms-rural-community/",
      featured: true
    },
    {
      id: 2,
      title: "Education Program Reaches 10,000 Children",
      excerpt: "Our education initiative has now provided quality learning opportunities to 10,000 children in underserved areas.",
      content: "Extended article content about education programs...",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1740&auto=format&fit=crop",
      category: "Education",
      date: "2024-03-05",
      author: "Michael Chen",
      externalLink: "https://www.unicef.org/education",
      featured: false
    },
    {
      id: 3,
      title: "Emergency Response Team Deployed After Flooding",
      excerpt: "Our rapid response team has provided immediate relief to communities affected by severe flooding in Southeast Asia.",
      content: "Extended article content about emergency response...",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1740&auto=format&fit=crop",
      category: "Emergency",
      date: "2024-03-02",
      author: "David Miller",
      externalLink: "https://www.redcross.org/about-us/news-and-events/news/2020/red-cross-responds-to-flooding-across-multiple-states.html",
      featured: false
    },
    {
      id: 4,
      title: "Sustainable Farming Techniques Boost Local Economy",
      excerpt: "Farmers implementing our sustainable agriculture practices have seen a 40% increase in crop yields.",
      content: "Extended article content about sustainable farming...",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop",
      category: "Agriculture",
      date: "2024-02-28",
      author: "Emma Thompson",
      externalLink: "https://www.fao.org/sustainability/success-stories/en/",
      featured: false
    },
    {
      id: 5,
      title: "New Mental Health Services Launched",
      excerpt: "We've expanded our mental health support programs to reach more communities in need.",
      content: "Extended article content about mental health services...",
      image: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?q=80&w=1740&auto=format&fit=crop",
      category: "Health",
      date: "2024-02-25",
      author: "Dr. Rachel Green",
      externalLink: "https://www.who.int/news-room/feature-stories/mental-health",
      featured: false
    },
    {
      id: 6,
      title: "Ocean Cleanup Initiative Removes 5 Tons of Plastic",
      excerpt: "Our volunteers have successfully removed 5 tons of plastic waste from coastal areas this month.",
      content: "Extended article content about ocean cleanup...",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1740&auto=format&fit=crop",
      category: "Environment",
      date: "2024-02-20",
      author: "James Wilson",
      externalLink: "https://oceana.org/blog/",
      featured: false
    },
    {
      id: 7,
      title: "Women Entrepreneurs: Success Through Microfinance",
      excerpt: "Our microfinance program has helped 500 women launch successful small businesses.",
      content: "Extended article content about women entrepreneurs...",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1740&auto=format&fit=crop",
      category: "Empowerment",
      date: "2024-02-15",
      author: "Lisa Martinez",
      externalLink: "https://www.kiva.org/blog/celebrating-women-funded-by-kiva",
      featured: false
    },
    {
      id: 8,
      title: "Digital Education Bridging Rural-Urban Divide",
      excerpt: "Our technology programs are helping rural students access quality educational resources.",
      content: "Extended article content about digital education...",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1740&auto=format&fit=crop",
      category: "Education",
      date: "2024-02-10",
      author: "Alex Kumar",
      externalLink: "https://www.code.org/about/impact",
      featured: false
    },
    {
      id: 9,
      title: "Food Security Program Expands to New Regions",
      excerpt: "Our food security initiative has expanded to reach communities facing severe hunger challenges.",
      content: "Extended article content about food security...",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1740&auto=format&fit=crop",
      category: "Food",
      date: "2024-02-05",
      author: "Maria Rodriguez",
      externalLink: "https://www.wfp.org/stories",
      featured: false
    },
    {
      id: 10,
      title: "Solar Power Project Lights Up Remote Villages",
      excerpt: "Our renewable energy initiative has brought electricity to 15 previously unconnected villages.",
      content: "Extended article content about solar power...",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1740&auto=format&fit=crop",
      category: "Energy",
      date: "2024-02-01",
      author: "Thomas Anderson",
      externalLink: "https://www.irena.org/newsroom/articles",
      featured: false
    },
    {
      id: 11,
      title: "Youth Sports Program Reaches Milestone",
      excerpt: "Our youth development through sports initiative celebrates 5 years of impact.",
      content: "Extended article content about youth sports...",
      image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1740&auto=format&fit=crop",
      category: "Youth",
      date: "2024-01-28",
      author: "Chris Taylor",
      externalLink: "https://www.unicef.org/sports-for-development/sport-and-child-development",
      featured: false
    },
    {
      id: 12,
      title: "Wildlife Conservation Success: Endangered Species Recovery",
      excerpt: "Our conservation efforts have led to population growth for three endangered species.",
      content: "Extended article content about wildlife conservation...",
      image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1740&auto=format&fit=crop",
      category: "Environment",
      date: "2024-01-25",
      author: "Dr. Emily White",
      externalLink: "https://www.worldwildlife.org/stories",
      featured: false
    },
    {
      id: 13,
      title: "Refugee Education Initiative Launches",
      excerpt: "Our new program provides educational opportunities for displaced children in camps.",
      content: "Extended article content about refugee education...",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1740&auto=format&fit=crop",
      category: "Education",
      date: "2024-01-20",
      author: "Aisha Nazari",
      externalLink: "https://www.unrefugees.org/news/",
      featured: false
    },
    {
      id: 14,
      title: "Healthcare Access Expanded in Remote Communities",
      excerpt: "Our mobile clinics have provided essential healthcare to over 5,000 people in hard-to-reach areas.",
      content: "Extended article content about healthcare access...",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop",
      category: "Health",
      date: "2024-01-15",
      author: "Dr. Mia Roberts",
      externalLink: "https://www.doctorswithoutborders.org/what-we-do/news-stories",
      featured: false
    },
    {
      id: 15,
      title: "Indigenous Knowledge Preservation Project",
      excerpt: "Our cultural heritage initiatives are helping document and preserve traditional wisdom.",
      content: "Extended article content about indigenous knowledge...",
      image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?q=80&w=1729&auto=format&fit=crop",
      category: "Culture",
      date: "2024-01-10",
      author: "Maya Johnson",
      externalLink: "https://www.culturalsurvival.org/news",
      featured: false
    },
    {
      id: 16,
      title: "Disaster Preparedness Training Saves Lives",
      excerpt: "Communities trained in our disaster response program showed remarkable resilience during recent storms.",
      content: "Extended article content about disaster preparedness...",
      image: "https://images.unsplash.com/photo-1554232682-b9ef9c92f8de?q=80&w=1740&auto=format&fit=crop",
      category: "Emergency",
      date: "2024-01-05",
      author: "Carlos Mendez",
      externalLink: "https://www.mercycorps.org/blog",
      featured: false
    },
    {
      id: 17,
      title: "Ethical Fashion Initiative: Supporting Artisans",
      excerpt: "Our fair trade fashion program now supports over 200 artisans across three countries.",
      content: "Extended article content about ethical fashion...",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1740&auto=format&fit=crop",
      category: "Sustainability",
      date: "2023-12-28",
      author: "Nina Chen",
      externalLink: "https://www.fashionrevolution.org/",
      featured: false
    },
    {
      id: 18,
      title: "Clean Cooking Initiative Improves Health Outcomes",
      excerpt: "Families using our improved cookstoves report significant health benefits and reduced fuel consumption.",
      content: "Extended article content about clean cooking...",
      image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=1740&auto=format&fit=crop",
      category: "Health",
      date: "2023-12-20",
      author: "Dr. Samuel Osei",
      externalLink: "https://cleancooking.org/impact-stories/",
      featured: false
    },
  ];
  
  // Mock data for videos
  const mockVideos = [
    {
      id: 1,
      title: "The Impact of Clean Water on Communities",
      description: "See how access to clean water transforms lives in rural villages.",
      youtubeId: "TSbYtoj4chM",
      category: "Water",
      date: "2024-03-01"
    },
    {
      id: 2,
      title: "Education Changes Everything: School Building Project",
      description: "Watch our team build a new school in an underserved community.",
      youtubeId: "IvSL9tuvYOc",
      category: "Education",
      date: "2024-02-20"
    },
    {
      id: 3,
      title: "Emergency Response in Action",
      description: "Our disaster relief team providing immediate aid after recent flooding.",
      youtubeId: "Q_NSF7D87fs",
      category: "Emergency",
      date: "2024-02-15"
    },
    {
      id: 4,
      title: "Sustainable Farming Techniques",
      description: "Learn about the eco-friendly farming methods we're implementing.",
      youtubeId: "78_1abjPvHk",
      category: "Agriculture",
      date: "2024-02-10"
    },
    {
      id: 5,
      title: "Mental Health Support Programs",
      description: "How our counseling services are helping communities heal.",
      youtubeId: "Xi6QFK3N7tQ",
      category: "Health",
      date: "2024-02-05"
    },
    {
      id: 6,
      title: "Ocean Cleanup: Volunteers in Action",
      description: "Join our volunteers as they clean coastal areas and protect marine life.",
      youtubeId: "lXMBbY8xCRA",
      category: "Environment",
      date: "2024-01-25"
    },
    {
      id: 7,
      title: "Women Entrepreneurs: Success Stories",
      description: "Meet the women who have transformed their lives through our microfinance program.",
      youtubeId: "inZx9snY4hw",
      category: "Empowerment",
      date: "2024-01-20"
    },
    {
      id: 8,
      title: "Digital Literacy in Rural Areas",
      description: "How technology education is bridging the digital divide.",
      youtubeId: "7RDIzrmzjuQ",
      category: "Education",
      date: "2024-01-15"
    }
  ];
  
  useEffect(() => {
    fetchData();
  }, [tab, currentPage, search, filters]);
  
    const fetchData = async () => {
      try {
        setLoading(true);
      // Simulating API call with mock data
      setTimeout(() => {
        // Set featured story
        setFeaturedStory(mockArticles.find(article => article.featured));
        
        let filteredItems = [];
        if (tab === 0) {
          filteredItems = mockArticles;
        } else {
          filteredItems = mockVideos;
        }
        
        // Apply category filter if not 'all'
        if (filters.category !== 'all') {
          filteredItems = filteredItems.filter(item => 
            item.category.toLowerCase() === filters.category.toLowerCase()
          );
        }
        
        // Apply date filter
        if (filters.date !== 'all') {
          const now = new Date();
          let filterDate = new Date();
          
          switch(filters.date) {
            case 'week':
              filterDate.setDate(now.getDate() - 7);
              break;
            case 'month':
              filterDate.setMonth(now.getMonth() - 1);
              break;
            case 'year':
              filterDate.setFullYear(now.getFullYear() - 1);
              break;
            default:
              break;
          }
          
          filteredItems = filteredItems.filter(item => 
            new Date(item.date) >= filterDate
          );
        }
        
        // Apply search if provided
        if (search) {
          const searchLower = search.toLowerCase();
          filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(searchLower) || 
            (item.excerpt && item.excerpt.toLowerCase().includes(searchLower)) ||
            (item.description && item.description.toLowerCase().includes(searchLower))
          );
        }
        
        // Calculate total pages
        const total = Math.ceil(filteredItems.length / itemsPerPage);
        setTotalPages(total);
        
        // Paginate results
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredItems.slice(start, end);
        
        // Set data based on current tab
        if (tab === 0) {
          setArticles(paginatedItems);
        } else {
          setVideos(paginatedItems);
        }
        
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setCurrentPage(1);
  };
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      date: 'all'
    });
    setSearch('');
    setCurrentPage(1);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Title */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Our Stories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover the impact of our work and the stories of those we've helped
        </Typography>
      </Box>
      
      {/* Featured Story */}
      {featuredStory && <FeaturedStory story={featuredStory} />}
      
      {/* Tabs and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Tabs 
              value={tab} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Articles" />
              <Tab label="Videos" />
            </Tabs>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <TextField
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                size="small"
                sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
                variant="outlined" 
            startIcon={<FilterListIcon />}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                Filter
              </Button>
              {(filters.category !== 'all' || filters.date !== 'all' || search) && (
                <Button 
                  variant="text" 
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                >
                  Clear
          </Button>
              )}
        </Box>
          </Grid>
              </Grid>

        {/* Filter Panel */}
        <Collapse in={filterOpen}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="water">Water</MenuItem>
                    <MenuItem value="education">Education</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                    <MenuItem value="agriculture">Agriculture</MenuItem>
                    <MenuItem value="health">Health</MenuItem>
                    <MenuItem value="environment">Environment</MenuItem>
                    <MenuItem value="empowerment">Empowerment</MenuItem>
                    <MenuItem value="food">Food</MenuItem>
                    <MenuItem value="energy">Energy</MenuItem>
                    <MenuItem value="culture">Culture</MenuItem>
                    <MenuItem value="sustainability">Sustainability</MenuItem>
                    <MenuItem value="youth">Youth</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Date</InputLabel>
                  <Select
                    value={filters.date}
                    label="Date"
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      </Box>

      {/* Main Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Articles */}
          {tab === 0 && (
            <Grid container spacing={3}>
              {articles.length > 0 ? (
                articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <ArticleCard article={article} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography align="center" color="text.secondary">
                    No articles found matching your criteria
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
          
          {/* Videos */}
          {tab === 1 && (
            <Grid container spacing={3}>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <Grid item xs={12} sm={6} md={4} key={video.id}>
                    <VideoCard video={video} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography align="center" color="text.secondary">
                    No videos found matching your criteria
                  </Typography>
                </Grid>
              )}
      </Grid>
          )}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange}
          color="primary" 
            size="large"
        />
      </Box>
      )}
    </Container>
  );
};

export default Blog; 