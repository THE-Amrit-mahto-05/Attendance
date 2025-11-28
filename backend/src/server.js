require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const batchRoutes = require('./routes/batches');
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

// Enable CORS for all origins (can restrict to your frontend later)
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/batches', batchRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
