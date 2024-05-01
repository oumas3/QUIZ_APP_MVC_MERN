const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const studentQuizRoutes = require('./routes/studentQuizRoutes');

// Configuration
const PORT = 5000;
const DB_URI = "mongodb+srv://Sora_Co:2002sora@webquiz.mfnv6fi.mongodb.net/QUIZ_Web"; // Place your MongoDB URI here
const JWT_SECRET = 'sorasorasoraaaa@@2145'; // Place your JWT secret here
const SESSION_SECRET = 'sorasorasoraaa@@2145'; //

// Create an Express app
const app = express();

// Middlewares
// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === "production"
  }
}));

// Enable CORS with specific options
app.use(cors({
  origin: ['http://localhost:3000'], // Add your client's address here
  credentials: true,
}));

// Parse JSON requests
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/student-quizzes', studentQuizRoutes);

// Connect to MongoDB and start the server
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' });
});
