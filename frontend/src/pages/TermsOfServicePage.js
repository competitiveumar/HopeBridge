import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
} from '@mui/material';

const TermsOfServicePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" color="primary.dark" fontWeight="bold">
          HopeBridge Terms of Service
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" paragraph>
          Welcome to HopeBridge. By using our services, you agree to these terms. Please read them carefully.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          1. Using Our Services
        </Typography>
        
        <Typography variant="body1" paragraph>
          You must follow any policies made available to you within the Services. Don't misuse our Services. For example, don't interfere with our Services or try to access them using a method other than the interface and the instructions that we provide.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          2. Donations and Payments
        </Typography>
        
        <Typography variant="body1" paragraph>
          All donations made through our platform are final and non-refundable. We use secure payment processors to handle financial transactions, and we do not store your payment details on our servers.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          3. User Accounts
        </Typography>
        
        <Typography variant="body1" paragraph>
          You may need to create an account to use some of our Services. You are responsible for safeguarding your account, so use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          4. Intellectual Property
        </Typography>
        
        <Typography variant="body1" paragraph>
          The content displayed on our website, including text, graphics, logos, and images, is the property of HopeBridge and protected by copyright laws. You may not use, reproduce, or distribute any of our content without prior written permission.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          5. Termination
        </Typography>
        
        <Typography variant="body1" paragraph>
          We reserve the right to suspend or terminate your access to our Services if we reasonably believe that you have violated these terms or engaged in fraudulent activity.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          6. Changes to These Terms
        </Typography>
        
        <Typography variant="body1" paragraph>
          We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services. You should look at the terms regularly. We'll post notice of modifications to these terms on this page.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 'bold' }}>
          7. Contact Us
        </Typography>
        
        <Typography variant="body1" paragraph>
          If you have any questions about these Terms of Service, please contact us:
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
          © {new Date().getFullYear()} HopeBridge. All Rights Reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfServicePage; 