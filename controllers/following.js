const router = require('express').Router(),
    Auth = require('../middleware/auth');
const Models = require('../models/models');
const Following = require('../db').import('../models/following');
const User = require('../db').import('../models/user');
//FOLLOW ANOTHER USER
router.post('/', Auth, (req, res) => {
    Models.User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            foundUser.createFollowing({
                followingUserId: req.body.followingUserId
            })
                .then(created => res.status(200).json(created))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
//FOLLOW YOURSELF WHEN INITIAL PROFILE CREATION
router.post('/follow-myself', Auth, (req, res) => {
    Models.User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            foundUser.createFollowing({
                followingUserId: foundUser.id
            })
                .then(created => res.status(200).json(created))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
//GET USERS IM FOLLOWING
router.get('/im-following', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            Following.findAll({
                where: {
                    userId: foundUser.id
                }
            })
                .then(foundFollowing => res.status(200).json(foundFollowing))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
//GET MY FOLLOWERS
router.get('/following-me', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            Following.findAll({
                where: {
                    followingUserId: foundUser.id
                }
            })
                .then(foundFollowers => res.status(200).json(foundFollowers))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
module.exports = router;