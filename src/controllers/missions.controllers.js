require('dotenv').config();
const math = require('../utils/math.utils');

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
        Character.findById(id, (error, character) => {
            if (error) return handleError(error);

            character.stress = math.round2Fixed(
                character.stress +
                (character.resistance + mission.sinergy) / 2 +
                2 * mission.stress
            );

            // TODO: el performance sale como NaN
            character.performance = math.round2Fixed(
                character.performance + mission.sinergy / 3
            );

            character.save();
        });
    }

    mission.save((error) => {
        if (error)
            return res.status(500).json({ error: 'Internal server error' });

        return res.status(201).json({ data: mission });
    });
};

const finishMission = async (req, res) => {
    let mission = await Mission.findById({ id: req.body.id });

    // Marking mission as completed and registering completion time
    mission.completed = true;
    mission.completionTime = req.body.completionTime;

    await mission.save();

    // Updating each character's attribute after successfully finishing a mission
    for (let characterId of mission.members) {
        let character = await Character.findById({ characterId });

        character.hp += Math.abs(mission.stress) + mission.difficulty / 4;
        character.stress += mission.difficulty / 3;
        character.exp +=
            (Math.abs(mission.stress) + mission.difficulty) * 2 -
            (mission.completionTime - mission.estimatedTime) * 5;
        character.performance +=
            mission.estimatedTime - mission.completionTime + 1;

        await character.save();
        // TODO: When completing 5 missions in a row, add 2 points to performance
    }
};

module.exports = {
    addNewMission,
    finishMission
};
