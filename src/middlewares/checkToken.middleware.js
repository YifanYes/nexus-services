const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    // Express headers are auto converted to lowercase
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.query.token || req.body.token;

    if (!token) return res.status(403).send("Token required for authentication");

    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    try {
        let decoded = jwt.verify(token, process.env.SEED_AUTH);
        req.character = decoded;
    } catch (error) {
        return res.status(401).send("Invalid token");
    }

    return next();
};

module.exports = {
    checkToken: checkToken
}