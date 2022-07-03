require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Character = require('../models/character');

const characterRegister = async (req, res, next) => {
    let { username, email, password, role } = req.body;

    // Check if all data is passed from client
    if (!(username && email && password && role)) {
        res.status(400).send("Missing fields");
    };

    // Check if character already exists
    let existingCharacter = await Character.find({ email });
    if (existingCharacter) return res.status(409).send("Email already exists");

    // TODO: Why there are duplicates ?

    // Instantiate character model
    const character = await new Character({
        username,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10), // Hashing password for security
        role
    });

    // Saving character in database and return auth token
    character.save((error, characterDB) => {
        if (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error
            });
        }

        let token = jwt.sign({
            character: characterDB,
        }, process.env.SEED_AUTH, {
            expiresIn: process.env.TOKEN_EXPIRY
        });

        return res.status(201).json({
            message: "Character created successfully",
            character: characterDB,
            token: token
        })
    })
}

const characterLogin = async (req, res, next) => {
    let { username, password } = req.body;

    // Check if all data is passed from client
    if (!(username && password)) return res.status(401).send("Fields missing");

    // Look for character in database
    let character = await Character.findOne({ username });
    if (!character) return res.status(401).send("This character doesn't exists");

    // Check password hash matches
    if (character && bcrypt.compare(password, character.password)) {
        let token = jwt.sign({
            character: characterDB,
        }, process.env.SEED_AUTH, {
            expiresIn: process.env.TOKEN_EXPIRY
        });

        res.status(200).json({
            character,
            token
        })
    }

    res.status(400).send("Invalid credentials")
}

const getMe = async (req, res) => {
    const characterId = req.user.userId
    const character = await Character.findById(characterId)
    if (character) return res.status(200).json(character);

    return res.status(404).json({ message: 'User not found' });
}

module.exports = {
    getMe,
    characterRegister,
    characterLogin,
}