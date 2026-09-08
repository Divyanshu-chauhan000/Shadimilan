const express = require('express');
const router = express.Router();
const { sendEnquiry, getMyEnquiries, updateEnquiryStatus } = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, sendEnquiry);

router.get('/me', protect, getMyEnquiries);
router.put('/:id/status', protect, updateEnquiryStatus);

module.exports = router;
