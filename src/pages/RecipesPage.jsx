import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Rating,
  Slider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  Timer as TimerIcon,
  LocalDining as DiningIcon,
  Group as ServingsIcon,
  Whatshot as DifficultyIcon,
  FilterList as FilterIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  IcecreamOutlined as DessertIcon,
  LocalCafe as SnacksIcon,
  RestaurantMenu as DietaryIcon,
  Public as CuisineIcon,
  MenuBook as CourseIcon,
  Search as SearchIcon,
  TipsAndUpdates as TipsIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/RecipeCard';

const CATEGORIES = {
  'Dietary': [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Low-Carb',
    'Paleo',
  ],
  'Cuisine': [
    'Italian',
    'Mexican',
    'Chinese',
    'Indian',
    'Japanese',
    'Thai',
    'Mediterranean',
    'American',
    'French',
  ],
  'Course': [
    'Appetizers',
    'Soups',
    'Salads',
    'Main Course',
    'Side Dishes',
    'Beverages',
    'Baked Goods',
  ],
};

const COOKING_TIME = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2+ hours' },
];

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

const RecipesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { recipes } = useRecipeContext();
  const { user } = useAuth();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cookingTime, setCookingTime] = useState([15, 120]);
  const [difficulty, setDifficulty] = useState('');
  const [servings, setServings] = useState([1, 12]);

  const CATEGORY_ICONS = {
    'Dietary': <DietaryIcon />,
    'Cuisine': <CuisineIcon />,
    'Course': <CourseIcon />,
  };

  const MEAL_TYPES = [
    { name: 'All', icon: <RestaurantIcon />, color: '#9C27B0' },
    { name: 'Breakfast', icon: <BreakfastIcon />, color: '#FF9800' },
    { name: 'Lunch', icon: <LunchIcon />, color: '#4CAF50' },
    { name: 'Dinner', icon: <DinnerIcon />, color: '#2196F3' },
    { name: 'Desserts', icon: <DessertIcon />, color: '#E91E63' },
  ];

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  const handleDeleteClick = (recipe) => {
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting recipe:', recipeToDelete);
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedMealType(0);
    setSelectedCategories([]);
    setCookingTime([15, 120]);
    setDifficulty('');
    setServings([1, 12]);
  };

  const handleMealTypeChange = (event, newValue) => {
    setSelectedMealType(newValue);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const searchMatch = !searchQuery || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients?.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const mealTypeMatch = selectedMealType === 0 || recipe.mealType === MEAL_TYPES[selectedMealType].name;
    const categoriesMatch = selectedCategories.length === 0 || 
      selectedCategories.every(cat => recipe.categories?.includes(cat));
    const timeMatch = recipe.cookingTime >= cookingTime[0] && recipe.cookingTime <= cookingTime[1];
    const difficultyMatch = !difficulty || recipe.difficulty === difficulty;
    const servingsMatch = recipe.servings >= servings[0] && recipe.servings <= servings[1];

    return searchMatch && mealTypeMatch && categoriesMatch && timeMatch && difficultyMatch && servingsMatch;
  });

  // Get active filters for display
  const activeFilters = [
    ...(searchQuery ? [`Search: ${searchQuery}`] : []),
    ...(selectedMealType !== 0 ? [MEAL_TYPES[selectedMealType].name] : []),
    ...selectedCategories,
    ...(cookingTime[0] !== 15 || cookingTime[1] !== 120 ? [`${cookingTime[0]}-${cookingTime[1]} min`] : []),
    ...(difficulty ? [difficulty] : []),
    ...(servings[0] !== 1 || servings[1] !== 12 ? [`${servings[0]}-${servings[1]} servings`] : []),
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with Search and Admin Controls */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Discover Recipes
          </Typography>
          {user?.isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/recipes/create')}
            >
              Create New Recipe
            </Button>
          )}
        </Box>

        {/* Search Bar */}
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.dark, 0.1)
              : alpha(theme.palette.primary.light, 0.1),
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes by name, description, or ingredients..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              padding: '8px',
              background: 'transparent',
              color: theme.palette.text.primary,
              fontSize: '1rem',
            }}
          />
          {searchQuery && (
            <IconButton 
              size="small" 
              onClick={() => setSearchQuery('')}
              sx={{ ml: 1 }}
            >
              <ClearIcon />
            </IconButton>
          )}
        </Paper>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                onDelete={() => {
                  if (filter.startsWith('Search:')) setSearchQuery('');
                  else if (MEAL_TYPES.some(type => type.name === filter)) setSelectedMealType(0);
                  else if (filter.includes('min')) setCookingTime([15, 120]);
                  else if (filter.includes('servings')) setServings([1, 12]);
                  else if (DIFFICULTY_LEVELS.includes(filter)) setDifficulty('');
                  else setSelectedCategories(selectedCategories.filter(c => c !== filter));
                }}
                sx={{
                  borderRadius: '8px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiChip-deleteIcon': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            ))}
            {activeFilters.length > 1 && (
              <Chip
                label="Clear All"
                onDelete={handleClearFilters}
                deleteIcon={<ClearIcon />}
                sx={{
                  borderRadius: '8px',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  '& .MuiChip-deleteIcon': {
                    color: theme.palette.error.main,
                  },
                }}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Filters Section */}
      <Paper 
        elevation={3}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 2,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(to right, ${alpha(theme.palette.primary.dark, 0.2)}, ${alpha(theme.palette.secondary.dark, 0.2)})`
            : `linear-gradient(to right, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.secondary.light, 0.1)})`,
        }}
      >
        {/* Meal Type Tabs */}
        <Tabs
          value={selectedMealType}
          onChange={handleMealTypeChange}
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          {MEAL_TYPES.map((type, index) => (
            <Tab
              key={type.name}
              icon={type.icon}
              label={type.name}
              sx={{
                minHeight: 72,
                '&.Mui-selected': {
                  color: type.color,
                },
              }}
            />
          ))}
        </Tabs>

        <Grid container spacing={3}>
          {/* Categories */}
          {Object.entries(CATEGORIES).map(([category, items]) => (
            <Grid item xs={12} md={4} key={category}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {CATEGORY_ICONS[category]}
                  {category}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {items.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      onClick={() => {
                        if (selectedCategories.includes(item)) {
                          setSelectedCategories(selectedCategories.filter(c => c !== item));
                        } else {
                          setSelectedCategories([...selectedCategories, item]);
                        }
                      }}
                      color={selectedCategories.includes(item) ? 'primary' : 'default'}
                      sx={{
                        '&.MuiChip-root': {
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                        },
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}

          {/* Cooking Time Slider */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TimerIcon />
              Cooking Time
            </Typography>
            <Slider
              value={cookingTime}
              onChange={(e, newValue) => setCookingTime(newValue)}
              valueLabelDisplay="auto"
              min={15}
              max={120}
              step={15}
              marks={COOKING_TIME}
              valueLabelFormat={(value) => `${value} min`}
              sx={{
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            />
          </Grid>

          {/* Difficulty Select */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DifficultyIcon />
              Difficulty
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {DIFFICULTY_LEVELS.map((level) => (
                <Button
                  key={level}
                  variant={difficulty === level ? 'contained' : 'outlined'}
                  onClick={() => setDifficulty(difficulty === level ? '' : level)}
                  sx={{
                    borderRadius: 2,
                    flex: 1,
                    bgcolor: difficulty === level ? 
                      (level === 'Easy' ? '#4CAF50' : 
                       level === 'Medium' ? '#FF9800' : 
                       '#F44336') : 'transparent',
                    '&:hover': {
                      bgcolor: difficulty === level ? 
                        (level === 'Easy' ? '#43A047' : 
                         level === 'Medium' ? '#FB8C00' : 
                         '#E53935') : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {level}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* Servings Slider */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ServingsIcon />
              Servings
            </Typography>
            <Slider
              value={servings}
              onChange={(e, newValue) => setServings(newValue)}
              valueLabelDisplay="auto"
              min={1}
              max={12}
              marks={[
                { value: 1, label: '1' },
                { value: 6, label: '6' },
                { value: 12, label: '12' },
              ]}
              sx={{
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            />
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{
                mt: 2,
                borderRadius: 2,
                borderColor: theme.palette.grey[400],
                color: theme.palette.text.secondary,
                '&:hover': {
                  borderColor: theme.palette.grey[600],
                  bgcolor: alpha(theme.palette.grey[500], 0.08),
                },
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

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
                  onDelete={() => handleDeleteClick(recipe)}
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
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.primary.dark, 0.1)
                  : alpha(theme.palette.primary.light, 0.1),
              }}
            >
              <RestaurantIcon
                sx={{
                  fontSize: 64,
                  mb: 2,
                  color: theme.palette.primary.main,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h6" gutterBottom>
                No Recipes Found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Try adjusting your filters or create a new recipe
              </Typography>
              {user?.isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/recipes/create')}
                  sx={{
                    mt: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  Create New Recipe
                </Button>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle>Delete Recipe?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{recipeToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecipesPage; 