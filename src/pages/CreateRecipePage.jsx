import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  Box,
  MenuItem,
  InputAdornment,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const difficultyLevels = ['Easy', 'Medium', 'Hard'];
const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Vegetarian'];

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: '',
    ingredients: [''],
    instructions: [''],
    image: null,
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index] = value;
    setRecipeData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleAddIngredient = () => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
    setRecipeData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipeData.instructions];
    newInstructions[index] = value;
    setRecipeData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const handleAddInstruction = () => {
    setRecipeData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = recipeData.instructions.filter((_, i) => i !== index);
    setRecipeData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecipeData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!recipeData.title || !recipeData.description || !recipeData.category) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 1:
        if (!recipeData.ingredients.every(ingredient => ingredient.trim())) {
          setError('Please fill in all ingredients');
          return false;
        }
        break;
      case 2:
        if (!recipeData.instructions.every(instruction => instruction.trim())) {
          setError('Please fill in all instructions');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      // TODO: Implement API call to save recipe
      navigate('/recipes');
    } catch (err) {
      setError('Failed to create recipe');
    }
  };

  const steps = ['Basic Info', 'Ingredients', 'Instructions', 'Additional Details'];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recipe Title"
                  name="title"
                  value={recipeData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={recipeData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={recipeData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Difficulty"
                  name="difficulty"
                  value={recipeData.difficulty}
                  onChange={handleChange}
                  required
                >
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Prep Time"
                  name="prepTime"
                  value={recipeData.prepTime}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">min</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Cook Time"
                  name="cookTime"
                  value={recipeData.cookTime}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">min</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Servings"
                  name="servings"
                  value={recipeData.servings}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Add your ingredients one by one
            </Typography>
            {recipeData.ingredients.map((ingredient, index) => (
              <Box key={index} className="flex gap-2 mb-2">
                <TextField
                  fullWidth
                  label={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  required
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={recipeData.ingredients.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddIngredient}
              className="mt-2"
            >
              Add Ingredient
            </Button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Add your instructions step by step
            </Typography>
            {recipeData.instructions.map((instruction, index) => (
              <Box key={index} className="flex gap-2 mb-2">
                <TextField
                  fullWidth
                  label={`Step ${index + 1}`}
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  multiline
                  required
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveInstruction(index)}
                  disabled={recipeData.instructions.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddInstruction}
              className="mt-2"
            >
              Add Step
            </Button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  fullWidth
                  className="h-32"
                >
                  {recipeData.image ? 'Change Recipe Image' : 'Upload Recipe Image'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {recipeData.image && (
                  <Typography variant="body2" className="mt-2">
                    Selected: {recipeData.image.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  name="notes"
                  value={recipeData.notes}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Add any tips, variations, or additional information about your recipe..."
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Paper className="p-6">
        <Typography variant="h4" component="h1" className="mb-6">
          Create New Recipe
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            startIcon={<BackIcon />}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            endIcon={activeStep === steps.length - 1 ? null : <NextIcon />}
            color="primary"
          >
            {activeStep === steps.length - 1 ? 'Submit Recipe' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRecipePage; 