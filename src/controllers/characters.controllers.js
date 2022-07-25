require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const generateToken = require();
const tokenCaching = require('../middlewares/tokenCaching.middleware');

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
        const resultAccess = await generateToken(createdCharacter, 1);
        const resultRefresh = await generateToken(createdCharacter, 2);
        const refreshSecret = process.env.JWT_REFRESH_SECRET;

        const resultCaching = await tokenCaching.setCache(accessToken); // Cache the valid token
        if (!resultCaching.result) {
            const error = new Error();
            error.message = resultCaching.message;
            throw error;
        }

        // If token is not valid, it throws an error
        await jwt.verify(resultRefresh.token, refreshSecret);

        return res
            .status(201)
            .cookie('accessToken', resultAccess.token, resultAccess.cookie)
            .cookie('refreshToken', resultRefresh.token, resultRefresh.cookie)
            .json({
                message: 'Character created successfully',
                token: resultAccess.token
            });
    }

    return res.status(500).json({ message: 'Something went wrong' });
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

const signOut = async (req, res) => {
    try {
        res.status(200).clearCookie('accessToken').clearCookie('refreshToken').json({
            message: 'Signed out'
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
    }
};

module.exports = {
    characterRegister,
    characterLogin,
    getCharacter,
    editCharacter,
    signOut
};
