const Character = require('../models/character');

const orderCharactersByLevel = async () => {
    return await Character.find({}).sort({ level: -1 });
};

module.exports = {
    orderCharactersByLevel
};