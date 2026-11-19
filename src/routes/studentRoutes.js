const express = require('express');
const router = express.Router();

const { signup, login, getProfile } = require('../controllers/studentController');
const { signupValidators, loginValidators } = require('../validators/studentValidators');
const handleValidationErrors = require('../middleware/handleValidationErrors');
const protect = require('../middleware/authMiddleware');

// POST /api/students/signup
router.post('/signup', signupValidators, handleValidationErrors, signup);

// POST /api/students/login
router.post('/login', loginValidators, handleValidationErrors, login);

// GET /api/students/profile  (protected — requires Bearer token)
router.get('/profile', protect, getProfile);

module.exports = router;
