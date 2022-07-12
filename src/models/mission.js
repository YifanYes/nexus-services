const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const missionSchema = new Schema({
    completed: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    stress: {
        type: Number,
        default: 0,
        min: -20,
        max: 20
    },
    requirements: [String],
    sinergy: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    members: [String],
    estimatedTime: {
        type: Number,
        required: true
    },
    completionTime: Number,
    deadline: Date,
    attachment: String
});

module.exports = mongoose.model('Mission', missionSchema);
