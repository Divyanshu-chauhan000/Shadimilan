const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'seen', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

// Prevent duplicate pending enquiries from same sender to same receiver
enquirySchema.index({ sender: 1, receiver: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

module.exports = mongoose.model('Enquiry', enquirySchema);
