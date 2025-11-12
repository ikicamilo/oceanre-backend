require('dotenv').config({ path: '.env.test' });
const { sequelize } = require('../src/config/database');

beforeAll(async () => {
  console.log("🧪 Using database:", process.env.DB_NAME);
  try {
    await sequelize.authenticate();
    // Disable FK checks to safely drop tables
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.drop(); // Drops all tables
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    await sequelize.sync(); // Recreate all tables
    console.log("✅ Database schema synced successfully");
  } catch (err) {
    console.error("❌ Database setup failed:", err);
    throw err;
  }
});

afterAll(async () => {
  await sequelize.close();
});
