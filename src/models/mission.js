const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const missionSchema = new Schema({
    _id: Schema.Types.ObjectId,
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
    members: Array,
    estimatedTime: {
        type: Number,
        required: true,
    },
    completionTime: Number,
    deadline: Date,
    attatchment: String,
});

module.exports = mongoose.model('Mission', missionSchema);