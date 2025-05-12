const Event = require("../models/Event");

// Create Event
const createEvent = async (req, res) => {
  try {
    const {
      name,
      date,
      location,
      description,
      capacity,
      category,
      organizer
    } = req.body;

    // Validation (Optional but recommended)
    if (!name || !date || !organizer) {
      return res.status(400).json({ error: 'Name, date, and organizer are required' });
    }

    const event = new Event({
      name,
      date,
      location,
      description,
      capacity,
      category,
      organizer
    });

    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};


const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate({
        path: 'comments',
        select: 'comment createdAt userId',
        populate: {
          path: 'userId',
          select: 'username email'
        }
      })
      .populate({
        path: 'ratings',
        select: 'rating createdAt userId',
        populate: {
          path: 'userId',
          select: 'username email'
        }
      });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};



module.exports = { createEvent, getEvents };