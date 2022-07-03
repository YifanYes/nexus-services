require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Character = require('../models/character');

const characterRegister = async (req, res, next) => {
    let { username, email, password, role } = req.body;

    // Check if all data is passed from client
    if (!(username && email && password && role)) {
        return res.status(400).send("Missing fields");
    };

    // Check if character already exists
    let existingCharacter = await Character.find({ email });
    if (existingCharacter.length) return res.status(409).send("Email already exists");

    // Instantiate character model
    const character = await new Character({
        username,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10), // Hashing password for security
        role
    });

    // Saving character in database and return auth token
    character.save((error, character) => {
        if (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error
            });
        }

        let token = jwt.sign({
            character,
        }, process.env.SEED_AUTH, {
            expiresIn: process.env.TOKEN_EXPIRY
        });

        return res.status(201).json({
            message: "Character created successfully",
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
    if (character && bcrypt.compareSync(password, character.password)) {
        let token = jwt.sign({
            character,
        }, process.env.SEED_AUTH, {
            expiresIn: process.env.TOKEN_EXPIRY
        });

        return res.status(200).json({
            message: "Authentification successful",
            token
        })
    }

    return res.status(400).send("Invalid credentials")
}

module.exports = {
    characterRegister,
    characterLogin,
}