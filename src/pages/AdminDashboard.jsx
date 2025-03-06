import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CreateRecipePage from './CreateRecipePage';
import { useAuth } from '../contexts/AuthContext';
import { useRecipeContext } from '../contexts/RecipeContext';

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recipes = [], categories = [], updateRecipe, deleteRecipe, addCategory, deleteCategory } = useRecipeContext();
  
  const [tabValue, setTabValue] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    // Fetch users data
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Initialize with empty array if API call fails
      setUsers([]);
      setLoading(false);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to fetch users',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenEditDialog(true);
  };

  const handleDelete = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteRecipe(selectedRecipe.id);
      setAlert({
        show: true,
        message: 'Recipe deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to delete recipe',
        severity: 'error',
      });
    }
    setLoading(false);
    setOpenDeleteDialog(false);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory);
      setNewCategory('');
      setAlert({
        show: true,
        message: 'Category added successfully',
        severity: 'success',
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to add category',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your recipes and website content
          </Typography>
        </Box>

        {/* Alert */}
        {alert.show && (
          <Alert
            severity={alert.severity}
            sx={{ mb: 3 }}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<CategoryIcon />} label="Recipes" />
            <Tab icon={<CategoryIcon />} label="Categories" />
            <Tab icon={<PersonIcon />} label="Users" />
            <Tab icon={<SettingsIcon />} label="Settings" />
          </Tabs>
        </Paper>

        {/* Recipes Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Create New Recipe
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(recipes) && recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <TableRow key={recipe?.id || Math.random()}>
                      <TableCell>{recipe?.title || 'Untitled'}</TableCell>
                      <TableCell>{recipe?.category || 'Uncategorized'}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: recipe?.status === 'published' ? 'success.main' : 'warning.main',
                          }}
                        >
                          {recipe?.status || 'draft'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {recipe?.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(recipe)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(recipe)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No recipes available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Categories Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Category Management</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleAddCategory}
                startIcon={<AddIcon />}
              >
                Add Category
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Recipe Count</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <TableRow key={category?.id || Math.random()}>
                        <TableCell>{category?.name || 'Unnamed Category'}</TableCell>
                        <TableCell>{category?.recipeCount || 0}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => deleteCategory(category?.id)}
                            disabled={!category?.id}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No categories available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>User Management</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={user.isActive}
                            onChange={() => {/* Handle user status toggle */}}
                          />
                        }
                        label={user.isActive ? "Active" : "Inactive"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Website Settings</Typography>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Website Name"
                defaultValue="Recipe Finder"
                fullWidth
              />
              <TextField
                label="Contact Email"
                defaultValue="admin@recipefinder.com"
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch defaultChecked />
                }
                label="Enable User Registration"
              />
              <FormControlLabel
                control={
                  <Switch defaultChecked />
                }
                label="Enable Recipe Comments"
              />
              <Button variant="contained" color="primary">
                Save Settings
              </Button>
            </Box>
          </Paper>
        </TabPanel>

        {/* Create Recipe Dialog */}
        <Dialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New Recipe</DialogTitle>
          <DialogContent>
            <CreateRecipePage isDialog={true} onSuccess={() => setOpenCreateDialog(false)} />
          </DialogContent>
        </Dialog>

        {/* Edit Recipe Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Recipe</DialogTitle>
          <DialogContent>
            <CreateRecipePage 
              isDialog={true} 
              recipe={selectedRecipe} 
              onSuccess={() => setOpenEditDialog(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Delete Recipe</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedRecipe?.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard; 