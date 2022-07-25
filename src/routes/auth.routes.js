const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();

router.get('/setCSRFToken', csrfProtection, (req, res, next) => {
    // Generate token and send in response data, session id is set in cookies
    // connect.sid is a default session id given by the middleware
    try {
        const token = req.csrfToken();
        res.send({ csrfToken: token });
    } catch (err) {
        res.status(500).json({ result: false, message: 'Something went wrong.' });
        return;
    }
});

router.post('/checkCSRFToken', csrfProtection, (req, res) => {
    // The validation of the produced token is checked by the csrfProtection function
    // If the token is invalid, it throws a 'ForbiddenError: invalid csrf token' error
    res.send({ message: 'CSRF Token is valid' });
});

router.use(csrfProtection);

module.exports = router;
