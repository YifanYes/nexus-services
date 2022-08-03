const prisma = require('../config/database');
const math = require('../utils/math.utils');
const bcryptjs = require('bcryptjs');

const findCharacterByEmail = (email) => {
    return prisma.character.findUnique({
        where: {
            email
        }
    });
};

const findCharacterById = (id) => {
    return prisma.character.findUnique({
        where: {
            id
        }
    });
};

const findCharacterByUsername = (username) => {
    return prisma.character.findUnique({
        where: {
            username
        }
    });
};

const createCharacter = (username, email, password, role) => {
    // Create character object and save in database
    return prisma.character.create({
        data: {
            username: username,
            email: email.toLowerCase(),
            password: bcryptjs.hashSync(password, 10), // Hashing password for security
            role: role
        }
    });
};

const updateAttributesAfterAssignMission = async (mission, characterId) => {
    // Create mission relationhip with character
    await prisma.missionsOnCharacters.create({
        data: {
            characterId: characterId,
            missionId: missionId
        }
    });

    // Get character data
    let character = await findCharacterById(characterId);

    // Check if character exists in database
    if (!character) return res.status(400).json({ message: "This character doesn't exist" });

    // Update character's attributes after assigning mission
    let updateStress = math.round2Fixed(
        character.stress + (character.resistance + mission.sinergy) / 2 + 2 * mission.stress
    );

    let updatePerformance = math.round2Fixed(character.performance + mission.sinergy / 3);

    // Update character field after calculations
    await prisma.character.update({
        where: {
            id: characterId
        },
        data: {
            stress: updateStress,
            performance: updatePerformance
        }
    });
};

const updateAttributesAfterCompleteMission = async (updatedMission, characterId) => {
    let character = await prisma.character.findUnique({
        where: {
            id: characterId
        }
    });

    // Check if character exists in database
    if (!character) return res.status(400).json({ message: "This character doesn't exist" });

    // Update attributes after completing a mission
    let updatedHp = character.hp + Math.abs(updatedMission.stress) + updatedMission.difficulty / 4;
    let updatedStress = character.stress + updatedMission.difficulty / 3;
    let updatedExperience =
        character.experience +
        (Math.abs(updatedMission.stress) + updatedMissio.difficulty) * 2 -
        (updatedMissio.completionTime - updatedMissio.estimatedTime) * 5;
    let updatedPerformance =
        character.performance + updatedMission.estimatedTime - updatedMission.completionTime + 1;

    // Save attributes in database
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
};

// Character ordered by level list for mission assigning valuation
const orderCharactersByLevel = async () => {
    return await prisma.character.findMany({
        orderBy: [{ level: 'desc' }]
    });
};

module.exports = {
    findCharacterByEmail,
    findCharacterById,
    findCharacterByUsername,
    createCharacter,
    updateAttributesAfterAssignMission,
    updateAttributesAfterCompleteMission,
    orderCharactersByLevel
};
