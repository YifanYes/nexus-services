require('dotenv').config();
require("./src/config/database").connect();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Import routes modules
const characterRouter = require('./src/routes/characters.routes');

// Middleware
app.use(bodyParser.json());
app.use('/characters', characterRouter);

// Catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(err.status || 404).json({
        message: "No such route exists"
    })
});

// Error handler
app.use(function (err, req, res) {
    res.status(err.status || 500).json({
        message: "Error Message"
    })
});

app.listen(PORT, HOST, error => {
    if (error) return console.log(error);
    console.log(`Server running on PORT ${PORT}`);
});

// Export the Express API
module.export = app;