require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Character = require('../models/character');

const characterRegister = (req, res, next) => {

    // Check if character already exists
    Character.find({ email: req.body.email }, (error, characterDB) => {
        if (characterDB) return res.status(401).json({ message: "Email already exists" })
    });

    // Instantiate character model
    const character = new Character({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.name,
        email: req.body.email,
        password: bcrypt.hash(req.body.password, 10), // Hashing password for security
        role: req.body.role
    });

    // Saving character in database
    character.save((error, characterDB) => {
        if (error) return res.status(00).json({ message: "Internal server error" });

        return res.status(201).json({
            message: "Character created successfully",
            character: characterDB
        })
    })
}

const characterLogin = (req, res, next) => {
    Character.find({ email: req.body.email }, (error, characterDB) => {
        if (error) return res.status(500).json({ message: "Internal server error" });

        // Verify that emails exists in the database
        if (!characterDB) return res.status(400).json({ message: "Incorrect email" });

        // Verify password
        if (!bcrypt.compare(req.body.password, characterDB._password)) {
            return res.status(400).json({ message: "Incorrect password" })
        }

        // Generate auth token and send to client
        let token = jwt.sign({
            character: characterDB,
        }, process.env.SEED_AUTH, {
            expiresIn: process.env.TOKEN_EXPIRY
        });

        return res.json({
            character: characterDB,
            token: token
        });
    })
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