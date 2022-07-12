require('dotenv').config();
const Mission = require('../models/mission');
const Character = require('../models/character');

const addNewMission = async (req, res) => {
    const mission = new Mission({
        title: req.body.title,
        description: req.body.description,
        difficulty: req.body.difficulty,
        stress: req.body.stress,
        requirements: req.body.requirements,
        sinergy: req.body.sinergy,
        members: req.body.members,
        estimatedTime: req.body.estimatedTime,
        deadline: req.body.deadline,
        attachment: req.body.attachment
    });

    // After assigning a mission, update each character attributes
    for (let id of mission.members) {
        let character = Character.findById({ id });

        character.stress +=
            (character.resistance + mission.sinergy) / 2 + 2 * mission.stress;
        character.performance += mission.sinergy / 3;

        await character.save();
    }

    mission.save((error) => {
        if (error)
            return res.status(500).json({ error: 'Internal server error' });

        return res.status(201).json(mission);
    });
};

module.exports = {
    addNewMission
};
