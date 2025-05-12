const Feedback = require('../models/Feedback');
const Event = require('../models/Event'); // Assuming you have an Event model for event details

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const { rating, comment, eventId } = req.body;
    const UserId = req.user.id; // Assuming you have user authentication (JWT token)
    // Validate the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create a new feedback entry
    const feedback = new Feedback({
      rating,
      comment,
      eventId,
      userId: UserId
    });

    // Save feedback to the database
    await feedback.save();

     // Link feedback to the Event
    await Event.findByIdAndUpdate(eventId, {
      $push: {
        comments: feedback._id,
        ratings: feedback._id
      }
    });

    return res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error submitting feedback' });
  }
};


const getFeedbackForUSER = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedbacks = await Feedback.find({ userId }).populate('eventId', 'name'); 
    return res.status(200).json({ feedbacks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching user feedback' });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Ensure the logged-in user is the owner
    if (feedback.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this feedback' });
    }

    // Remove feedback from the associated event
    await Event.findByIdAndUpdate(feedback.eventId, {
      $pull: {
        comments: feedback._id,
        ratings: feedback._id
      }
    });

    await Feedback.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting feedback' });
  }
};


module.exports = { createFeedback ,getFeedbackForUSER , deleteFeedback};
