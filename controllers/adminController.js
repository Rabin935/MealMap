const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all recipes with full details for admin
const getAllRecipes = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                r.*,
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
        console.error('Admin Get Recipes Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories ORDER BY name'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get Categories Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new category
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const result = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create Category Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const result = await pool.query(
            'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update Category Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // First, remove all recipe-category associations
        await pool.query(
            'DELETE FROM recipe_categories WHERE category_id = $1',
            [id]
        );

        // Then delete the category
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Delete Category Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                id, username, email, is_admin, created_at,
                (SELECT COUNT(*) FROM recipes WHERE user_id = users.id) as recipe_count
            FROM users
            ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get Users Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user admin status
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { is_admin } = req.body;

        if (typeof is_admin !== 'boolean') {
            return res.status(400).json({ message: 'Invalid admin status' });
        }

        const result = await pool.query(
            'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, username, email, is_admin',
            [is_admin, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update User Status Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM recipes) as total_recipes,
                (SELECT COUNT(*) FROM categories) as total_categories,
                (SELECT COUNT(*) FROM recipes WHERE status = 'draft') as draft_recipes,
                (SELECT COUNT(*) FROM recipes WHERE status = 'published') as published_recipes,
                (SELECT json_agg(row_to_json(t)) 
                 FROM (
                     SELECT c.name, COUNT(rc.recipe_id) as count 
                     FROM categories c 
                     LEFT JOIN recipe_categories rc ON c.id = rc.category_id 
                     GROUP BY c.id, c.name 
                     ORDER BY count DESC 
                     LIMIT 5
                 ) t) as top_categories
        `);

        res.json(stats.rows[0]);
    } catch (err) {
        console.error('Get Dashboard Stats Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update recipe status
const updateRecipeStatus = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { status } = req.body;

        if (!['draft', 'published', 'archived'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const result = await pool.query(
            'UPDATE recipes SET status = $1 WHERE id = $2 RETURNING *',
            [status, recipeId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update Recipe Status Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllRecipes,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllUsers,
    updateUserStatus,
    getDashboardStats,
    updateRecipeStatus
}; 