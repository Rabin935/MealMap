const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsPath = path.resolve(__dirname, 'public', 'uploads');
require('fs').mkdirSync(uploadsPath, { recursive: true });

// Serve static files from the public directory
app.use('/uploads', express.static(path.resolve(__dirname, 'public', 'uploads')));

// Database connection test
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Connected to Database!');
    });
});

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Recipe Finder API' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);

// Test database route
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, timestamp: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Error handling for route not found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 