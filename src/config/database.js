// src/config/database.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config(); // Works locally; ignored in EB (uses environment variables)

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

module.exports = { sequelize };
