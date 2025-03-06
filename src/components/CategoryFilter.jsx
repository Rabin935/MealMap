import {
  Box,
  Chip,
  Typography,
  Paper,
} from '@mui/material';
import {
  Restaurant,
  LocalDining,
  FreeBreakfast,
  Cake,
  LocalPizza,
  RamenDining,
  SoupKitchen,
} from '@mui/icons-material';

const categories = [
  { id: 'all', name: 'All', icon: Restaurant, color: '#2D3250' },
  { id: 'breakfast', name: 'Breakfast', icon: FreeBreakfast, color: '#FFD93D' },
  { id: 'main-course', name: 'Main Course', icon: LocalDining, color: '#FF6B6B' },
  { id: 'dessert', name: 'Dessert', icon: Cake, color: '#FF8B94' },
  { id: 'vegetarian', name: 'Vegetarian', icon: SoupKitchen, color: '#95E1D3' },
  { id: 'italian', name: 'Italian', icon: LocalPizza, color: '#FF6B6B' },
  { id: 'asian', name: 'Asian', icon: RamenDining, color: '#4ECDC4' },
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4, 
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Categories
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Chip
              key={category.id}
              icon={<Icon />}
              label={category.name}
              onClick={() => onCategoryChange(category.id)}
              sx={{
                bgcolor: selectedCategory === category.id ? category.color : 'transparent',
                color: selectedCategory === category.id ? 'white' : 'text.primary',
                borderColor: category.color,
                border: '1px solid',
                '&:hover': {
                  bgcolor: `${category.color}CC`,
                  color: 'white',
                },
                transition: 'all 0.2s ease',
              }}
              clickable
            />
          );
        })}
      </Box>
    </Paper>
  );
};

export default CategoryFilter; 