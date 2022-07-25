require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

// Basic Configuration
const PORT = process.env.PORT || 8080;
const DOMAIN = process.env.DOMAIN;
const HOST = '0.0.0.0';

// Import Prisma Client
const prisma = require('./src/config/database');

// CSRF protection middleware
const sessionConfig = session({
    secret: process.env.CSRFT_SESSION_SECRET,
    keys: ['some random key'],
    resave: false,
    saveUninitialized: false,
    // Generated session id is stored in the cookie
    cookie: {
        maxAge: parseInt(process.env.CSRFT_EXPIRESIN), // Expiration time
        sameSite: 'strict', // Cookies will only be sent in a first-party context. 'lax' is default value for third-parties
        httpOnly: true, // Cookie is sent only over HTTP(S) domain of the server in which the URL is being requested
        secure: false // Browser only sends the cookie over HTPPS. False for localhost
    }
});

// Import routes modules
const authRouter = require('./src/routes/auth.routes');
const charactersRouter = require('./src/routes/characters.routes');
const missionsRouter = require('./src/routes/missions.routes');
const guildsRouter = require('./src/routes/guilds.routes');

// Import scheduled jobs
require('./src/schedules/updateAttributesWeekly')();

// Middleware
app.use(sessionConfig);
app.use(express.json()); // Parse incoming request with JSON payload
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/auth', authRouter);
app.use('/api/characters', charactersRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/guilds', guildsRouter);

// Default route to check server status
app.get('/', function (req, res) {
    return res.status(200).json({ message: 'Server online' });
});

// Catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404).json({
        message: 'No such route exists'
    });
});

// Error handler
app.use(function (err, req, res) {
    res.status(500).json({
        message: 'Error Message'
    });
});

app.listen(PORT, HOST, (error) => {
    if (error) return console.log(error);
    if (prisma) console.log('Database connection stablished successfully');
    console.log(`Server running on ${DOMAIN}:${PORT}`);
});

// Export the Express API
module.export = app;
