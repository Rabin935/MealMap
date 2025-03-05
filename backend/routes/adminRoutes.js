const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const { getAllRecipesAdmin } = require('../controllers/recipeController');
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllUsers,
    updateUserStatus,
    getDashboardStats,
    updateRecipeStatus
} = require('../controllers/adminController');

// Apply admin authentication to all routes
router.use(adminAuth);

// Recipe management
router.get('/recipes', getAllRecipesAdmin);
router.put('/recipes/:recipeId/status', updateRecipeStatus);

// Category management
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/status', updateUserStatus);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

module.exports = router; 