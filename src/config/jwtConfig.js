// Read environment variables for JWT

require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    tokenExpireTime: process.env.JWT_EXPIRE_TIME
};
