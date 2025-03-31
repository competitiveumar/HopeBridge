import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Logo from './Logo';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box mb={3}>
              <Logo showText={true} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }} />
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
              sx={{ textAlign: { xs: 'center', sm: 'left' } }}
            >
              Connecting donors with those in need. Together, we can make a difference
              in the lives of people around the world.
            </Typography>
            <Typography 
              variant="h6" 
              color="text.primary" 
              gutterBottom
              sx={{ textAlign: { xs: 'center', sm: 'left' } }}
            >
              Follow Us
            </Typography>
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
              <IconButton 
                aria-label="facebook" 
                component="a"
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#1877F2', // Facebook official blue
                  '&:hover': { 
                    bgcolor: 'rgba(24, 119, 242, 0.1)' 
                  } 
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                aria-label="twitter" 
                component="a"
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#1DA1F2', // Twitter official blue
                  '&:hover': { 
                    bgcolor: 'rgba(29, 161, 242, 0.1)' 
                  } 
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                aria-label="instagram" 
                component="a"
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#E4405F', // Instagram official gradient represented as solid color
                  '&:hover': { 
                    bgcolor: 'rgba(228, 64, 95, 0.1)' 
                  } 
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                aria-label="linkedin" 
                component="a"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#0A66C2', // LinkedIn official blue
                  '&:hover': { 
                    bgcolor: 'rgba(10, 102, 194, 0.1)' 
                  } 
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              color="text.primary" 
              gutterBottom
              sx={{ textAlign: { xs: 'center', sm: 'left' }, mt: { xs: 3, sm: 0 } }}
            >
              Quick Links
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' }
            }}>
              <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
                Home
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" display="block" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link component={RouterLink} to="/donations" color="inherit" display="block" sx={{ mb: 1 }}>
                Donations
              </Link>
              <Link component={RouterLink} to="/events" color="inherit" display="block" sx={{ mb: 1 }}>
                Events
              </Link>
              <Link component={RouterLink} to="/nonprofits" color="inherit" display="block" sx={{ mb: 1 }}>
                Nonprofits
              </Link>
              <Link component={RouterLink} to="/companies" color="inherit" display="block" sx={{ mb: 1 }}>
                Companies
              </Link>
              <Link component={RouterLink} to="/disasters" color="inherit" display="block" sx={{ mb: 1 }}>
                Disasters
              </Link>
              <Link component={RouterLink} to="/blog" color="inherit" display="block" sx={{ mb: 1 }}>
                Blog
              </Link>
              <Link component={RouterLink} to="/gift-cards" color="inherit" display="block" sx={{ mb: 1 }}>
                Gift Cards
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              color="text.primary" 
              gutterBottom
              sx={{ textAlign: { xs: 'center', sm: 'left' }, mt: { xs: 3, sm: 0 } }}
            >
              Contact Us
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
              sx={{ textAlign: { xs: 'center', sm: 'left' } }}
            >
              15 Charity Square
              <br />
              London, EC1V 9HD
              <br />
              United Kingdom
              <br />
              <Link href="mailto:support@hopebridge.org" color="inherit">
                support@hopebridge.org
              </Link>
              <br />
              <Link href="tel:+442071234567" color="inherit">
                +44 (0)20 7123 4567
              </Link>
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {'© '}
            {new Date().getFullYear()}
            {' HopeBridge. All rights reserved.'}
          </Typography>
          <Box mt={1}>
            <Link component={RouterLink} to="/privacy-policy" color="inherit" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            <Link component={RouterLink} to="/terms" color="inherit" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 