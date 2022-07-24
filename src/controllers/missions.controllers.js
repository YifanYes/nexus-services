require('dotenv').config();
const prisma = require('../config/database');
const math = require('../utils/math.utils');

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
        members,
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

    // Create relationhip with members and update each character's attributes
    for (let id of members) {
        await prisma.missionsOnCharacters.create({
            data: {
                characterId: id,
                missionId: mission.id
            }
        });

        // Get character data
        let character = await prisma.findUnique({
            where: {
                id: id
            }
        });

        let updateStress = math.round2Fixed(
            character.stress + (character.resistance + mission.sinergy) / 2 + 2 * mission.stress
        );

        let updatePerformance = math.round2Fixed(character.performance + mission.sinergy / 3);

        await prisma.character.update({
            where: {
                id: id
            },
            data: {
                stress: updateStress,
                performance: updatePerformance
            }
        });
    }

    return res.status(201).json({
        message: "Successfully created mission and updated members' atributes",
        data: mission
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

    // Get mission data
    let updatedMission = await prisma.mission.findUnique({
        where: {
            id: req.params.missionId
        }
    });

    // Updating each member's attributes
    for (let characterId of members) {
        let character = await prisma.character.findUnique({
            where: {
                id: characterId
            }
        });

        let updatedHp =
            character.hp + Math.abs(updatedMission.stress) + updatedMission.difficulty / 4;
        let updatedStress = character.stress + updatedMission.difficulty / 3;
        let updatedExperience =
            character.experience +
            (Math.abs(updatedMission.stress) + updatedMissio.difficulty) * 2 -
            (updatedMissio.completionTime - updatedMissio.estimatedTime) * 5;
        let updatedPerformance =
            character.performance +
            updatedMission.estimatedTime -
            updatedMission.completionTime +
            1;

        await prisma.character.update({
            where: {
                id: characterId
            },
            data: {
                hp: updatedHp,
                stress: updatedStress,
                experience: updatedExperience,
                performance: updatedPerformance
            }
        });

        // TODO: When completing 5 missions in a row, add 2 points to performance
    }

    return res.status(200).json({ message: 'Mission complete! Characters updated successfully' });
};

module.exports = {
    getMission,
    addNewMission,
    finishMission
};
