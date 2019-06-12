const router = require("express").Router();
const User = require('../db').import('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../middleware/auth');
router.get('/', Auth, (req, res) => {
    User.findAll()
        .then(foundUsers => res.status(200).json({
            "ALL USERS": {
                foundUsers
            }
        }))
        .catch(err => console.log(err))
})
// router.get('/', (req, res) => res.send('THIS IS WORKING'));
router.post('/signup', (req, res) => {

    User.create({
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        email: req.body.user.lastname,
        username: req.body.user.username,
        password: bcrypt.hashSync(req.body.user.password, 10)
    })
        .then(createdUser => {
            if (!createdUser) {
                console.log('user not created')
            }
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
router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.user.username
    })
        .then(foundUser => {
            bcrypt.compare(req.body.user.password, foundUser.password, (err, match) => {
                if (match) {
                    let token = jwt.sign({
                        id: foundUser.id
                    }, process.env.JWT_SECRET, {
                            expiresIn: 60 * 60 * 24
                        })
                    res.status(200).json({
                        user: foundUser,
                        message: 'USER SUCCESSFULLY LOGGED IN',
                        sessionToken: token
                    })
                } else {
                    res.status(500).json({ error: err })
                }
            })
        })
        .catch(err => res.status(500).json({ error: err }))
})
router.put('/update/:id', Auth, (req, res) => {
    User.update(req.body, {
        where: {
            id: req.params.id
        },
        returning: true
    })
        .then(updatedUser => {
            res.status(200).json({
                message: 'USER INFORMATION HAS BEEN UPDATED',
                user: {
                    updatedUser
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
})
router.delete('/delete/:id', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(found => found.destroy())
        .then(() => res.status(200).json({
            message: 'USER HAS BEEN DELETED FROM DATABASE'
        }))
        .catch(err => {
            throw err
        })
})
module.exports = router;