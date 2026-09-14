const Event = require("../models/Event");

// GET /api/events?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const getEvents = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (date) {
      filter.date = date;
    }

    const events = await Event.find(filter).sort({ date: 1, time: 1, createdAt: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events.", error: err.message });
  }
};

// POST /api/events
const createEvent = async (req, res) => {
  try {
    const { title, type, date, time, priority, notes } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required." });
    }

    const event = await Event.create({
      user: req.user._id,
      title,
      type,
      date,
      time,
      priority,
      notes,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Failed to create event.", error: err.message });
  }
};

// PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this event." });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Failed to update event.", error: err.message });
  }
};

// DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this event." });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event.", error: err.message });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
