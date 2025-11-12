require('dotenv').config();
const express = require('express');
const setupSwagger = require('./src/config/swagger');
const cors = require('cors');
const app = express();
const routes = require('./src/routes');
const { sequelize } = require('./src/config/database');
const errorMiddleware = require("./src/middleware/errorMiddleware");

app.use(cors());
app.use(express.json());

setupSwagger(app);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running correctly 🚀' });
});

// Mount routes
app.use('/api', routes);

app.use(errorMiddleware);

// Database connection and server start
const PORT = process.env.PORT || 8080;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to MySQL successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ Database connection error:', err));

module.exports = app;
