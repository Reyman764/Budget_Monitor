require('dotenv').config({ quiet: true }); // silence dotenv's random startup "tip" ads
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const householdRoutes = require('./routes/household');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');
const budgetRoutes = require('./routes/budget');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));

app.use('/api/auth', authRoutes);
app.use('/api/household', householdRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/budget', budgetRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
      console.log(`📊 Database: ${process.env.DB_NAME}`);
    });
  } catch (err) {
    console.error('❌ Unable to start server:', err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
