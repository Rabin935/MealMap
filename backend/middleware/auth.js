const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Regular authentication
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                message: 'No authentication token, access denied',
                error: 'TOKEN_MISSING'
            });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        res.status(401).json({ 
            message: 'Token verification failed, authorization denied',
            error: err.name
        });
    }
};

// Admin authentication
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                message: 'No authentication token, access denied',
                error: 'TOKEN_MISSING'
            });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the user is an admin
        const adminCheck = await pool.query(
            'SELECT is_admin FROM users WHERE id = $1',
            [verified.id]
        );

        if (!adminCheck.rows[0] || !adminCheck.rows[0].is_admin) {
            console.log('Admin access denied for user:', verified.id);
            return res.status(403).json({ 
                message: 'Access denied. Admin privileges required.',
                error: 'NOT_ADMIN'
            });
        }

        req.user = {
            ...verified,
            isAdmin: true
        };
        next();
    } catch (err) {
        console.error('Admin Auth Error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token format',
                error: err.name
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token has expired',
                error: err.name
            });
        }
        res.status(401).json({ 
            message: 'Authentication failed',
            error: err.message
        });
    }
};

module.exports = { auth, adminAuth }; 