require('dotenv').config();
const prisma = require('../config/database');
const math = require('../utils/math.utils');

const addNewMission = async (req, res) => {
    //TODO: validar los datos

    // Create mission object from request and save it to the database
    const mission = await prisma.mission.create({
        data: {
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
        }
    });

    // Create relationhip with members and update each character's attributes
    for (let id of mission.members) {
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
            character.stress +
            (character.resistance + mission.sinergy) / 2 +
            2 * mission.stress
        );

        // TODO: el performance sale como NaN
        let updatePerformance = math.round2Fixed(
            character.performance + mission.sinergy / 3
        );

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

    return res.status(201).json({ data: mission });
};

const finishMission = async (req, res) => {
    let mission = await prisma.mission.findUnique({
        where: {
            id: req.body.id
        }
    });

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
