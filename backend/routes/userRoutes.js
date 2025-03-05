const express = require('express');
const router = express.Router();
const { registerUser, loginUser, adminLogin } = require('../controllers/userController');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin auth route
router.post('/admin/login', adminLogin);

module.exports = router; 