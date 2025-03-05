const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const initializeAdmin = async () => {
    try {
        // Admin credentials
        const adminData = {
            username: 'admin',
            email: 'admin@recipefinder.com',
            password: 'admin123',
            is_admin: true
        };

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Check if admin exists
        const adminExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [adminData.email]
        );

        if (adminExists.rows.length > 0) {
            // Update existing admin password
            await pool.query(
                'UPDATE users SET password = $1 WHERE email = $2',
                [hashedPassword, adminData.email]
            );
            console.log('Admin password updated successfully');
        } else {
            // Create new admin
            await pool.query(
                'INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, $4)',
                [adminData.username, adminData.email, hashedPassword, adminData.is_admin]
            );
            console.log('Admin user created successfully');
        }

        console.log('Admin credentials:');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);

    } catch (err) {
        console.error('Error initializing admin:', err);
    } finally {
        await pool.end();
    }
};

initializeAdmin(); 