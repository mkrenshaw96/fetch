const router = require('express').Router(),
    Auth = require('../middleware/auth'),
    Post = require('../db').import('../models/post'),
    User = require('../db').import('../models/user'),
    Comment = require('../db').import('../models/comments');
//ADD A COMMENT TO A POST
router.post('/post/:post', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            Post.findOne({
                where: {
                    id: req.params.post
                }
            })
                .then(foundPost => {
                    foundPost.createComment({
                        text: req.body.text,
                        commentLikes: 0,
                        userId: foundUser.id
                    })
                        .then(createdComment => res.status(200).json(createdComment))
                        .catch(err => res.status(500).json(createdComment))
                })
                .catch(err => res.status(500).json(err))
        })

})
//GET ALL COMMENT FROM A POST
router.get('/all-post-comments/:post', Auth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.post
        }
    })
        .then(foundPost => {
            Comment.findAll({
                where: {
                    postId: foundPost.id
                }
            })
                .then(foundComments => res.status(200).json(foundComments))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
module.exports = router;