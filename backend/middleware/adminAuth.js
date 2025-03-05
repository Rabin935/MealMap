const pool = require('../config/db');

const adminAuth = async (req, res, next) => {
    try {
        // Check if user exists and is admin
        const user = await pool.query(
            'SELECT is_admin FROM users WHERE id = $1',
            [req.user.id]
        );

        if (user.rows.length === 0 || !user.rows[0].is_admin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = adminAuth; 