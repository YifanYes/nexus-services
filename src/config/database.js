const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

exports.connect = () => {
    // Connecting to the database
    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
        })
        .then(() => {
            console.log('MongoDB database connection established successfully');
        })
        .catch((error) => {
            console.log('Database connection failed. Exiting now...');
            console.error(error);
            process.exit(1);
        });
};
