require('dotenv').config();
require("./src/config/database").connect();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use('/characters', characterRouter);

// Import routes modules
const characterRouter = require('./src/routes/characters.routes');

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

app.listen(port, error => {
    if (error) return console.log(error);
    console.log(`Server running on PORT ${port}`);
});

// Export the Express API
module.export = app;