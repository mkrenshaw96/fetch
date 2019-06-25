const router = require('express').Router();
const Auth = require('../middleware/auth');
const User = require('../db').import('../models/user');
const Follow = require('../db').import('../models/following');
const Post = require('../db').import('../models/post');
router.get('/mine', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            Follow.findAll({
                where: {
                    userId: foundUser.id
                }
            })
                .then(foundFollowing => {
                    const keyIds = foundFollowing.map((keys) => {
                        return keys.followingUserId
                    })
                    Post.findAll({
                        where: {
                            userId: keyIds
                        },
                        order: [
                            ['createdAt', 'DESC']
                        ]
                    })
                        .then(foundPosts => res.status(200).json(foundPosts))
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})
module.exports = router;