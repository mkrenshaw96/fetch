const router = require('express').Router(),
    Auth = require('../middleware/auth'),
    Post = require('../db').import('../models/post'),
    User = require('../db').import('../models/user'),
    Like = require('../db').import('../models/likes');
router.get('/', (req, res) => res.send('THIS IS A TEST LIKE ROUTE'))
//LIKE A POST
router.post('/', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            Post.findOne({
                where: {
                    id: 6
                }
            })
                .then(foundPost => {
                    foundPost.createLike({
                        userId: foundUser.id
                    })
                        .then(createdLike => res.status(200).json({ 'LIKE CREATED': createdLike }))
                        .catch(err => res.status(500).json(err))
                })
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
//GET ALL LIKES FROM A POST
router.get('/all-from-post', Auth, (req, res) => {
    Post.findOne({
        where: {
            id: 4
        }
    })
        .then(foundPost => {
            Like.findAll({
                where: {
                    postId: foundPost.id
                }
            })
                .then(foundLikes => res.status(200).json(foundLikes))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
module.exports = router;