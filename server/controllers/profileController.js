const Profile = require('../models/Profile');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Helper function to upload image to Cloudinary from memory buffer
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: 'matrimony_profiles' },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        stream.end(buffer);
    });
};

// @desc    Create or Update Profile
// @route   POST /api/profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {
    try {
        let photoUrl = req.body.photoUrl;

        // If file is uploaded, process with Cloudinary or fallback
        if (req.file) {
            if (process.env.CLOUDINARY_CLOUD_NAME) {
                const result = await streamUpload(req.file.buffer);
                photoUrl = result.secure_url;
            } else {
                photoUrl = "https://via.placeholder.com/300?text=Placeholder";
            }
        }

        const profileData = {
            user: req.user._id,
            dob: req.body.dob,
            height: req.body.height,
            birthPlace: req.body.birthPlace,
            education: req.body.education,
            occupation: req.body.occupation,
            workingAt: req.body.workingAt,
            family: req.body.family ? JSON.parse(req.body.family) : undefined,
            gotra: req.body.gotra ? JSON.parse(req.body.gotra) : undefined,
            contact: req.body.contact ? JSON.parse(req.body.contact) : undefined,
            residence: req.body.residence ? JSON.parse(req.body.residence) : undefined,
            status: 'pending' // Reset to pending if updated
        };

        if (photoUrl) {
            profileData.photoUrl = photoUrl;
        }

        let profile = await Profile.findOne({ user: req.user._id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user._id },
                { $set: profileData },
                { new: true }
            );
            return res.status(200).json(profile);
        }

        // Create
        profile = new Profile(profileData);
        await profile.save();
        res.status(201).json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's own profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email mobile gender');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all public profiles (with pagination and filters)
// @route   GET /api/profile
// @access  Private
const getProfiles = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Build query
        const query = { status: 'approved' };
        
        // Exclude current user and blocked users
        const blockedUsers = await User.find({ isBlocked: true }).select('_id');
        const blockedUserIds = blockedUsers.map(u => u._id);
        query.user = { $ne: req.user._id, $nin: blockedUserIds };

        // Filters
        if (req.query.gender) {
            const usersWithGender = await User.find({ gender: req.query.gender }).select('_id');
            const userIds = usersWithGender.map(u => u._id);
            query.user = { ...query.user, $in: userIds };
        }
        if (req.query.city) {
            query['residence.city'] = { $regex: req.query.city, $options: 'i' };
        }
        if (req.query.education) {
            query.education = { $regex: req.query.education, $options: 'i' };
        }
        
        // Age filter (based on dob)
        if (req.query.minAge || req.query.maxAge) {
            const today = new Date();
            let dateQuery = {};
            if (req.query.minAge) {
                const maxDate = new Date(today.getFullYear() - req.query.minAge, today.getMonth(), today.getDate());
                dateQuery.$lte = maxDate;
            }
            if (req.query.maxAge) {
                const minDate = new Date(today.getFullYear() - req.query.maxAge - 1, today.getMonth(), today.getDate() + 1);
                dateQuery.$gte = minDate;
            }
            query.dob = dateQuery;
        }

        const count = await Profile.countDocuments(query);
        const profiles = await Profile.find(query)
            .populate('user', 'name gender')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({
            profiles,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get profile by ID
// @route   GET /api/profile/:id
// @access  Private
const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id).populate('user', 'name email gender');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        // Only return if approved or if it's their own profile or admin
        if (profile.status !== 'approved' && profile.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
             return res.status(403).json({ message: 'Profile not visible' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrUpdateProfile,
    getMyProfile,
    getProfiles,
    getProfileById
};
