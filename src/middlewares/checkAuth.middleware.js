const generateToken = require('./generateToken.middleware');
const tokenCaching = require('./tokenCaching.middleware');
const splitCookie = require('../utils/splitCookie.utils');
const jwt = require('jsonwebtoken');

/**
 *  @desc Splits request Cookie header array and generates another array that contain access and/or refresh token.
 *  @param {array}  contains cookies from request Cookie header.
 */
refreshAccessToken = async (refresh_token, character) => {
    try {
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        const verifiedToken = await jwt.verify(refresh_token, refresh_secret);
        if (!verifiedToken) return false;

        const access_token = generateToken(character, 1);
        return access_token;
    } catch (error) {
        return false;
    }
};

/**
 * @desc Gets tokens through request cookie and checks token validation. If the access token expired, a new access token is generated through the refresh token.
 * */
module.exports = async (req, res, next) => {
    let verifiedToken;
    let cookieArray, accessToken, refreshToken;
    try {
        const cookies = req.get('Cookie').split('; ');
        cookieArray = splitCookie(cookies);
        accessToken = cookieArray['access_token'];

        if (!accessToken) {
            // An access token must be in Cookie header.
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }

        const secret = process.env.JWT_SECRET;
        verifiedToken = await jwt.verify(accessToken, secret); // If the token cannot be verified an error threw
    } catch (error) {
        if (error.name === 'TokenExpiredError' && error.expiredAt !== undefined) {
            // ++ Refresh the access token
            if (typeof req.get('Cookie') !== 'undefined') {
                refreshToken = cookieArray['refresh_token'];
                const newAccessToken = await refreshAccessToken(refreshToken);
                if (newAccessToken) {
                    await tokenCaching.setCache(newAccessToken.token); // Cache the new token

                    res.status(200).cookie(
                        'access_token',
                        newAccessToken.token,
                        newAccessToken.cookie
                    );

                    req.isAuth = true;
                    next();
                    return;
                }
            }
            // Refresh the access token
        }
        res.status(500).json({
            result: false,
            message: 'Invalid or Expired Token. Sign in again'
        });

        return;
    }
    if (!verifiedToken) {
        res.status(401).json({ message: 'Authentication failed' });
        return;
    }
    req.characterId = verifiedToken.characterId;
    req.isAuth = true;
    next();
};
