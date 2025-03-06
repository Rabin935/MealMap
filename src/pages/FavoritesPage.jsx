import React from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/RecipeCard';
import { Favorite as FavoriteIcon } from '@mui/icons-material';

const FavoritesPage = () => {
  const theme = useTheme();
  const { recipes, favorites } = useRecipeContext();
  const { user } = useAuth();

  // Get favorite recipes with proper error handling
  const favoriteRecipes = recipes.filter(recipe => favorites?.includes(recipe.id)) || [];

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view your favorite recipes.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(to right, ${alpha(theme.palette.primary.dark, 0.2)}, ${alpha(theme.palette.secondary.dark, 0.2)})`
              : `linear-gradient(to right, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.secondary.light, 0.1)})`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <FavoriteIcon color="error" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              My Favorite Recipes
            </Typography>
          </Box>

          {favoriteRecipes.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              You haven't added any recipes to your favorites yet. Browse recipes and click the heart icon to add them to your favorites!
            </Alert>
          ) : (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {favoriteRecipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default FavoritesPage; 