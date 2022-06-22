const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    _id: Schema.Types.ObjectId,
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
        lowecase: true,
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
        default: 50,
        min: 0,
    },
    maxHp: {
        type: Number,
        default: 50
    },
    exp: {
        type: Number,
        default: 0,
        min: 0,
    },
    level: {
        type: Number,
        default: 0,
        min: 0,
    },
    knowledge: {
        type: Number,
        default: 0,
        min: 0,
    },
    stress: {
        type: Number,
        default: 0,
        min: -20,
        max: 20
    },
    maximumTaskNumber: {
        type: Number,
        min: 0,
    },
    currentTaskNumber: {
        type: Number,
        default: 0,
        min: 0
    },
    resistance: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    performance: {
        type: Number,
        required: true,
        min: -20,
        max: 20
    },
    trust: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    teams: [String],
    missions: [String],
});

module.exports = mongoose.model('Character', characterSchema);