import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimerIcon from '@mui/icons-material/Timer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { featuredRecipes, latestRecipes } from '../data/recipes';

// Temporary data store until we implement backend
const allRecipes = [
  ...featuredRecipes,
  ...latestRecipes,
].reduce((acc, recipe) => {
  acc[recipe.id] = recipe;
  return acc;
}, {});

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = allRecipes[id];

  if (!recipe) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Recipe not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 4 }}
      >
        Back to Recipes
      </Button>

      <Grid container spacing={4}>
        {/* Recipe Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              height: 400,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
            }}
          >
            <Box
              component="img"
              src={recipe.image}
              alt={recipe.title}
              onError={(e) => {
                e.target.src = recipe.fallbackImage;
              }}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Grid>

        {/* Recipe Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {recipe.title}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip
                label={recipe.difficulty}
                color="primary"
                size="small"
              />
              <Chip
                label={recipe.category}
                color="secondary"
                size="small"
              />
            </Box>

            <Typography variant="body1" paragraph>
              {recipe.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, my: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <TimerIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {recipe.time}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <RestaurantIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  Serves {recipe.servings}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <LocalDiningIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {recipe.difficulty}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Placeholder for future content */}
            <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Full recipe details coming soon!
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipePage; 