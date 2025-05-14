const Feedback = require('../models/Feedback');
const Event = require('../models/Event');

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const { rating, comment, eventId } = req.body;
    const UserId = req.user.id;

    if (!rating || !eventId) {
      return res.status(400).json({ message: 'Rating and Event ID are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const feedbackData = {
      rating,
      eventId,
      userId: UserId,
    };

    if (comment && comment.trim() !== '') {
      feedbackData.comment = comment;
    }

    const feedback = new Feedback(feedbackData);
    await feedback.save();

    // Link feedback to the event
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

    //  logged-in user is the owner
    if (feedback.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this feedback' });
    }

    // Remove feedback 
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

const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id; 
    const { rating, comment } = req.body;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this feedback' });
    }

    if (rating !== undefined) feedback.rating = rating;
    if (comment !== undefined) feedback.comment = comment;

    const updatedFeedback = await feedback.save();

    return res.status(200).json({
      message: 'Feedback updated successfully',
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating feedback' });
  }
};


module.exports = { createFeedback ,getFeedbackForUSER , deleteFeedback, updateFeedback};
