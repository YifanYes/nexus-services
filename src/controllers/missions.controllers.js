require('dotenv').config();
const prisma = require('../config/database');
const {
    updateAttributesAfterAssignMission,
    updateAttributesAfterCompleteMission
} = require('../services/character.services');

const getMission = async (req, res) => {
    const mission = await prisma.findUnique({
        where: {
            id: req.params.missionId
        }
    });

    return res.status(200).json({ data: mission });
};

const addNewMission = async (req, res) => {
    const {
        title,
        description,
        orderInColumn,
        difficulty,
        stress,
        requirements,
        sinergy,
        estimatedTime,
        deadline
    } = req.body;

    // Create mission object from request and save it to the database
    const mission = await prisma.mission.create({
        data: {
            title: title,
            description: description,
            orderInColumn: orderInColumn,
            difficulty: difficulty,
            stress: stress,
            requirements: requirements,
            sinergy: sinergy,
            estimatedTime: estimatedTime,
            deadline: deadline,
            attachment: attachment
        }
    });

    return res.status(201).json({
        message: 'Successfully created mission',
        data: mission
    });
};

const assignMission = async (req, res) => {
    const { members } = req.body;

    // Get mission data
    let mission = await prisma.mission.findUnique({
        where: {
            id: req.params.missionId
        }
    });

    // Check if mission exists in database
    if (!mission) return res.status(400).json({ message: "This mission doesn't exist" });

    // Create relationhip with members and update each character's attributes
    for (let id of members) {
        updateAttributesAfterAssignMission(mission, id);
    }

    return res.status(200).json({
        message: 'Successfully updated members attributes'
    });
};

const finishMission = async (req, res) => {
    const { completionTime } = req.body.completionTime;

    if (!completionTime)
        return res
            .status(401)
            .json({ message: 'You must declare the completion time of this mission' });

    // Updation mission as completed and registering completion time
    let mission = await prisma.mission.update({
        where: {
            id: req.params.missionId
        },
        data: {
            completed: true,
            completionTime: completionTime
        }
    });

    if (!mission) return res.status(404).json({ message: "This mission doesn't exist" });

    // Get list of mission's members
    let members = await prisma.missionsOnCharacters.findMany({
        where: {
            missionId: req.params.missionId
        }
    });

    // Updating each member's attributes
    for (let characterId of members) {
        updateAttributesAfterCompleteMission(mission, characterId);
        // TODO: When completing 5 missions in a row, add 2 points to performance
    }

    return res
        .status(200)
        .json({ message: 'Mission complete! Characters attributes updated successfully' });
};

module.exports = {
    getMission,
    addNewMission,
    assignMission,
    finishMission
};
