import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timer as TimerIcon,
  Restaurant as DifficultyIcon,
  Person as ServingsIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import RecipeReviews from '../components/RecipeReviews';

// Dummy data for development
const recipeDetails = {
  id: 1,
  title: 'Spaghetti Carbonara',
  description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
  image: 'https://source.unsplash.com/random/1200x800/?pasta-carbonara',
  time: '30 min',
  difficulty: 'Medium',
  servings: 4,
  ingredients: [
    '400g spaghetti',
    '200g pancetta or guanciale, diced',
    '4 large eggs',
    '100g Pecorino Romano, grated',
    '100g Parmigiano Reggiano, grated',
    'Black pepper, freshly ground',
    'Salt, to taste'
  ],
  instructions: [
    'Bring a large pot of salted water to boil and cook spaghetti according to package instructions.',
    'While pasta cooks, crisp the pancetta in a large pan over medium heat until golden.',
    'In a bowl, whisk together eggs, grated cheeses, and plenty of black pepper.',
    'Reserve 1 cup of pasta water, then drain pasta.',
    'Working quickly, add hot pasta to the pan with pancetta, remove from heat.',
    'Add egg mixture, tossing quickly to coat pasta and create a creamy sauce.',
    'Add pasta water as needed to achieve desired consistency.',
    'Serve immediately with extra cheese and black pepper.'
  ],
  nutrition: {
    calories: 650,
    protein: '25g',
    carbs: '70g',
    fat: '35g'
  },
  reviews: [
    {
      id: 1,
      userId: 'user1',
      userName: 'John Doe',
      userAvatar: 'https://ui-avatars.com/api/?name=John+Doe',
      rating: 5,
      comment: 'Perfect recipe! The sauce was creamy and delicious. Will definitely make again!',
      createdAt: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Jane Smith',
      userAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      rating: 4,
      comment: 'Great recipe, though I added a bit more black pepper for extra kick.',
      createdAt: '2024-03-14T15:45:00Z'
    },
    {
      id: 3,
      userId: 'user3',
      userName: 'Mike Johnson',
      userAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson',
      rating: 5,
      comment: 'Restaurant quality carbonara! The instructions were clear and easy to follow.',
      createdAt: '2024-03-13T20:15:00Z'
    }
  ]
};

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const [servings, setServings] = useState(recipeDetails.servings);

  const handleServingsChange = (delta) => {
    const newServings = servings + delta;
    if (newServings >= 1 && newServings <= 12) {
      setServings(newServings);
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Grid container spacing={4}>
        {/* Recipe Header */}
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" className="mb-4">
            {recipeDetails.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" className="mb-4">
            {recipeDetails.description}
          </Typography>
        </Grid>

        {/* Recipe Image */}
        <Grid item xs={12}>
          <Paper
            component="img"
            src={recipeDetails.image}
            alt={recipeDetails.title}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
        </Grid>

        {/* Recipe Meta Info */}
        <Grid item xs={12}>
          <Box className="flex gap-4 flex-wrap">
            <Chip icon={<TimerIcon />} label={`Time: ${recipeDetails.time}`} />
            <Chip icon={<DifficultyIcon />} label={`Difficulty: ${recipeDetails.difficulty}`} />
            <Box className="flex items-center gap-2">
              <Chip
                icon={<ServingsIcon />}
                label={`Servings: ${servings}`}
              />
              <IconButton size="small" onClick={() => handleServingsChange(-1)}>
                <RemoveIcon />
              </IconButton>
              <IconButton size="small" onClick={() => handleServingsChange(1)}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        {/* Ingredients and Instructions */}
        <Grid item xs={12} md={4}>
          <Card className="h-full">
            <CardContent>
              <Typography variant="h5" component="h2" className="mb-4">
                Ingredients
              </Typography>
              <List>
                {recipeDetails.ingredients.map((ingredient, index) => (
                  <ListItem key={index} disablePadding className="py-1">
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card className="h-full">
            <CardContent>
              <Typography variant="h5" component="h2" className="mb-4">
                Instructions
              </Typography>
              <List>
                {recipeDetails.instructions.map((instruction, index) => (
                  <ListItem key={index} className="py-2">
                    <ListItemText
                      primary={`${index + 1}. ${instruction}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Nutrition Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" className="mb-4">
                Nutrition Information
              </Typography>
              <Box className="flex gap-8">
                {Object.entries(recipeDetails.nutrition).map(([key, value]) => (
                  <Box key={key} className="text-center">
                    <Typography variant="h6" color="primary">
                      {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12}>
          <RecipeReviews recipeId={id} initialReviews={recipeDetails.reviews} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeDetailsPage; 