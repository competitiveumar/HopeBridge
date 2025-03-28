import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
} from '@mui/material';

const PrivacyPolicyPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" color="primary.dark" fontWeight="bold">
          HopeBridge Privacy Policy
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" paragraph>
          Your privacy is important to us at <strong>HopeBridge</strong>. This Privacy Policy outlines the types of information we collect and how we use, protect, and disclose it. By interacting with us, you agree to the practices described below.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          1. Information We Collect
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Personal Information:</strong> Includes your name, email address, phone number, and payment details when you make donations.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Non-Personal Information:</strong> Includes data such as browser type, device information, and IP address collected through cookies and tracking tools.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Donation Details:</strong> Information about the amount, date, and purpose of your donations.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          2. How We Use Your Information
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              To process donations and send receipts.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              To provide updates on our programs, events, and campaigns.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              To respond to inquiries or requests for information.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              To improve our website, services, and user experience.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          3. Sharing Your Information
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              We do not sell, trade, or rent your personal information.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              We may share your information with trusted third-party service providers for donation processing and email communications.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              We may disclose your information to comply with legal obligations or protect our rights.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          4. Data Security
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              We implement appropriate technical and organizational measures to protect your personal data.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              Donation transactions are encrypted using SSL (Secure Socket Layer) technology.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              Access to your personal information is restricted to authorized personnel only.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          5. Your Choices
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              You may opt out of receiving our email communications at any time.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              You can request access to or deletion of your personal information by contacting us.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          6. Cookies and Tracking
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              We use cookies to enhance user experience and analyze website traffic.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              You can manage your cookie preferences through your browser settings.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          7. Updates to Our Policy
        </Typography>
        
        <Typography variant="body1" paragraph>
          We may update this Privacy Policy periodically. Please review this page for any changes. Your continued use of our services signifies your acceptance of the updated policy.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          8. Contact Us
        </Typography>
        
        <Typography variant="body1" paragraph>
          If you have any questions about this Privacy Policy, please contact us:
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Email:</strong> <Link href="mailto:support@hopebridge.org" underline="hover">support@hopebridge.org</Link>
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Phone:</strong> +44 (0)20 7123 4567
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Address:</strong> 15 Charity Square, London, EC1V 9HD, United Kingdom
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 HopeBridge. All Rights Reserved. | <Link href="/" underline="hover">Home</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicyPage; 