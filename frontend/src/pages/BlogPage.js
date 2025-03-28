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
  Pagination,
  Chip,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Clean Water Initiative Transforms Rural Communities",
      description: "Our latest clean water project has successfully brought safe drinking water to over 20,000 people in East Africa.",
      image: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?q=80&w=1740&auto=format&fit=crop",
      category: "Water",
      date: "March 10, 2024",
      readTime: "5 min read",
      author: "Sarah Johnson",
      link: "https://water.org/our-impact/all-stories/clean-water-transforms-rural-community/"
    },
    {
      id: 2,
      title: "Education Program Reaches 10,000 Children",
      description: "Our education initiative has now provided quality learning opportunities to 10,000 children in underserved areas.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1740&auto=format&fit=crop",
      category: "Education",
      date: "March 5, 2024",
      readTime: "4 min read",
      author: "Michael Chen",
      link: "https://www.unicef.org/education"
    },
    {
      id: 3,
      title: "Emergency Response Team Deployed After Flooding",
      description: "Our rapid response team has provided immediate relief to communities affected by severe flooding in Southeast Asia.",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1740&auto=format&fit=crop",
      category: "Emergency",
      date: "March 2, 2024",
      readTime: "6 min read",
      author: "David Miller",
      link: "https://www.redcross.org/about-us/news-and-events/news/2020/red-cross-responds-to-flooding-across-multiple-states.html"
    },
    {
      id: 4,
      title: "Sustainable Farming Techniques Boost Local Economy",
      description: "Farmers implementing our sustainable agriculture practices have seen a 40% increase in crop yields.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop",
      category: "Agriculture",
      date: "February 28, 2024",
      readTime: "7 min read",
      author: "Emma Thompson",
      link: "https://www.fao.org/sustainability/success-stories/en/"
    },
    {
      id: 5,
      title: "New Mental Health Services Launched",
      description: "We've expanded our mental health support programs to reach more communities in need.",
      image: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?q=80&w=1740&auto=format&fit=crop",
      category: "Health",
      date: "February 25, 2024",
      readTime: "5 min read",
      author: "Dr. Rachel Green",
      link: "https://www.who.int/news-room/feature-stories/mental-health"
    },
    {
      id: 6,
      title: "Ocean Cleanup Initiative Removes 5 Tons of Plastic",
      description: "Our volunteers have successfully removed 5 tons of plastic waste from coastal areas this month.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1740&auto=format&fit=crop",
      category: "Environment",
      date: "February 20, 2024",
      readTime: "4 min read",
      author: "James Wilson",
      link: "https://oceana.org/blog/"
    },
    {
      id: 7,
      title: "Women Entrepreneurs: Success Through Microfinance",
      description: "Our microfinance program has helped 500 women launch successful small businesses.",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1740&auto=format&fit=crop",
      category: "Empowerment",
      date: "February 15, 2024",
      readTime: "8 min read",
      author: "Lisa Martinez",
      link: "https://www.kiva.org/blog/celebrating-women-funded-by-kiva"
    },
    {
      id: 8,
      title: "Digital Education Bridging Rural-Urban Divide",
      description: "Our technology programs are helping rural students access quality educational resources.",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1740&auto=format&fit=crop",
      category: "Education",
      date: "February 10, 2024",
      readTime: "6 min read",
      author: "Alex Kumar",
      link: "https://www.code.org/about/impact"
    },
    {
      id: 9,
      title: "Food Security Program Expands to New Regions",
      description: "Our food security initiative has expanded to reach communities facing severe hunger challenges.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1740&auto=format&fit=crop",
      category: "Food",
      date: "February 5, 2024",
      readTime: "5 min read",
      author: "Maria Rodriguez",
      link: "https://www.wfp.org/stories"
    },
    {
      id: 10,
      title: "Solar Power Project Lights Up Remote Villages",
      description: "Our renewable energy initiative has brought electricity to 15 previously unconnected villages.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1740&auto=format&fit=crop",
      category: "Energy",
      date: "February 1, 2024",
      readTime: "4 min read",
      author: "Thomas Anderson",
      link: "https://www.irena.org/newsroom/articles"
    },
    {
      id: 11,
      title: "Youth Sports Program Reaches Milestone",
      description: "Our youth development through sports initiative celebrates 5 years of impact.",
      image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1740&auto=format&fit=crop",
      category: "Youth",
      date: "January 28, 2024",
      readTime: "3 min read",
      author: "Chris Taylor",
      link: "https://www.unicef.org/sports-for-development/sport-and-child-development"
    },
    {
      id: 12,
      title: "Wildlife Conservation Success: Endangered Species Recovery",
      description: "Our conservation efforts have led to population growth for three endangered species.",
      image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1740&auto=format&fit=crop",
      category: "Environment",
      date: "January 25, 2024",
      readTime: "7 min read",
      author: "Dr. Emily White",
      link: "https://www.worldwildlife.org/stories"
    },
    {
      id: 13,
      title: "New Hope for Refugee Children",
      description: "Our new education centers in refugee camps are providing stability and hope to displaced children.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1740&auto=format&fit=crop",
      category: "Refugees",
      date: "January 20, 2024",
      readTime: "6 min read",
      author: "Amira Hassan",
      link: "https://www.unrefugees.org/news/"
    },
    {
      id: 14,
      title: "Clean Cooking Solutions Improve Health Outcomes",
      description: "Our clean cooking initiative has reduced respiratory illnesses by 60% in participating communities.",
      image: "https://images.unsplash.com/photo-1594054156572-49e33dce198a?q=80&w=1740&auto=format&fit=crop",
      category: "Health",
      date: "January 15, 2024",
      readTime: "5 min read",
      author: "Dr. Samuel Osei",
      link: "https://cleancooking.org/impact-stories/"
    },
    {
      id: 15,
      title: "Preserving Indigenous Cultural Heritage",
      description: "Our cultural preservation project is helping indigenous communities document and share their traditions.",
      image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?q=80&w=1729&auto=format&fit=crop",
      category: "Culture",
      date: "January 10, 2024",
      readTime: "8 min read",
      author: "Maya Johnson",
      link: "https://www.culturalsurvival.org/news"
    },
    {
      id: 16,
      title: "Tech for Good: Innovation Challenge Winners Announced",
      description: "Meet the social entrepreneurs using technology to solve pressing global challenges.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1740&auto=format&fit=crop",
      category: "Technology",
      date: "January 5, 2024",
      readTime: "6 min read",
      author: "Raj Patel",
      link: "https://www.techforgood.cloud/articles"
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get current posts based on pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  
  // Filter posts by category if needed
  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());
  
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Change page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };
  
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };
  
  // Get unique categories
  const categories = ['all', ...new Set(blogPosts.map(post => post.category.toLowerCase()))];

  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Our Stories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover the impact of our work through stories from around the world
        </Typography>
      </Box>
      
      {/* Category Filter */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.filter(cat => cat !== 'all').map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Featured Post */}
      {currentPage === 1 && selectedCategory === 'all' && (
        <Card sx={{ mb: 6, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
          <CardMedia
            component="img"
            height="500"
            image={blogPosts[0].image}
            alt={blogPosts[0].title}
            sx={{ filter: 'brightness(0.7)' }}
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
            <Chip label={blogPosts[0].category} sx={{ mb: 2, bgcolor: 'primary.main', color: 'white' }} />
            <Typography variant="h3" component="h2" gutterBottom>
              {blogPosts[0].title}
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{ mb: 3, maxWidth: '800px' }}>
              {blogPosts[0].description}
            </Typography>
            <Button 
              variant="contained" 
              component="a"
              href={blogPosts[0].link}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              Read Full Story
            </Button>
          </Box>
        </Card>
      )}
      
      {/* Blog Posts Grid */}
      <Grid container spacing={4}>
        {currentPosts.map((post, index) => (
          // Skip the first post on the first page if it's already featured and not filtered
          (!(currentPage === 1 && index === 0 && selectedCategory === 'all')) && (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={post.category} 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }} 
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption" sx={{ mr: 2 }}>
                        {post.date}
                      </Typography>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption">
                        {post.readTime}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                      By {post.author}
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    color="primary" 
                    component="a"
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer" 
                    endIcon={<OpenInNewIcon />}
                  >
                    Read More
                  </Button>
                </Box>
              </Card>
            </Grid>
          )
        ))}
      </Grid>
      
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
      
      {/* More Links */}
      <Box sx={{ mt: 8 }}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom>
          Explore More
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              component={RouterLink} 
              to="/donations" 
              variant="outlined" 
              color="primary" 
              fullWidth
              sx={{ p: 2 }}
            >
              Support Our Causes
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              component={RouterLink} 
              to="/events" 
              variant="outlined" 
              color="primary" 
              fullWidth
              sx={{ p: 2 }}
            >
              Upcoming Events
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              component={RouterLink} 
              to="/volunteers" 
              variant="outlined" 
              color="primary" 
              fullWidth
              sx={{ p: 2 }}
            >
              Volunteer Opportunities
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              component="a"
              href="https://www.globalgiving.org/"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined" 
              color="primary" 
              fullWidth
              sx={{ p: 2 }}
              endIcon={<OpenInNewIcon />}
            >
              Global Giving
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BlogPage; 