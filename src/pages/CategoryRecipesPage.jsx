import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  IcecreamOutlined as DessertIcon,
} from '@mui/icons-material';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/RecipeCard';

const CategoryRecipesPage = () => {
  const { category } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { recipes } = useRecipeContext();
  const { user } = useAuth();

  const CATEGORY_DETAILS = {
    breakfast: {
      title: 'Breakfast Recipes',
      icon: <BreakfastIcon sx={{ fontSize: 40 }} />,
      color: '#FF9800',
    },
    lunch: {
      title: 'Lunch Recipes',
      icon: <LunchIcon sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
    },
    dinner: {
      title: 'Dinner Recipes',
      icon: <DinnerIcon sx={{ fontSize: 40 }} />,
      color: '#2196F3',
    },
    desserts: {
      title: 'Dessert Recipes',
      icon: <DessertIcon sx={{ fontSize: 40 }} />,
      color: '#E91E63',
    },
  };

  // Safely handle category parameter
  const categoryKey = category?.toLowerCase() || '';
  const categoryDetails = CATEGORY_DETAILS[categoryKey] || {
    title: 'Recipes',
    icon: null,
    color: theme.palette.primary.main,
  };

  // Safely filter recipes
  const filteredRecipes = recipes.filter(recipe => 
    recipe.mealType && recipe.mealType.toLowerCase() === categoryKey
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/recipes')}
          sx={{ mb: 2 }}
        >
          Back to All Recipes
        </Button>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: alpha(categoryDetails.color, 0.1),
          p: 3,
          borderRadius: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {categoryDetails.icon}
            <Typography variant="h4" component="h1" sx={{ color: categoryDetails.color }}>
              {categoryDetails.title}
            </Typography>
          </Box>
          {user?.isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/recipes/create')}
              sx={{
                bgcolor: categoryDetails.color,
                '&:hover': {
                  bgcolor: alpha(categoryDetails.color, 0.8),
                },
              }}
            >
              Create New Recipe
            </Button>
          )}
        </Box>
      </Box>

      {/* Recipe Grid */}
      <Grid container spacing={3}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RecipeCard
                  recipe={recipe}
                  onEdit={() => navigate(`/recipes/edit/${recipe.id}`)}
                  onDelete={() => {/* Add delete handler */}}
                  isAdmin={user?.isAdmin}
                />
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: alpha(categoryDetails.color, 0.1),
              }}
            >
              {categoryDetails.icon}
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: categoryDetails.color }}>
                No {categoryDetails.title} Found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Be the first to add a recipe in this category
              </Typography>
              {user?.isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/recipes/create')}
                  sx={{
                    mt: 2,
                    bgcolor: categoryDetails.color,
                    '&:hover': {
                      bgcolor: alpha(categoryDetails.color, 0.8),
                    },
                  }}
                >
                  Create New Recipe
                </Button>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CategoryRecipesPage; 