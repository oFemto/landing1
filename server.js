const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'cee-loo-restaurant'
})
.then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('💾 Database: cee-loo-restaurant');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Auth middleware
const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact({
            name: req.body.name,
            email: req.body.email
        });
        
        const savedContact = await contact.save();
        console.log('Contact saved:', savedContact);
        
        res.json({ 
            success: true, 
            message: 'Message received',
            contact: savedContact
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Error saving message',
            error: error.message 
        });
    }
});

// Admin routes to view submissions
app.get('/api/admin/contacts', requireAuth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            message: 'Error fetching contacts', 
            error: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
