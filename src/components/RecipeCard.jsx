import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AccessTime as AccessTimeIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useAuth } from '../contexts/AuthContext';

const RecipeCard = ({ recipe }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useRecipeContext();
  const { user } = useAuth();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const isFavorite = favorites?.includes(recipe.id) || false;

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(recipe.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -4 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[2],
        '&:hover': {
          boxShadow: theme.shadows[8],
        },
      }}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={recipe.image || 'https://placehold.co/400x300/png?text=Recipe+Image'}
        alt={recipe.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/400x300/png?text=Recipe+Image';
        }}
        sx={{
          objectFit: 'cover',
          bgcolor: 'grey.100',
        }}
      />

      <Tooltip title={user ? (isFavorite ? 'Remove from favorites' : 'Add to favorites') : 'Login to add favorites'}>
        <IconButton
          onClick={handleFavoriteClick}
          disabled={isTogglingFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.9)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0,0,0,0.4)'
              : 'none',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.25)'
                : 'rgba(255, 255, 255, 1)',
            },
            '&.Mui-disabled': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          {isTogglingFavorite ? (
            <CircularProgress size={24} color="error" />
          ) : isFavorite ? (
            <FavoriteIcon sx={{ color: theme.palette.error.main }} />
          ) : (
            <FavoriteBorderIcon sx={{ 
              color: theme.palette.mode === 'dark'
                ? theme.palette.common.white
                : theme.palette.grey[800]
            }} />
          )}
        </IconButton>
      </Tooltip>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            minHeight: '2.4em',
          }}
        >
          {recipe.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {recipe.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<AccessTimeIcon />}
            label={`${recipe.cookingTime} min`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<RestaurantIcon />}
            label={recipe.difficulty}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {recipe.category && (
            <Chip
              label={recipe.category}
              size="small"
              color="primary"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard; 