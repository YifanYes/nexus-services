require('dotenv').config();
const Mission = require('../models/mission');

const addNewMission = (req, res) => {
    const mission = new Mission({
        title: req.body.title,
        description: req.body.description,
        difficulty: req.body.difficulty,
        requirements: req.body.requirements,
        members: req.body.members,
        estimatedTime: req.body.estimatedTime,
        deadline: req.body.deadline,
        attachment: req.body.attachment
    });

    mission.save((error) => {
        if (error)
            return res.status(500).json({ error: 'Internal server error' });

        return res.status(201).json(mission);
    });
};

module.exports = {
    addNewMission
};
