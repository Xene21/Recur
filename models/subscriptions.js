const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    providerName: {
        type: String,
        required: [true, 'Please provide the service name (e.g., Netflix)'],
        lowercase: true,
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'] // Prevents bad financial data
    },
    billingCycle: {
        type: String,
        required: true,
        enum: ['monthly', 'yearly'], // Prevents typos in cycles
        lowercase: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ['entertainment', 'utilities', 'software', 'health', 'other'],
        default: 'other'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // The "glue" connecting the sub to the user
    },
    renewalDate: {
        type: Date,
        required: [true, 'Please select a starting date'],
        default: Date.now // Defaults to today if not provided
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt automatically
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;