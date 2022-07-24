require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const characterRegister = async (req, res, next) => {
    const { username, email, password, role, characterClass } = req.body;

    // Check if all data is passed from client
    if (!(username && email && password && role && characterClass)) {
        return res.status(400).send('Missing fields');
    }

    // Check if character already exists
    let existingCharacter = await prisma.character.findUnique({
        where: {
            email: email
        }
    });
    if (existingCharacter.length) return res.status(409).send('Email already exists');

    // Create character object
    const newCharacter = {
        username: username,
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password, 10), // Hashing password for security
        role: role,
        characterClass: characterClass
    };

    // Saving character in database
    const createdCharacter = await prisma.character.create({
        data: newCharacter
    });

    // Return auth token
    if (createdCharacter) {
        let token = jwt.sign(
            {
                createdCharacter
            },
            process.env.SEED_AUTH,
            {
                expiresIn: process.env.TOKEN_EXPIRY
            }
        );

        return res.status(201).json({
            message: 'Character created successfully',
            token: token
        });
    }
};

const characterLogin = async (req, res, next) => {
    let { username, password } = req.body;

    // Check if all data is passed from client
    if (!(username && password)) return res.status(401).send('Fields missing');

    // Look for character in database
    let character = await prisma.character.findUnique({
        where: {
            username: username
        }
    });
    if (!character) return res.status(401).send("This character doesn't exists");

    // Check password hash matches
    if (character && bcryptjs.compareSync(password, character.password)) {
        let token = jwt.sign(
            {
                character
            },
            process.env.SEED_AUTH,
            {
                expiresIn: process.env.TOKEN_EXPIRY
            }
        );

        return res.status(200).json({
            message: 'Authentification successful',
            token
        });
    }

    return res.status(400).send('Invalid credentials');
};

// Get a single character info
const getCharacter = async (req, res) => {
    const character = await prisma.findUnique({
        where: {
            id: req.params.charaterId
        }
    });

    return res.status(200).json({ data: character });
};

const editCharacter = async (req, res) => {
    const { stress, performance, resistance } = req.body;
};

module.exports = {
    characterRegister,
    characterLogin,
    getCharacter,
    editCharacter
};
