const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'https://takaya-films.vercel.app',
        /\.vercel\.app$/
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const careerRoutes = require('./routes/career');
const profileRoutes = require('./routes/profile');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'TAKAYA FILMS API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// Catch all other routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});