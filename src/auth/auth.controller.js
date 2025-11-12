// src/auth/auth.controller.js
const authService = require("./auth.service");

async function register(req, res, next) {
  try {
    const payload = req.body;
    const user = await authService.register(payload);
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticate({ email, password });
    return res.json(result);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

async function me(req, res, next) {
  try {
    return res.json({ user: req.user });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  me
};
