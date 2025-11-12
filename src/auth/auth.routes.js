const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");
const { authenticateJWT } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login, and profile endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (public endpoint)
 *     tags: [Authentication]
 *     # 👇 Explicitly override any global auth requirements
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation or registration error
 */
router.post("/register", registerValidator, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT (public endpoint)
 *     tags: [Authentication]
 *     # 👇 Explicitly override global BearerAuth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginValidator, authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get information about the authenticated user (requires JWT)
 *     tags: [Authentication]
 *     # 👇 This one *does* require authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the logged-in user's info
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticateJWT, authController.me);

module.exports = router;
