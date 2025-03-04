import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TimerIcon from '@mui/icons-material/Timer';

export const RecipeCard = ({ recipe, onClick }) => {
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