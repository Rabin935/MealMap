import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { featuredRecipes, latestRecipes, categories } from '../data/recipes';
import { RecipeCard } from '../components/RecipeCard';

const RecipesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  // Combine all recipes
  const allRecipes = [...featuredRecipes, ...latestRecipes];

  // Filter recipes based on search and category
  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Search Section */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 6 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600, mx: 'auto', display: 'block' }}
        />
      </Box>

      {/* Categories */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}
        justifyContent="center"
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            icon={<span>{category.icon}</span>}
            onClick={() => handleCategoryClick(category.name)}
            color={selectedCategory === category.name ? "primary" : "default"}
            sx={{
              bgcolor: selectedCategory === category.name ? category.color : 'transparent',
              '&:hover': {
                bgcolor: selectedCategory === category.name 
                  ? category.color 
                  : 'rgba(0,0,0,0.1)',
              }
            }}
          />
        ))}
      </Stack>

      {/* Results Count */}
      <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
        {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} Found
      </Typography>

      {/* Recipe Grid */}
      <Grid container spacing={3}>
        {filteredRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RecipeCard recipe={recipe} onClick={() => navigate(`/recipe/${recipe.id}`)} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredRecipes.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No recipes found. Try adjusting your search or filters.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default RecipesPage; 