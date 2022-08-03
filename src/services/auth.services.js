require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (character) => {
    return jwt.sign({ character }, process.env.SEED_AUTH, {
        expiresIn: process.env.TOKEN_EXPIRY
    });
};

const verifyToken = (token) => {
    if (!token) return res.status(400).json({ message: 'Token must be provided' });

    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret); // If the token cannot be verified, threw an error
};

module.exports = {
    generateToken,
    verifyToken
};
