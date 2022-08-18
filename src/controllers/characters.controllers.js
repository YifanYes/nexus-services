require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const {
    findCharacterByEmail,
    findCharacterById,
    findCharacterByUsername,
    createCharacter
} = require('../services/character.services');
const { toJson } = require('../utils/math.utils');
const { generateToken, verifyToken } = require('../services/auth.services');

const characterRegister = async (req, res, next) => {
    const { username, email, password, role } = req.body;

    // Check if all data is passed from client
    if (!(username && email && password)) {
        return res.status(400).send('Missing fields');
    }

    // Check if character already exists
    const existingCharacter = await findCharacterByEmail(email);

    if (existingCharacter) return res.status(400).json({ message: 'Character already exists' });

    // Create character object
    const newCharacter = toJson(await createCharacter(username, email, password, role));
    const token = generateToken(newCharacter);

    // Return auth token
    if (newCharacter) {
        return res.status(201).json({
            message: 'Character created successfully',
            id: newCharacter.id,
            token: token
        });
    }
    return res.status(500).json({ message: 'Something went wrong' });
};

const characterLogin = async (req, res, next) => {
    let { username, password } = req.body;

    // Check if all data is passed from client
    if (!(username && password)) return res.status(401).send('Fields missing');

    // Look for character in database
    let character = toJson(await findCharacterByUsername(username));

    if (!character) return res.status(401).send("This character doesn't exists");

    // Check password hash matches
    if (character && bcryptjs.compareSync(password, character.password)) {
        const token = generateToken(character);

        return res.status(200).json({
            message: 'Authentification successful',
            token: token
        });
    }

    return res.status(400).send('Invalid credentials');
};

// Asign a class to the character for attribute modifyers
const assignClass = async (req, res) => {
    await prisma.character.update({
        where: {
            id: req.params.charaterId
        },
        data: {
            characterClass: req.body.characterClass
        }
    });

    return res.status(200).json({ message: 'Class assigned successfully' });
};

// Assign a character to a guild
const assignGuild = async (req, res) => {
    const characterId = req.params.characterId;

    await prisma.charactersOnGuilds.create({
        characterId: characterId,
        guildId: guildId
    });

    return res.status(201).json({ message: 'Welcome to the guild!' });
};

// Get a single character info
const getCharacter = async (req, res) => {
    const id = BigInt(req.params.characterId);
    const character = await findCharacterById(id);

    if (!character)
        return res.status(404).json({
            message: 'This character doesnt exists'
        });

    return res.status(200).json({ data: toJson(character) });
};

// Get a list of all characters in database
const getAllCharacters = async (req, res) => {
    const characterList = await prisma.character.findMany({});
    return res.status(200).json({ data: toJson(characterList) });
};

const editCharacter = async (req, res) => {
    const { stress, performance, resistance } = req.body;
};

module.exports = {
    characterRegister,
    characterLogin,
    assignClass,
    assignGuild,
    getCharacter,
    getAllCharacters,
    editCharacter
};
