const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'autocloud_super_secret_jwt_key_2026_production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

module.exports = { generateToken };
