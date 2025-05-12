const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  description: { type: String },
  capacity: { type: Number, default: 100 },
  category: {
    type: String,
    enum: ['conference', 'workshop', 'seminar', 'webinar', 'meetup'],
    default: 'conference'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
  }],
  ratings:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Feedback'
  }],
  organizer: { type: String, required: true },
}, { timestamps: true });


// Export the model
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;