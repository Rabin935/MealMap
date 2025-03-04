import { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const RecipeReviews = ({ recipeId, initialReviews = [] }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedReview, setEditedReview] = useState({ comment: '', rating: 0 });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmitReview = () => {
    if (!user) {
      setOpenLoginPrompt(true);
      return;
    }

    if (!newReview.trim() || rating === 0) return;

    const review = {
      id: Date.now(),
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'A'}`,
      rating,
      comment: newReview,
      createdAt: new Date().toISOString(),
    };

    setReviews([review, ...reviews]);
    setNewReview('');
    setRating(0);
    setSnackbar({
      open: true,
      message: 'Review submitted successfully!',
      severity: 'success'
    });
  };

  const handleMenuClick = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditedReview({
      comment: selectedReview.comment,
      rating: selectedReview.rating
    });
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleEditSubmit = () => {
    if (!editedReview.comment.trim() || editedReview.rating === 0) return;

    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === selectedReview.id
          ? {
              ...review,
              comment: editedReview.comment,
              rating: editedReview.rating,
              editedAt: new Date().toISOString()
            }
          : review
      )
    );

    setEditMode(false);
    setSelectedReview(null);
    setSnackbar({
      open: true,
      message: 'Review updated successfully!',
      severity: 'success'
    });
  };

  const handleDeleteConfirm = () => {
    setReviews(prevReviews =>
      prevReviews.filter(review => review.id !== selectedReview.id)
    );
    setOpenDeleteDialog(false);
    setSelectedReview(null);
    setSnackbar({
      open: true,
      message: 'Review deleted successfully!',
      severity: 'success'
    });
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Box className="mt-8">
      <Typography variant="h5" gutterBottom>
        Reviews ({reviews.length})
      </Typography>

      {/* Average Rating Display */}
      <Paper className="p-4 mb-4">
        <Box className="flex items-center gap-4">
          <Box className="text-center">
            <Typography variant="h3">{averageRating}</Typography>
            <Rating value={Number(averageRating)} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
              const percentage = (count / reviews.length) * 100 || 0;
              return (
                <Box key={star} className="flex items-center gap-2 mb-1">
                  <Typography variant="body2" className="w-8">{star}★</Typography>
                  <Box className="flex-1 bg-gray-200 h-2 rounded-full">
                    <Box
                      className="bg-primary-500 h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </Box>
                  <Typography variant="body2" className="w-12">{count}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>

      {/* Review Form */}
      <Paper className="p-4 mb-4">
        <Typography variant="h6" gutterBottom>Write a Review</Typography>
        <Box className="flex flex-col gap-3">
          <Box className="flex items-center gap-2">
            <Typography component="legend">Your Rating</Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your thoughts about this recipe..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={!newReview.trim() || rating === 0}
          >
            Submit Review
          </Button>
        </Box>
      </Paper>

      {/* Reviews List */}
      <List>
        {reviews.map((review) => (
          <Box key={review.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                user && user.uid === review.userId && (
                  <>
                    <IconButton
                      edge="end"
                      aria-label="more"
                      onClick={(e) => handleMenuClick(e, review)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={review.userAvatar} alt={review.userName} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box className="flex items-center gap-2">
                    <Typography component="span" variant="subtitle1">
                      {review.userName}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      {review.editedAt && ' (edited)'}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </Box>
        ))}
      </List>

      {/* Review Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" className="mr-2" />
          Edit Review
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} className="text-red-500">
          <DeleteIcon fontSize="small" className="mr-2" />
          Delete Review
        </MenuItem>
      </Menu>

      {/* Edit Review Dialog */}
      <Dialog open={editMode} onClose={() => setEditMode(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Box className="mt-2 flex flex-col gap-3">
            <Box className="flex items-center gap-2">
              <Typography component="legend">Your Rating</Typography>
              <Rating
                value={editedReview.rating}
                onChange={(_, newValue) => setEditedReview(prev => ({ ...prev, rating: newValue }))}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editedReview.comment}
              onChange={(e) => setEditedReview(prev => ({ ...prev, comment: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={!editedReview.comment.trim() || editedReview.rating === 0}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>
            You need to be logged in to submit a review. Would you like to login now?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginPrompt(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => navigate('/login')}>
            Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecipeReviews; 