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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Logo from './Logo';

const pages = [
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
  const { currentUser, loading, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

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
    await logout();
    handleCloseUserMenu();
    navigate('/');
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
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/cart"
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary="🛒 Cart" />
          </ListItemButton>
        </ListItem>
        {!currentUser ? (
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
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 4 }}>
            <Logo showText={true} />
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
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

          {/* Logo for mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
            <Logo showText={true} />
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                size="medium"
                sx={{ 
                  my: 1,
                  mx: 1,
                  px: 1.5,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  textTransform: 'none'
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Cart Icon */}
          <Box sx={{ mr: 2 }}>
            <IconButton
              component={RouterLink}
              to="/cart"
              color="inherit"
              aria-label="shopping cart"
            >
              <Badge badgeContent={getTotalItems()} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>

          {/* User menu or login/signup buttons */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            {currentUser ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {currentUser.photoURL ? (
                      <Avatar 
                        alt={currentUser.name} 
                        src={currentUser.photoURL}
                        sx={{ width: 40, height: 40 }}
                      />
                    ) : (
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: 'primary.main',
                          color: 'white'
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
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
                  <MenuItem component={RouterLink} to="/dashboard" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) :
              <>
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
                    ml: 2,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    px: 2
                  }}
                >
                  Sign Up
                </Button>
              </>
            }
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
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Container>
    </AppBar>
  );
};

export default Header; 