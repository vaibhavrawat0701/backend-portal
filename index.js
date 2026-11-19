require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const studentRoutes = require('./src/routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Body parser
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

// 404 handler — undefined API endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler — unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred. Please try again later.',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
