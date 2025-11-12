const { User } = require("../models"); 

async function getAllUsers() {
  return await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'created_at']
  });
}

async function getUserById(id) {
  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'role', 'created_at']
  });
  return user;
}

module.exports = {
  getAllUsers,
  getUserById,
};
