import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// Import the logo properly for webpack to handle
import logoImg from '../../assets/logo.png';

const Logo = ({ sx = {}, showText = true }) => {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        gap: 1,
        ...sx
      }}
    >
      <img
        src={logoImg}
        alt="HopeBridge Logo"
        style={{
          height: '40px',
          width: 'auto'
        }}
      />
      {showText && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 700,
            color: '#B22222', // dark red
            letterSpacing: '0.5px'
          }}
        >
          HopeBridge
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 