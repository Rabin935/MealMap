const pool = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

// Create a new recipe
const createRecipe = async (req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            instructions,
            cooking_time,
            servings,
            difficulty_level,
            category_id,
            status = 'published' // Default to published
        } = req.body;

        // Get the image path if a file was uploaded
        const image_url = req.file ? `/uploads/recipes/${req.file.filename}` : null;

        // Parse ingredients and instructions if they're strings
        const parsedIngredients = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
        const parsedInstructions = Array.isArray(instructions) ? instructions : JSON.parse(instructions);

        // First, create the recipe
        const result = await pool.query(
            'INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, servings, difficulty_level, image_url, status, user_id) VALUES ($1, $2, $3::text[], $4::text[], $5, $6, $7, $8, $9, $10) RETURNING *',
            [title, description, parsedIngredients, parsedInstructions, cooking_time, servings, difficulty_level, image_url, status, req.user.id]
        );

        // Then, if we have a category_id, create the recipe-category relationship
        if (category_id) {
            await pool.query(
                'INSERT INTO recipe_categories (recipe_id, category_id) VALUES ($1, $2)',
                [result.rows[0].id, category_id]
            );
        }

        // Get the complete recipe data with category information
        const completeRecipe = await pool.query(
            `SELECT r.*, 
                u.username as author,
                array_agg(DISTINCT c.name) as categories,
                array_agg(DISTINCT c.id) as category_ids
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
            LEFT JOIN categories c ON rc.category_id = c.id
            WHERE r.id = $1
            GROUP BY r.id, u.username`,
            [result.rows[0].id]
        );

        res.status(201).json(completeRecipe.rows[0]);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: 'Failed to create recipe. ' + error.message });
    }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.*, 
                u.username as author,
                array_agg(DISTINCT c.name) as categories,
                array_agg(DISTINCT c.id) as category_ids
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
            LEFT JOIN categories c ON rc.category_id = c.id
            WHERE r.status = 'published'
            GROUP BY r.id, u.username
            ORDER BY r.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get All Recipes Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all recipes for admin
const getAllRecipesAdmin = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.*, 
                u.username as author,
                array_agg(DISTINCT c.name) as categories,
                array_agg(DISTINCT c.id) as category_ids
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
            LEFT JOIN categories c ON rc.category_id = c.id
            GROUP BY r.id, u.username
            ORDER BY r.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get Admin Recipes Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get recipe by ID
const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT r.*, u.username as author,
            array_agg(DISTINCT c.name) as categories
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
            LEFT JOIN categories c ON rc.category_id = c.id
            WHERE r.id = $1
            GROUP BY r.id, u.username`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Get Recipe Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a recipe
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            ingredients,
            instructions,
            cooking_time,
            servings,
            difficulty_level,
            category_id,
            status
        } = req.body;

        // Get the current recipe to check if it has an image
        const currentRecipe = await pool.query('SELECT image_url FROM recipes WHERE id = $1', [id]);
        
        let image_url = currentRecipe.rows[0]?.image_url;

        // If a new file is uploaded, delete the old image and update the path
        if (req.file) {
            if (image_url) {
                try {
                    await fs.unlink(path.join(__dirname, '..', 'public', image_url));
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            image_url = `/uploads/recipes/${req.file.filename}`;
        }

        const result = await pool.query(
            'UPDATE recipes SET title = $1, description = $2, ingredients = $3, instructions = $4, cooking_time = $5, servings = $6, difficulty_level = $7, category_id = $8, image_url = $9, status = $10 WHERE id = $11 AND user_id = $12 RETURNING *',
            [title, description, ingredients, instructions, cooking_time, servings, difficulty_level, category_id, image_url, status, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Recipe not found or unauthorized' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Failed to update recipe' });
    }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        // Get the recipe to delete its image if it exists
        const recipe = await pool.query('SELECT image_url FROM recipes WHERE id = $1', [id]);
        
        if (recipe.rows[0]?.image_url) {
            try {
                await fs.unlink(path.join(__dirname, '..', 'public', recipe.rows[0].image_url));
            } catch (err) {
                console.error('Error deleting recipe image:', err);
            }
        }

        const result = await pool.query(
            'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Recipe not found or unauthorized' });
        }

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Failed to delete recipe' });
    }
};

module.exports = {
    getAllRecipes,
    getAllRecipesAdmin,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
}; 