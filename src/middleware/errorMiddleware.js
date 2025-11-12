// src/middleware/errorMiddleware.js
function errorMiddleware(err, req, res, next) {
  // Default HTTP status
  let status = err.status || 500;

  // Friendly message for end users
  let message = "An unexpected error occurred.";

  // Handle Sequelize validation or custom errors
  if (err.name === "SequelizeValidationError") {
    status = 400;
    message = err.errors.map((e) => e.message).join(", ");
  } else if (err.name === "SequelizeUniqueConstraintError") {
    status = 400;
    message = "Duplicate record — one of the fields must be unique.";
  } else if (err.name === "CustomError") {
    message = err.message;
  } else if (err.message && !err.stack.includes("Sequelize")) {
    message = err.message; // probably a business rule message
  }

  res.status(status).json({
    error: true,
    message,
  });
}

module.exports = errorMiddleware;
