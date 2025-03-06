import { useState, useEffect } from 'react';
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
  Paper,
  useTheme,
  alpha,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Restaurant as RestaurantIcon,
  Timer as TimerIcon,
  LocalDining as LocalDiningIcon,
  Whatshot as WhatshotIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useRecipeContext } from '../contexts/RecipeContext';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { recipes } = useRecipeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recipes && recipes.length > 0) {
      // Get 6 random recipes
      const randomRecipes = [...recipes]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
      setFeaturedRecipes(randomRecipes);
    }
    setLoading(false);
  }, [recipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { 
      name: 'Quick Meals', 
      icon: <TimerIcon sx={{ fontSize: 40 }} />, 
      color: theme.palette.success.main,
      description: 'Ready in 30 minutes or less'
    },
    { 
      name: 'Healthy', 
      icon: <LocalDiningIcon sx={{ fontSize: 40 }} />, 
      color: theme.palette.info.main,
      description: 'Nutritious and delicious options'
    },
    { 
      name: 'Popular', 
      icon: <WhatshotIcon sx={{ fontSize: 40 }} />, 
      color: theme.palette.error.main,
      description: 'Community favorites'
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.9)}, ${alpha(theme.palette.secondary.dark, 0.9)})`
            : `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.25)}, ${alpha(theme.palette.secondary.main, 0.25)})`,
          py: { xs: 8, md: 12 },
          mb: 6,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 0.4)'
              : 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: theme.palette.mode === 'dark'
                      ? theme.palette.common.white
                      : theme.palette.primary.dark,
                    textShadow: theme.palette.mode === 'dark'
                      ? '2px 2px 4px rgba(0,0,0,0.5)'
                      : '1px 1px 2px rgba(0,0,0,0.15)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '60px',
                      height: '4px',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      borderRadius: '2px',
                    },
                  }}
                >
                  Discover Amazing Recipes
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 4,
                    color: theme.palette.mode === 'dark' 
                      ? theme.palette.grey[300]
                      : theme.palette.grey[800],
                    fontWeight: 500,
                    textShadow: theme.palette.mode === 'dark'
                      ? '1px 1px 2px rgba(0,0,0,0.3)'
                      : 'none',
                  }}
                >
                  Find and share the best recipes from around the world
                </Typography>
                <Paper
                  component="form"
                  onSubmit={handleSearch}
                  elevation={3}
                  sx={{
                    p: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: 500,
                    borderRadius: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: 'none',
                        '& fieldset': { border: 'none' },
                      },
                    }}
                  />
                  <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352"
                  alt="Cooking"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: theme.shadows[4],
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: 'center',
            color: theme.palette.text.primary,
          }}
        >
          Explore Categories
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={12} md={4} key={category.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      bgcolor: theme.palette.mode === 'dark'
                        ? alpha(category.color, 0.1)
                        : alpha(category.color, 0.15),
                    },
                    borderRadius: 4,
                  }}
                  onClick={() => navigate(`/recipes?category=${category.name.toLowerCase()}`)}
                >
                  <Box sx={{ color: category.color, mb: 2 }}>
                    {category.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom color="textPrimary">
                    {category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === 'dark'
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                      textAlign: 'center',
                      fontWeight: 500
                    }}
                  >
                    {category.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Recipes Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.dark, 0.1)
            : alpha(theme.palette.primary.main, 0.06),
          py: 8,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}>
              Featured Recipes
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/recipes')}
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              View All
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : featuredRecipes.length > 0 ? (
            <Grid container spacing={3}>
              {featuredRecipes.map((recipe, index) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id || index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[8],
                        },
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                      onClick={() => navigate(`/recipes/${recipe.id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={recipe.image || `https://source.unsplash.com/random/400x300/?${recipe.title.toLowerCase().replace(/\s+/g, '-')}`}
                        alt={recipe.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            color: theme.palette.text.primary,
                            fontWeight: 600
                          }}
                        >
                          {recipe.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimerIcon sx={{ 
                            fontSize: 20, 
                            color: theme.palette.mode === 'dark'
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary
                          }} />
                          <Typography 
                            variant="body2" 
                            sx={{
                              color: theme.palette.mode === 'dark'
                                ? theme.palette.text.secondary
                                : theme.palette.text.primary,
                              fontWeight: 500
                            }}
                          >
                            {recipe.cookingTime || 30} min
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ 
                color: theme.palette.mode === 'dark'
                  ? theme.palette.text.secondary
                  : theme.palette.text.primary
              }}>
                No recipes available
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            textAlign: 'center',
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.9)}, ${alpha(theme.palette.secondary.dark, 0.9)})`
              : `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <RestaurantIcon sx={{ 
            fontSize: 48, 
            mb: 2, 
            color: theme.palette.primary.main 
          }} />
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary
          }}>
            Ready to Start Cooking?
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 4, 
            color: theme.palette.mode === 'dark'
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
            fontWeight: 500
          }}>
            Join our community and share your favorite recipes
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              textTransform: 'none',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage; 