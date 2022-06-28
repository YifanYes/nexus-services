const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const missionSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
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
    requirements: [String],
    members: [String],
    estimatedTime: {
        type: Number,
        required: true,
    },
    completionTime: Number,
    deadline: Date,
    attachment: String,
});

module.exports = mongoose.model('Mission', missionSchema);