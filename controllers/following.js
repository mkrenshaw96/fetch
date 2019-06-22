const router = require('express').Router(),
    Auth = require('../middleware/auth');
const Models = require('../models/models');
const Following = require('../db').import('../models/following');
const User = require('../db').import('../models/user');
const Post = require('../db').import('../models/post');
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
//FOLLOW ANOTHER USER THROUGH URL PARARM
router.post('/refollow/:id', Auth, (req, res) => {
    Models.User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            foundUser.createFollowing({
                followingUserId: req.params.id
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
//GET USERS IM FOLLOWING THROUGH URL PARAM
router.get('/profile/im-following/:id', Auth, (req, res) => {
    Following.findAll({
        where: {
            userId: req.params.id
        }
    })
        .then(foundFollowing => {
            const keyIds = foundFollowing.map((keys) => {
                return keys.followingUserId
            })
            User.findAll({
                where: {
                    id: keyIds
                }
            })
                .then(found => res.status(200).json(found))
        })
        .catch(err => res.status(500).json(err))
})
//GET MY FOLLOWERS
router.get('/following-me', Auth, (req, res) => {
    Following.findAll({
        where: {
            followingUserId: req.user.id
        }, include: {
            model: User
        }
    })
        .then(foundFollowers => {
            res.status(200).json(foundFollowers)
        })
        .catch(err => res.status(500).json(err))
})
//GET MY FOLLOWERS THROUGH URL PARAM
router.get('/profile/following-me/:id', Auth, (req, res) => {
    Following.findAll({
        where: {
            followingUserId: req.params.id
        }, include: { model: User }
    })
        .then(foundFollowing => {
            res.status(200).json(foundFollowing)
        })
        .catch(err => res.status(500).json(err))
})
//UNFOLLOW A USE THROUGH URL PARAM
router.delete('/unfollow/:id', Auth, (req, res) => {
    Following.findOne({
        where: {
            userId: req.user.id,
            followingUserId: req.params.id
        }
    })
        .then(found => found.destroy())
        .then(() => res.status(200).json({ 'MESSAGE': 'USER UNFOLLOWED' }))
        .catch(err => res.status(500).json(err))
        .catch(err => res.status(500).json(err))
})
module.exports = router;