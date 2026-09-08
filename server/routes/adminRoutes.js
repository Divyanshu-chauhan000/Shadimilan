const express = require('express');
const router = express.Router();
const {
    getStats,
    getUsers,
    toggleBlockUser,
    getAllProfiles,
    updateProfileStatus,
    getAllEnquiries
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin); // Apply to all admin routes

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.get('/profiles', getAllProfiles);
router.put('/profiles/:id/status', updateProfileStatus);
router.get('/enquiries', getAllEnquiries);

module.exports = router;
