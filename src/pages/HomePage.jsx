import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  InputAdornment,
  Paper,
  Skeleton,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import CakeIcon from '@mui/icons-material/Cake';
import EggIcon from '@mui/icons-material/Egg';
import TimerIcon from '@mui/icons-material/Timer';
import { featuredRecipes, latestRecipes, categories } from '../data/recipes';

const RecipeCard = ({ recipe, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 2,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          cursor: 'pointer'
        }
      }}
      onClick={onClick}
    >
      <Box 
        sx={{ 
          position: 'relative', 
          paddingTop: '56.25%', /* 16:9 aspect ratio */
          backgroundColor: 'grey.100'
        }}
      >
        {!imageError ? (
          <CardMedia
            component="img"
            image={recipe.image}
            alt={recipe.title}
            onError={() => setImageError(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200'
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Chip
            label={recipe.difficulty}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
          <Chip
            label={recipe.category}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'secondary.main',
              fontWeight: 500,
            }}
          />
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom component="h3" sx={{ fontWeight: 600 }}>
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {recipe.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimerIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {recipe.time}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Serves {recipe.servings}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 6, md: 10 },
          overflow: 'hidden',
          width: '100%',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat',
            opacity: 0.85,
            filter: 'brightness(0.75)',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(169deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 2, width: '100%', px: { xs: 2, sm: 4, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <Typography
              variant="h2"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                mb: 3,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                position: 'relative',
                display: 'inline-block',
                width: '100%',
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Discover Delicious Recipes
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{
                mb: 6,
                mt: 3,
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.35rem' },
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.95)',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.8,
                letterSpacing: '0.02em',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Find and share the best recipes from around the world
            </Typography>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                maxWidth: 700,
                width: '100%',
                mx: 'auto',
                position: 'relative',
                zIndex: 3,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white', fontSize: '1.75rem' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    height: 65,
                    fontSize: '1.15rem',
                    fontFamily: '"Inter", sans-serif',
                    border: '2px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid rgba(255,255,255,0.4)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      border: '2px solid rgba(255,255,255,0.5)',
                      transform: 'scale(1.02)',
                      boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease'
                    },
                    '& input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.8)',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Content Sections */}
      <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 8 } }}>
        {/* Featured Recipes Section */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 4,
            fontSize: { xs: '1.75rem', md: '2.25rem' }
          }}
        >
          Featured Recipes
        </Typography>
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {featuredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <RecipeCard recipe={recipe} onClick={() => navigate(`/recipe/${recipe.id}`)} />
            </Grid>
          ))}
        </Grid>

        {/* Latest Recipes Section */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 4,
            fontSize: { xs: '1.75rem', md: '2.25rem' }
          }}
        >
          Latest Recipes
        </Typography>
        <Grid container spacing={3}>
          {latestRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <RecipeCard recipe={recipe} onClick={() => navigate(`/recipe/${recipe.id}`)} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 