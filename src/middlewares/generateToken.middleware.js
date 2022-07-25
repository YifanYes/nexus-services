const jwt = require('jsonwebtoken');

/**
 * @desc Genrates a token. Return the token and cookie configuration.
 * @param {user} credentials set in token
 * $ param {tokenType} is 1: JWT for authentication, 2: JWT foor refresh token
 * <<process.env.VARIABLE_NAME>> is a variable from .env file
 */

exports.generateToken = async (character, tokenType) => {
    let secret;
    let expiresIn;
    let payload = {};

    if (tokenType === 1) {
        secret = process.env.JWT_SECRET;
        expiresIn = process.env.JWT_EXPIRESIN;
        payload = {
            id: character.id.toString(),
            character: character.email
        };
    }

    if (tokenType === 2) {
        secret = process.env.JWT_REFRESH_SECRET;
        expiresIn = process.env.JWT_REFRESH_EXPIRESIN;
        payload = {
            id: character.id.toString(),
            character: character.email
        };
    }

    try {
        const token = await jwt.sign(payload, secret, { expiresIn: expiresIn });

        return {
            token: token,
            cookie: {
                secure: true,
                httpOnly: true,
                sameSite: true,
                expires: new Date(Date.now() + parseInt(expiresIn))
            }
        };
    } catch (error) {
        return false;
    }
};
