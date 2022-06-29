const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const validRoles = {
    values: ["ROOT", "ADMIN", "USER"],
    message: "You don't have the permission to execute this action"
}

const characterSchema = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        lowecase: true,
        required: [true, "Email is required"]
    },
    _password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: 'USER',
        required: [true],
        enum: validRoles
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
        min: 1,
        max: 10
    },
    performance: {
        type: Number,
        min: -20,
        max: 20
    },
    trust: {
        type: Number,
        min: 0,
        max: 10
    },
    teams: [String],
    missions: [String],
});

// Delete password key from object when returning character
characterSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject._password;

    return userObject;
}

characterSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});

module.exports = mongoose.model('Character', characterSchema);