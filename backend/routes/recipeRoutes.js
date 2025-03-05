const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
} = require('../controllers/recipeController');

// Public routes - accessible to all users
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

// Admin only routes - requires admin authentication
router.post('/', adminAuth, upload.single('image'), createRecipe);
router.put('/:id', adminAuth, upload.single('image'), updateRecipe);
router.delete('/:id', adminAuth, deleteRecipe);

// Error handler for this router
router.use((err, req, res, next) => {
    console.error('Recipe Route Error:', err);
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Invalid token' });
    } else {
        next(err);
    }
});

module.exports = router; 