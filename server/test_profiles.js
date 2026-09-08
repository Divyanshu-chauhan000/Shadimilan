const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const User = require('./models/User');
require('dotenv').config();

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const pageSize = 10;
        const page = 1;

        // Build query
        const query = { status: 'approved' };
        
        // Mock req.user._id
        const fakeUserId = new mongoose.Types.ObjectId();
        
        // Exclude current user and blocked users
        const blockedUsers = await User.find({ isBlocked: true }).select('_id');
        const blockedUserIds = blockedUsers.map(u => u._id);
        query.user = { $ne: fakeUserId, $nin: blockedUserIds };

        console.log('Query:', JSON.stringify(query, null, 2));

        const count = await Profile.countDocuments(query);
        console.log('Count:', count);

        const profiles = await Profile.find(query)
            .populate('user', 'name gender')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        console.log('Profiles found:', profiles.length);

        mongoose.connection.close();
    } catch (err) {
        console.error('ERROR:', err);
        mongoose.connection.close();
    }
};

runTest();
