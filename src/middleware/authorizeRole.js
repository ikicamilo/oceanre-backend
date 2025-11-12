// src/middleware/authorizeRole.js

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: "Missing authentication" });
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}

module.exports = { authorizeRole };
