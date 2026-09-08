require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');

const seedProfiles = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Please add MONGO_URI to .env file before running this script.");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        // ════════════════════════════════════════
        // PROFILE 1: Priya Sharma (Female)
        // ════════════════════════════════════════
        const priyaEmail = 'priya.sharma@example.com';
        let priyaUser = await User.findOne({ email: priyaEmail });

        if (!priyaUser) {
            priyaUser = await User.create({
                name: 'Priya Sharma',
                email: priyaEmail,
                mobile: '9876543210',
                password: 'password123',
                gender: 'Female',
                role: 'user'
            });
            console.log('✅ Created user: Priya Sharma');
        } else {
            console.log('ℹ️  User Priya Sharma already exists');
        }

        let priyaProfile = await Profile.findOne({ user: priyaUser._id });
        if (!priyaProfile) {
            priyaProfile = await Profile.create({
                user: priyaUser._id,
                dob: new Date('2001-03-15'),
                height: "5'5\"",
                birthPlace: 'Delhi, India',
                photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
                education: 'B.Tech (Computer Science)',
                occupation: 'Software Engineer',
                workingAt: 'Infosys, Bangalore',
                family: {
                    grandfather: 'Late Shri Ram Prasad Sharma',
                    grandmother: 'Smt. Kamla Devi',
                    father: { name: 'Rajesh Kumar Sharma', occupation: 'Govt. Teacher' },
                    mother: { name: 'Sunita Sharma', occupation: 'Homemaker' },
                    siblings: [
                        { relation: 'Elder Brother', education: 'MBA', occupation: 'Bank Manager' },
                        { relation: 'Younger Sister', education: 'B.Com', occupation: 'Student' }
                    ],
                    uncles: ['Anil Sharma', 'Suresh Sharma'],
                    cousins: ['Vikas Sharma', 'Pooja Sharma']
                },
                gotra: {
                    self: 'Kashyap',
                    mother: 'Bhardwaj',
                    dadi: 'Vatsa',
                    nani: 'Garg'
                },
                contact: {
                    primaryMobile: '9876543210',
                    alternateMobile: '9876543211'
                },
                residence: {
                    address: '45, Sector 14, Dwarka',
                    city: 'New Delhi',
                    district: 'South West Delhi',
                    state: 'Delhi'
                },
                status: 'approved'
            });
            console.log('✅ Created profile: Priya Sharma (Female, 25, Delhi, B.Tech, Software Engineer @ Infosys)');
        } else {
            console.log('ℹ️  Profile for Priya Sharma already exists');
        }

        // ════════════════════════════════════════
        // PROFILE 2: Rahul Verma (Male)
        // ════════════════════════════════════════
        const rahulEmail = 'rahul.verma@example.com';
        let rahulUser = await User.findOne({ email: rahulEmail });

        if (!rahulUser) {
            rahulUser = await User.create({
                name: 'Rahul Verma',
                email: rahulEmail,
                mobile: '9123456789',
                password: 'password123',
                gender: 'Male',
                role: 'user'
            });
            console.log('✅ Created user: Rahul Verma');
        } else {
            console.log('ℹ️  User Rahul Verma already exists');
        }

        let rahulProfile = await Profile.findOne({ user: rahulUser._id });
        if (!rahulProfile) {
            rahulProfile = await Profile.create({
                user: rahulUser._id,
                dob: new Date('1998-07-22'),
                height: "5'10\"",
                birthPlace: 'Jaipur, Rajasthan',
                photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
                education: 'MBA (Finance)',
                occupation: 'Business Analyst',
                workingAt: 'TCS, Mumbai',
                family: {
                    grandfather: 'Late Shri Hari Om Verma',
                    grandmother: 'Smt. Savitri Devi',
                    father: { name: 'Mahesh Verma', occupation: 'Businessman (Textile)' },
                    mother: { name: 'Asha Verma', occupation: 'Homemaker' },
                    siblings: [
                        { relation: 'Elder Sister', education: 'B.Ed', occupation: 'School Teacher' }
                    ],
                    uncles: ['Dinesh Verma'],
                    cousins: ['Amit Verma']
                },
                gotra: {
                    self: 'Bhardwaj',
                    mother: 'Gautam',
                    dadi: 'Sandilya',
                    nani: 'Kashyap'
                },
                contact: {
                    primaryMobile: '9123456789',
                    alternateMobile: '9123456780'
                },
                residence: {
                    address: '78, Malviya Nagar',
                    city: 'Jaipur',
                    district: 'Jaipur',
                    state: 'Rajasthan'
                },
                status: 'approved'
            });
            console.log('✅ Created profile: Rahul Verma (Male, 28, Jaipur, MBA, Business Analyst @ TCS)');
        } else {
            console.log('ℹ️  Profile for Rahul Verma already exists');
        }

        console.log('\n🎉 Seeding complete! 2 dummy profiles ready.');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 Dummy User Credentials:');
        console.log('   Priya: priya.sharma@example.com / password123');
        console.log('   Rahul: rahul.verma@example.com / password123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedProfiles();
