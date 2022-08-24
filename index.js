require('dotenv').config();
const express = require('express');
const http2Express = require('http2-express-bridge');
const http2 = require('http2');
const bodyParser = require('body-parser');
const { readFileSync } = require('fs');
const app = http2Express(express);

// Basic Configuration
const PORT = process.env.PORT || 8080;
const DOMAIN = process.env.DOMAIN;
const HOST = '0.0.0.0';

// Import Prisma Client
const prisma = require('./src/config/database');

// Import routes modules
const charactersRouter = require('./src/routes/characters.routes');
const missionsRouter = require('./src/routes/missions.routes');
const guildsRouter = require('./src/routes/guilds.routes');

// Import scheduled jobs
require('./src/schedules/updateAttributesWeekly')();

// Middleware
app.use(express.json()); // Parse incoming request with JSON payload
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

// Server configuration fot HTTP2
const options = {
    key: readFileSync('./server.key'),
    cert: readFileSync('./server.cert'),
    allowHTTP1: true
};

// Initialize server
const server = http2.createSecureServer(options, app);

server.on('error', (err) => console.log(err));

server.listen(PORT, () => {
    if (prisma) console.log('Database connection stablished successfully');
    console.log(`Server running on Port: ${PORT}`);
});

// Export the Express API
module.export = app;
