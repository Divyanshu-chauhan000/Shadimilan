const Enquiry = require('../models/Enquiry');
const Profile = require('../models/Profile');

// @desc    Send Enquiry
// @route   POST /api/enquiry
// @access  Private
const sendEnquiry = async (req, res) => {
    try {
        const { receiverId, message } = req.body;

        if (req.user._id.toString() === receiverId) {
            return res.status(400).json({ message: "You cannot send an enquiry to yourself." });
        }

        // Check if receiver has an approved profile
        const receiverProfile = await Profile.findOne({ user: receiverId, status: 'approved' });
        if (!receiverProfile) {
            return res.status(404).json({ message: "Receiver profile not found or not public." });
        }

        const enquiry = await Enquiry.create({
            sender: req.user._id,
            receiver: receiverId,
            message: message || "I am interested in your profile. Please check my profile and respond."
        });

        res.status(201).json(enquiry);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already sent an enquiry to this profile." });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's enquiries (Sent and Received)
// @route   GET /api/enquiry/me
// @access  Private
const getMyEnquiries = async (req, res) => {
    try {
        const sent = await Enquiry.find({ sender: req.user._id })
            .populate('receiver', 'name email gender')
            .sort({ createdAt: -1 });
            
        const received = await Enquiry.find({ receiver: req.user._id })
            .populate('sender', 'name email gender')
            .sort({ createdAt: -1 });

        res.json({ sent, received });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Enquiry Status
// @route   PUT /api/enquiry/:id/status
// @access  Private
const updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'seen', 'accepted', 'rejected'
        const enquiry = await Enquiry.findById(req.params.id);

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        if (enquiry.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this enquiry' });
        }

        enquiry.status = status;
        await enquiry.save();

        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendEnquiry,
    getMyEnquiries,
    updateEnquiryStatus
};
