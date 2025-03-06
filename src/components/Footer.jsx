import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  Link,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Recipe Finder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Discover and share amazing recipes from around the world. Join our community
              of food lovers and cooking enthusiasts.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="small"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="small"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="small"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="small"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Explore
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/recipes" color="text.secondary" underline="hover">
                All Recipes
              </Link>
              <Link href="/categories" color="text.secondary" underline="hover">
                Categories
              </Link>
              <Link href="/favorites" color="text.secondary" underline="hover">
                Favorites
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="text.secondary" underline="hover">
                About Us
              </Link>
              <Link href="/contact" color="text.secondary" underline="hover">
                Contact
              </Link>
              <Link href="/blog" color="text.secondary" underline="hover">
                Blog
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subscribe to our newsletter for the latest recipes and cooking tips.
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Recipe Finder. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link href="/privacy" color="text.secondary" underline="hover">
              Privacy Policy
            </Link>
            <Link href="/terms" color="text.secondary" underline="hover">
              Terms of Service
            </Link>
            <Link href="/cookies" color="text.secondary" underline="hover">
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 