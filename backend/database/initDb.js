const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const initializeDatabase = async () => {
    try {
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute the SQL commands
        await pool.query(sql);
        
        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await pool.end();
    }
};

initializeDatabase(); 