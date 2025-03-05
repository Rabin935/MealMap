const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const createAdmin = async () => {
    try {
        // Admin credentials
        const admin = {
            username: 'admin',
            email: 'admin@recipefinder.com',
            password: 'admin123'
        };

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);

        // Delete existing admin if exists
        await pool.query('DELETE FROM users WHERE email = $1', [admin.email]);

        // Create new admin
        const result = await pool.query(
            'INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, true) RETURNING *',
            [admin.username, admin.email, hashedPassword]
        );

        console.log('Admin user created successfully:');
        console.log('Email:', admin.email);
        console.log('Password:', admin.password);
        console.log('Use these credentials to login as admin');

    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await pool.end();
    }
};

createAdmin(); 