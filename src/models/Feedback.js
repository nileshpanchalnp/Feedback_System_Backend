const mongoose = require('mongoose');

// Feedback Schema
const feedbackSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        rating: {
            type: Number,
            min: 1, max: 5,
            required: true
        },
        comment: {
            type: String,
        },
        userId: {
            type:String,
          
        }, 
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Feedback Model
const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;