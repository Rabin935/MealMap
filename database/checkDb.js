const pool = require('../config/db');

const checkDatabase = async () => {
    try {
        // Check if users table exists and its structure
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);
        
        console.log('Users table exists:', tableCheck.rows[0].exists);

        if (tableCheck.rows[0].exists) {
            const columns = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users';
            `);
            console.log('Users table structure:', columns.rows);
        }

    } catch (err) {
        console.error('Database check error:', err);
    } finally {
        pool.end();
    }
};

checkDatabase(); 