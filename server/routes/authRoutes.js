const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

router.post('/register', [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('mobile', 'Please include a valid mobile number').isLength({ min: 10 }),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('gender', 'Gender is required').isIn(['Male', 'Female'])
], registerUser);

router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], loginUser);

router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);

module.exports = router;
