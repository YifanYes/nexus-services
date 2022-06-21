const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    completed: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    members: Array,
    deadline: Date,
    attatchment: String,
});

module.exports = mongoose.model('Mission', missionSchema);