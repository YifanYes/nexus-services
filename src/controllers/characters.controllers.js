require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Character = require('../models/character');

const characterRegister = (req, res, next) => {
    Character.find({ email: req.body.email })
        .exec()
        .then((character) => {
            if (character.length >= 1) return res.status(409).json({ message: "Email already exists" });

            // Hasing user password for security
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) return res.status(500).json({ error: err, });

                const character = new Character({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash,
                    username: req.body.name,
                });

                character
                    .save()
                    .then(async (result) => {
                        await result
                            .save()
                            .then((result1) => {
                                console.log(`User created ${result}`)
                                res.status(201).json({
                                    userDetails: {
                                        userId: result._id,
                                        email: result.email,
                                        name: result.name,
                                    },
                                })
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(400).json({ message: err.toString() });
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({ message: err.toString() });
                    });
            });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ message: err.toString() });
        });
}


const characterLogin = (req, res, next) => {
    Character.find({ email: req.body.email })
        .exec()
        .then((character) => {
            console.log(character);
            if (character.length < 1) return res.status(401).json({ message: "Auth failed: Email not found probably" });

            bcrypt.compare(req.body.password, character[0].password, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(401).json({ message: "Auth failed" });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            _id: character[0]._id,
                            email: character[0].email,
                            username: character[0].username,
                        },
                        process.env.jwtSecret,
                        {
                            expiresIn: "1d",
                        }
                    );
                    console.log(character[0]);
                    return res.status(200).json({
                        message: "Auth successful",
                        characterDetails: {
                            userId: character[0]._id,
                            username: character[0].name,
                            email: character[0].email,
                        },
                        token: token,
                    });
                }
                res.status(401).json({
                    message: "Auth failed1",
                });
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
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