import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  Box,
  TextField,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  RestaurantMenu as RecipeIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock data for saved recipes
const savedRecipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    image: 'https://source.unsplash.com/random/400x300/?pasta-carbonara',
    savedAt: '2024-03-04T12:00:00Z'
  },
  {
    id: 2,
    title: 'Chicken Stir Fry',
    image: 'https://source.unsplash.com/random/400x300/?stir-fry',
    savedAt: '2024-03-03T15:30:00Z'
  },
  {
    id: 3,
    title: 'Berry Smoothie Bowl',
    image: 'https://source.unsplash.com/random/400x300/?smoothie-bowl',
    savedAt: '2024-03-02T09:15:00Z'
  }
];

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="py-4">
    {value === index && children}
  </div>
);

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    try {
      // TODO: Implement API call to update profile
      setSuccess('Profile updated successfully');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleDeleteAccount = () => {
    try {
      // TODO: Implement API call to delete account
      logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper className="p-6">
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" component="h1">
                  {user?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Tabs and Content */}
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab icon={<FavoriteIcon />} label="Saved Recipes" />
              <Tab icon={<RecipeIcon />} label="My Recipes" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>

            {/* Saved Recipes Tab */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                {savedRecipes.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <CardMedia
                          component="img"
                          height="200"
                          image={recipe.image}
                          alt={recipe.title}
                          className="h-48 object-cover"
                        />
                        <CardContent>
                          <Typography variant="h6" component="h3">
                            {recipe.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Saved on {new Date(recipe.savedAt).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* My Recipes Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box className="text-center py-8">
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  You haven't created any recipes yet
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/recipes/new')}
                  className="mt-4"
                >
                  Create Recipe
                </Button>
              </Box>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={activeTab} index={2}>
              <Box className="max-w-md mx-auto space-y-6">
                {error && (
                  <Alert severity="error" className="mb-4">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" className="mb-4">
                    {success}
                  </Alert>
                )}

                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!editMode}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!editMode}
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!editMode}
                  />
                </div>

                {editMode && (
                  <Box className="flex gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}

                <Box className="pt-6 border-t">
                  <Typography variant="h6" gutterBottom>
                    Danger Zone
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfilePage; 