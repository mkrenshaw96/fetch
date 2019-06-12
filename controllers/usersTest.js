const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user-model');

router.post('/signup', (req, res) => {
    User.create({
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        email: req.body.user.lastname,
        username: req.body.user.username,
        password: bcrypt.hashSync(req.body.user.password, 30)
    })
        .then(createdUser => {
            console.log(createdUser)
            let token = jwt.sign({
                id: createdUser.id
            }, process.env.JWT_SECRET, {
                    expiresIn: 60 * 60 * 24
                })
            res.status(200).json({
                user: createdUser,
                message: 'USER SUCCESSFULLY CREATED',
                sessionToken: token
            })
        })
        .catch(err => res.status(500).json({ error: err }))
        .catch(err => console.log(err))
})

module.exports = router;