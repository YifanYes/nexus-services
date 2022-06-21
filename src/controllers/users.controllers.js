require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userRegister = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length >= 1) return res.status(409).json({ message: "Email already exists" });

            // Hasing user password for security
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) return res.status(500).json({ error: err, });

                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash,
                    name: req.body.name,
                });

                user
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


const userLogin = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            console.log(user)
            if (user.length < 1) return res.status(401).json({ message: "Auth failed: Email not found probably" });

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(401).json({ message: "Auth failed" });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            userId: user[0]._id,
                            email: user[0].email,
                            name: user[0].name,
                        },
                        process.env.jwtSecret,
                        {
                            expiresIn: "1d",
                        }
                    );
                    console.log(user[0])
                    return res.status(200).json({
                        message: "Auth successful",
                        userDetails: {
                            userId: user[0]._id,
                            name: user[0].name,
                            email: user[0].email,
                            phone_number: user[0].phone_number,
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
    const userId = req.user.userId
    const user = await User.findById(userId)
    if (user) return res.status(200).json(user);

    return res.status(404).json({ message: 'User not found' });
}

module.exports = {
    getMe,
    userLogin,
    userRegister
}