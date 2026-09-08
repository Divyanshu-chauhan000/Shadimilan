require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const seedAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Please add MONGO_URI to .env file before running this script.");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminExists = await User.findOne({ email: 'admin@shadimilan.com' });
        
        if (adminExists) {
            console.log('Admin already exists. Use email: admin@shadimilan.com');
            process.exit(0);
        }

        await User.create({
            name: 'Super Admin',
            email: 'admin@shadimilan.com',
            mobile: '0000000000',
            password: 'password123', // Will be hashed by pre-save hook
            gender: 'Male',
            role: 'admin'
        });

        console.log('Admin seeded successfully!');
        console.log('Email: admin@shadimilan.com');
        console.log('Password: password123');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
