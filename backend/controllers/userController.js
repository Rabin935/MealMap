const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register User
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields',
                required: ['username', 'email', 'password'],
                received: Object.keys(req.body)
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        // Create token
        const token = jwt.sign(
            { id: newUser.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            id: newUser.rows[0].id,
            username: newUser.rows[0].username,
            email: newUser.rows[0].email,
            token
        });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ 
            message: 'Server error', 
            error: err.message,
            receivedBody: req.body 
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password',
                required: ['email', 'password'],
                received: Object.keys(req.body)
            });
        }

        console.log('Login attempt for email:', email);

        // Check for user email
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND is_admin = FALSE',
            [email]
        );

        console.log('User query result:', user.rows.length > 0 ? 'User found' : 'User not found');

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            id: user.rows[0].id,
            username: user.rows[0].username,
            email: user.rows[0].email,
            token
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ 
            message: 'Server error', 
            error: err.message,
            receivedBody: req.body 
        });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password',
                required: ['email', 'password'],
                received: Object.keys(req.body)
            });
        }

        console.log('Admin login attempt for:', email);

        // Check for admin user
        const admin = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        console.log('Admin query result:', admin.rows.length > 0 ? 'User found' : 'User not found');

        if (admin.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid admin credentials' });
        }

        // Verify admin status
        if (!admin.rows[0].is_admin) {
            console.log('User found but not an admin');
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.rows[0].password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid admin credentials' });
        }

        // Create token with admin flag
        const token = jwt.sign(
            { 
                id: admin.rows[0].id,
                isAdmin: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            id: admin.rows[0].id,
            username: admin.rows[0].username,
            email: admin.rows[0].email,
            isAdmin: true,
            token
        });
    } catch (err) {
        console.error('Admin Login Error:', err);
        res.status(500).json({ 
            message: 'Server error',
            error: err.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    adminLogin
}; 