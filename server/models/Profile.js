const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    // Basic Details
    dob: { type: Date, required: true },
    height: { type: String, required: true },
    birthPlace: { type: String, required: true },
    photoUrl: { type: String }, // Cloudinary URL
    
    // Education & Occupation
    education: { type: String, required: true },
    occupation: { type: String, required: true },
    workingAt: { type: String }, // Optional

    // Family Details
    family: {
        grandfather: { type: String },
        grandmother: { type: String },
        father: {
            name: { type: String, required: true },
            occupation: { type: String }
        },
        mother: {
            name: { type: String, required: true },
            occupation: { type: String }
        },
        siblings: [{
            relation: { type: String, enum: ['Younger Brother', 'Elder Brother', 'Younger Sister', 'Elder Sister'] },
            education: { type: String },
            occupation: { type: String }
        }],
        uncles: [{ type: String }],
        cousins: [{ type: String }]
    },

    // Gotra
    gotra: {
        self: { type: String, required: true },
        dadi: { type: String },
        mother: { type: String },
        nani: { type: String }
    },

    // Contact
    contact: {
        primaryMobile: { type: String, required: true },
        alternateMobile: { type: String }
    },

    // Residence
    residence: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true }
    },

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
