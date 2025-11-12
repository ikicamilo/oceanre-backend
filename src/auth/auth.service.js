// src/auth/auth.service.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // adjust path if your User model is elsewhere
require("dotenv").config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "8h"; // adjust as needed

async function register({ name, email, password, role = "SALESPERSON" }) {
  if (!name || !email || !password)
    throw new Error("name, email and password are required");

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({ name, email, password_hash, role });
  // hide password
  const safe = user.toJSON();
  delete safe.password_hash;
  return safe;
}

async function authenticate({ email, password }) {
  if (!email || !password) throw new Error("email and password are required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  const safe = user.toJSON();
  delete safe.password_hash;

  return { token, user: safe };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  register,
  authenticate,
  verifyToken,
};
