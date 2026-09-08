require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dns = require('dns');
dns.setServers([
    '0.0.0.0',
    '1.1.1.1'
])

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Client and Admin Vite default ports
    credentials: true,
}));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
