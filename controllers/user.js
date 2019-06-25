const router = require("express").Router();
const Models = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../middleware/auth');
const Following = require('../models/following')
router.get('/all', Auth, (req, res) => {
    Models.User.findAll()
        .then(foundUsers => res.status(200).json({ foundUsers }))
        .catch(err => console.log(err))
})
router.post('/signup', (req, res) => {
    Models.User.create({
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        email: req.body.user.email,
        username: req.body.user.username,
        password: bcrypt.hashSync(req.body.user.password, 10),
        mediaCount: 0,
        followersCount: 0,
        followingCount: 0
    })
        .then(createdUser => {
            createdUser.createFollowing({
                followingUserId: createdUser.id
            })
                .then(created => {
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
                .catch(err => res.status(500).json(err))
            })
        })
        .catch(err => res.status(500).json({ 'ERROR CREATING USER': err }))
})
router.post('/login', (req, res) => {
    Models.User.findOne({
        where: {
            username: req.body.user.username
        }
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
                    res.status(401).json({ error: err, message: 'PASSWORDS DO NOT MATCH' })
                }
            })
        })
        .catch(err => res.status(404).json({ error: err, message: 'USERNAME IS NOT FOUND' }))
})
router.put('/update/:id', Auth, (req, res) => {
    Models.User.update(req.body, {
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
    Models.User.findOne({
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
router.get('/find/:id', Auth, (req, res) => {
    Models.User.findAll({
        where: {
            id: [req.params.id]
        }
    })
        .then(foundUser => res.status(200).json(foundUser))
        .catch(err => res.status(500).json(err))
})
module.exports = router;