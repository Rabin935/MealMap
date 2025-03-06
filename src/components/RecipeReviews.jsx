import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const RecipeReviews = ({ recipeId }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const {
    ratings,
    reviews,
    rateRecipe,
    getAverageRating,
    addReview,
    updateReview,
    deleteReview,
    getRecipeReviews,
  } = useRecipeContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [userRating, setUserRating] = useState(ratings[recipeId] || 0);

  const recipeReviews = getRecipeReviews(recipeId);
  const averageRating = getAverageRating(recipeId);

  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
    rateRecipe(recipeId, newValue);
  };

  const handleOpenDialog = (review = null) => {
    if (review) {
      setEditingReview(review);
      setReviewContent(review.content);
    } else {
      setEditingReview(null);
      setReviewContent('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReview(null);
    setReviewContent('');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (editingReview) {
      updateReview(editingReview.id, reviewContent);
    } else {
      addReview(recipeId, reviewContent);
    }
    handleCloseDialog();
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Ratings & Reviews
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Typography variant="h6" component="span" sx={{ mr: 1 }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Rating
            value={averageRating}
            precision={0.5}
            readOnly
            sx={{
              color: theme.palette.primary.main,
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({reviews.length} reviews)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            Rate this recipe:
          </Typography>
          <Rating
            value={userRating}
            onChange={handleRatingChange}
            sx={{
              color: theme.palette.primary.main,
            }}
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Write a Review
      </Button>

      <AnimatePresence>
        {recipeReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={review.userAvatar}
                      alt={review.userName}
                      sx={{ mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1">{review.userName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  {user?.id === review.userId && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(review)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteReview(review.id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {review.content}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReview ? 'Edit Review' : 'Write a Review'}
        </DialogTitle>
        <form onSubmit={handleSubmitReview}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Your Review"
              fullWidth
              multiline
              rows={4}
              required
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingReview ? 'Save Changes' : 'Post Review'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default RecipeReviews; 