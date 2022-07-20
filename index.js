require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Import Prisma Client
const prisma = require('./src/config/database');

// Import routes modules
const characterRouter = require('./src/routes/characters.routes');
const missionRouter = require('./src/routes/missions.routes');

// Import scheduled jobs
require('./src/schedules/updateAttributesWeekly')();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/character', characterRouter);
app.use('/api/mission', missionRouter);

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
    console.log(`Server running on PORT ${PORT}`);
});

// Export the Express API
module.export = app;
