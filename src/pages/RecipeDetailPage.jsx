import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Divider,
  Paper,
  Grid,
  Chip,
  useTheme,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Restaurant as RestaurantIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useRecipeContext } from '../contexts/RecipeContext';
import RecipeReviews from '../components/RecipeReviews';
import ShareRecipe from '../components/ShareRecipe';
import { motion } from 'framer-motion';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const { recipes } = useRecipeContext();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Recipe not found
        </Typography>
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
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Recipe Image */}
          <Box
            sx={{
              width: '100%',
              height: 400,
              mb: 4,
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src={recipe.image}
              alt={recipe.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Box>

          {/* Recipe Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {recipe.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <ShareRecipe recipeId={id} recipeName={recipe.title} />
            </Box>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              {recipe.description}
            </Typography>
          </Box>

          {/* Recipe Info */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="primary" />
                <Typography>
                  Cooking Time: {recipe.cookingTime} minutes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RestaurantIcon color="primary" />
                <Typography>Difficulty: {recipe.difficulty}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon color="primary" />
                <Typography>Servings: {recipe.servings}</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Categories */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {recipe.categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Recipe Content Grid */}
          <Grid container spacing={4}>
            {/* Ingredients */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: { xs: 4, md: 0 } }}>
                <Typography variant="h5" gutterBottom>
                  Ingredients
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                  }}
                >
                  <ul style={{ paddingLeft: theme.spacing(2), margin: 0 }}>
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Typography
                          variant="body1"
                          paragraph
                          sx={{ mb: 1 }}
                        >
                          {ingredient}
                        </Typography>
                      </motion.li>
                    ))}
                  </ul>
                </Paper>
              </Box>
            </Grid>

            {/* Instructions */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Instructions
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: theme.palette.background.default,
                  borderRadius: 2,
                }}
              >
                <ol style={{ paddingLeft: theme.spacing(2), margin: 0 }}>
                  {recipe.instructions.map((instruction, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{ mb: 2 }}
                      >
                        {instruction}
                      </Typography>
                    </motion.li>
                  ))}
                </ol>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Reviews Section */}
          <RecipeReviews recipeId={id} />
        </Paper>
      </motion.div>
    </Container>
  );
};

export default RecipeDetailPage; 