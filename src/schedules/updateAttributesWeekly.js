const prisma = require('../config/database');
const cron = require('node-cron');
const math = require('../utils/math.utils');

const updateAttributesWeekly = async () => {
    // Get all characters list
    let characterList = await prisma.character.findMany();

    // Update each character document as the methodology guidelines
    for (let character of characterList) {
        let alive = true;

        // Sustained levels of stress modify how many missions can be assigned to a character
        let updatedHp =
            character.hp + character.stress + 5 * character.weekendDays + 7 * character.daysOffWork;

        // When the character's health point goes to zero or below, its state changes to dead
        if (updatedHp <= 0) alive = false;

        // Number of misions must be an integer without decimals
        let newMaximumMissionNumber =
            character.maximumMissionNumber +
            Math.ceil((character.stress + character.resistance) / 4);

        // Maximum mission number must be zero or greater
        if (newMaximumMissionNumber < 0) newMaximumMissionNumber = 0;

        // Stress also affects performance, rounded to two decimal points
        let updatedPerformance = character.performance + math.round2Fixed(character.stress / 8);

        await prisma.character.update({
            where: {
                id: character.id
            },
            data: {
                hp: updatedHp,
                maximumMissionNumber: newMaximumMissionNumber,
                isAlive: alive,
                performance: updatedPerformance
            }
        });
    }
};

// Execute this task every sunday at 00:00 to update character attributes
module.exports = () => {
    cron.schedule('0 0 * * Sun', updateAttributesWeekly);
};
