const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authorizeRole');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

router.use(authenticateJWT);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of all users
 *       401:
 *         description: Unauthorized
 */
router.get("/", authorizeRole('ADMIN', 'ACOUNTANT', 'SALESPERSON'), userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns a single user
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authorizeRole('ADMIN', 'ACOUNTANT', 'SALESPERSON'), userController.getById);

module.exports = router;
