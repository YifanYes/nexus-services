const nodeCron = require('node-cron');
const Character = require('../models/character');
const math = require('../utils/math.utils');

const updateAttributes = async () => {
    // Get all characters list
    let characterList = await Character.find();

    // Update each character document as the methodology guidelines
    for (let character of characterList) {
        character.hp +=
            character.stress + 5 * character.weekendDays + 7 * daysOffWork;

        // When the character's health point goes to zero or below, its state changes to dead
        if (character.hp <= 0) character.isAlive = false;

        // Sustained levels of stress modify how many missions can be assigned to a character
        // Number of misions must be an integer without decimals
        character.maximumMissionNumber += Math.ceil(
            (character.stress + character.resistance) / 4
        );

        // Maximum mission number must be zero or greater
        if (character.maximumMissionNumber < 0)
            character.maximumMissionNumber = 0;

        // Stress also affects performance, rounded to two decimal points
        character.performance += math.round2Fixed(character.stress / 8);
        await character.save();
    }
};

// Execute this task every sunday at 00:00 to update character attributes
const job = nodeCron.schedule('0 0 0 * * 7', updateAttributes);
