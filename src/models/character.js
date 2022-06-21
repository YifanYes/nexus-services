const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    active: {
        type: Boolean,
        default: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    _password: {
        type: String,
        required: true
    },
    googleId: String,
    githubId: String,
    profilePhoto: String,
    hp: {
        type: Number,
        default: 50
    },
    maxHp: {
        type: Number,
        default: 50
    },
    exp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    knowledge: {
        type: Number,
        default: 0
    },
    stress: {
        type: Number,
        default: 0
    },
    maximumTaskNumber: Number,
    currentTaskNumber: {
        type: Number,
        default: 0
    },
    resistance: {
        type: Number,
        required: true
    },
    performance: {
        type: Number,
        required: true
    },
    trust: {
        type: Number,
        required: true
    },
    teams: Array,
    missions: Array,
});

module.exports = mongoose.model('Character', characterSchema);