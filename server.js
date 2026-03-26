const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/saraswati_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Database Models
const eventSchema = new mongoose.Schema({
    day: String,
    month: String,
    title: String,
    location: String,
    description: String,
    tag: String,
    createdAt: { type: Date, default: Date.now }
});
const Event = mongoose.model('Event', eventSchema);

const achievementSchema = new mongoose.Schema({
    icon: String, // emoji or text
    title: String,
    description: String,
    year: String,
    createdAt: { type: Date, default: Date.now }
});
const Achievement = mongoose.model('Achievement', achievementSchema);

// --- API Endpoints ---

// 1. Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Achievements
app.get('/api/achievements', async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ createdAt: -1 });
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/achievements', async (req, res) => {
    try {
        const newAch = new Achievement(req.body);
        const savedAch = await newAch.save();
        res.status(201).json(savedAch);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/achievements/:id', async (req, res) => {
    try {
        await Achievement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Achievement deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve the main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'school_website.html'));
});

// Serve the admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
