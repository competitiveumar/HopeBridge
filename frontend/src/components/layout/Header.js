import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Badge,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Logo from './Logo';
import { toggleAccessibilityWidget, toggleChatbot } from '../../utils/uiControlUtils';

const allPages = [
  { title: 'About Us', path: '/about' },
  { title: 'Nonprofits', path: '/nonprofits' },
  { title: 'Companies', path: '/companies' },
  { title: 'Disasters', path: '/disasters' },
  { title: 'Donations', path: '/donations' },
  { title: 'Blog', path: '/blog' },
  { title: '🎁 Gift Cards', path: '/gift-cards' },
  { title: 'Events', path: '/events' },
];

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const auth = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  
  // Use theme and media query to determine responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Safely destructure auth values with defaults
  const { user = null, loading = false, logout = async () => {} } = auth || {};
  
  // Filter pages based on user type
  const pages = user && user.user_type === 'volunteer' 
    ? allPages.filter(page => 
        !['Disasters', 'Donations', '🎁 Gift Cards'].includes(page.title)
      ) 
    : allPages;
  
  // Helper function to check if cart should be shown
  const shouldShowCart = () => {
    return true; // Show cart for all users, including volunteers
  };
  
  // Show loading state while auth is initializing
  if (loading) {
    return (
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleCloseUserMenu();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDashboardClick = () => {
    handleCloseUserMenu();
    // Check the user type and navigate to the appropriate dashboard
    if (user && user.user_type === 'volunteer') {
      navigate('/volunteer-dashboard');
    } else {
      navigate('/dashboard');
    }
  };
  
  // Handle accessibility button click - open accessibility menu
  const handleAccessibilityClick = () => {
    toggleAccessibilityWidget();
  };
  
  // Handle chatbot button click - open chatbot
  const handleChatbotClick = () => {
    toggleChatbot();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2 }}>
        <Logo showText={true} />
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.title} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={page.path}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={page.title} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Conditionally show these buttons in the drawer only on small screens */}
        {isSmallScreen && (
          <>
            {shouldShowCart() && (
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/cart"
                  sx={{ textAlign: 'center' }}
                >
                  <Badge badgeContent={getTotalItems()} color="error" sx={{ mr: 1 }}>
                    <ShoppingCartIcon fontSize="small" />
                  </Badge>
                  <ListItemText primary="Cart" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleAccessibilityClick}
                sx={{ textAlign: 'center' }}
              >
                <AccessibilityNewIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText primary="Accessibility" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleChatbotClick}
                sx={{ textAlign: 'center' }}
              >
                <ChatIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText primary="Chat Assistant" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        {!user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/register"
                sx={{ textAlign: 'center', color: 'primary.main' }}
              >
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (user && user.user_type === 'volunteer') {
                    navigate('/volunteer-dashboard');
                  } else {
                    navigate('/dashboard');
                  }
                }}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu button */}
          <Box sx={{ display: 'flex', mr: 1 }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo - visible on all screen sizes */}
          <Box sx={{ display: 'flex', mr: { xs: 0, md: 4 }, flexGrow: 1 }}>
            <Logo showText={true} />
          </Box>

          {/* Header Action Buttons (accessibility, chatbot, cart) */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            {/* Accessibility Button - only visible on larger screens */}
            {!isSmallScreen && (
              <IconButton
                color="inherit"
                aria-label="accessibility options"
                onClick={handleAccessibilityClick}
                sx={{ ml: 1 }}
              >
                <AccessibilityNewIcon />
              </IconButton>
            )}
            
            {/* Chatbot Button - only visible on larger screens */}
            {!isSmallScreen && (
              <IconButton
                color="inherit"
                aria-label="chat assistant"
                onClick={handleChatbotClick}
                sx={{ ml: 1 }}
              >
                <ChatIcon />
              </IconButton>
            )}
            
            {/* Cart Icon - only visible on larger screens */}
            {!isSmallScreen && shouldShowCart() && (
              <IconButton
                component={RouterLink}
                to="/cart"
                color="inherit"
                aria-label="shopping cart"
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={getTotalItems()} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
          </Box>

          {/* User menu for both mobile and desktop */}
          <Box sx={{ ml: 1 }}>
            {user ? (
              <>
                <Tooltip title="User Account">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {user.photoURL || user.avatar ? (
                      <Avatar 
                        alt={user.displayName || user.name || user.email || 'User'} 
                        src={user.photoURL || user.avatar}
                        sx={{ width: 40, height: 40 }}
                      />
                    ) : (
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: '#ccc',
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ 
                    mt: '45px',
                    '& .MuiPaper-root': {
                      borderRadius: 1,
                      minWidth: 180,
                      boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
                    }
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleDashboardClick} sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 500 }}>Dashboard</Typography>
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 500 }}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  size="medium"
                  sx={{ 
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    px: 1.5
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{ 
                    ml: 1,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    px: 2
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawer}
        </Drawer>
      </Container>
    </AppBar>
  );
};

export default Header; 