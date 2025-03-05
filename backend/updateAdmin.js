const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const updateAdmin = async () => {
    try {
        // Admin credentials
        const admin = {
            email: 'admin@recipefinder.com',
            password: 'admin123'
        };

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);

        // Update admin password and ensure is_admin is true
        const result = await pool.query(
            'UPDATE users SET password = $1, is_admin = true WHERE email = $2 RETURNING *',
            [hashedPassword, admin.email]
        );

        if (result.rows.length === 0) {
            // Create new admin if doesn't exist
            await pool.query(
                'INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, true)',
                ['admin', admin.email, hashedPassword]
            );
        }

        console.log('Admin credentials updated successfully:');
        console.log('Email:', admin.email);
        console.log('Password:', admin.password);
        console.log('Use these credentials to login as admin');

    } catch (err) {
        console.error('Error updating admin:', err);
    } finally {
        await pool.end();
    }
};

updateAdmin(); 