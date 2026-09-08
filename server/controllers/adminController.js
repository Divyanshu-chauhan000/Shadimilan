const User = require('../models/User');
const Profile = require('../models/Profile');
const Enquiry = require('../models/Enquiry');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProfiles = await Profile.countDocuments();
        const pendingProfiles = await Profile.countDocuments({ status: 'pending' });
        const totalEnquiries = await Enquiry.countDocuments();

        res.json({
            totalUsers,
            totalProfiles,
            pendingProfiles,
            totalEnquiries
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Block / Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot block an admin' });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all profiles (with pending filter)
// @route   GET /api/admin/profiles
// @access  Private/Admin
const getAllProfiles = async (req, res) => {
    try {
        const query = {};
        if (req.query.status) {
            query.status = req.query.status;
        }
        const profiles = await Profile.find(query).populate('user', 'name email mobile gender');
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve or Reject Profile
// @route   PUT /api/admin/profiles/:id/status
// @access  Private/Admin
const updateProfileStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        profile.status = status;
        await profile.save();

        res.json({ message: `Profile has been ${status}`, profile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all enquiries
// @route   GET /api/admin/enquiries
// @access  Private/Admin
const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({})
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getUsers,
    toggleBlockUser,
    getAllProfiles,
    updateProfileStatus,
    getAllEnquiries
};
