const pool = require('../config/db');

const testRecipeCreation = async () => {
    try {
        // First, get a user ID
        const userResult = await pool.query('SELECT id FROM users LIMIT 1');
        if (userResult.rows.length === 0) {
            console.log('No users found in database');
            return;
        }
        const userId = userResult.rows[0].id;

        // Test recipe creation
        const recipeResult = await pool.query(
            `INSERT INTO recipes (
                title, description, ingredients, instructions, 
                cooking_time, servings, difficulty_level, image_url, user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                'Test Recipe',
                'Test Description',
                ['ingredient1', 'ingredient2'],
                ['step1', 'step2'],
                30,
                4,
                'easy',
                'https://example.com/test.jpg',
                userId
            ]
        );

        console.log('Recipe created successfully:', recipeResult.rows[0]);

        // Test recipe categories
        const categoryResult = await pool.query(
            'INSERT INTO recipe_categories (recipe_id, category_id) VALUES ($1, $2) RETURNING *',
            [recipeResult.rows[0].id, 4]
        );

        console.log('Recipe category added successfully:', categoryResult.rows[0]);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
};

testRecipeCreation(); 