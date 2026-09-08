const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getMyProfile, getProfiles, getProfileById } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(protect, getProfiles)
    .post(protect, upload.single('photo'), createOrUpdateProfile);

router.get('/me', protect, getMyProfile);
router.get('/:id', protect, getProfileById);

module.exports = router;
