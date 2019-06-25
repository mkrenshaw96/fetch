const Models = require('../models/models'),
    router = require('express').Router(),
    multer = require('multer'),
    Auth = require('../middleware/auth'),
    multerS3 = require('multer-s3'),
    AWS = require('aws-sdk'),
    User = require('../models/user');
const ACCESS = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});
const upload = multer({
    storage: multerS3({
        s3: ACCESS,
        bucket: 'fetch-api-images',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `-POST-MEDIA-${req.user.username}` + '-' + Date.now() + '-' + file.originalname)
        }
    })
})
//UPLOAD SINGLE POST
router.post('/post', Auth, upload.single('image'), (req, res) => {
    Models.User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            foundUser.createPost({
                postUrl: req.file.location,
                likes: 0,
                caption: req.body.caption,
                postedFromLocation: req.body.postedFromLocation
            })
                .then(createdPost => {
                    res.status(200).json({ 'POST SUCCESSFULLY CREATED': createdPost })
                })
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
});
//INCREMENT MEDIA COUNT ON POST
// router.put('/increment-media-count', Auth, (req, res) => {
//     Models.User.findOne({
//         where: {
//             id: req.user.id
//         }
//     })
//         .then(foundUser => {
//             foundUser.update({
//                 mediaCount: foundUser.mediaCount + 1
//             })
//                 .then(updated => res.status(200).json('Incremented'))
//                 .catch(err => res.status(500).json(err))
//         })
//         .catch(err => res.status(500).json(err))
// })
//GET ALL POST DATA FROM A SPECIFIED USER
router.get('/user-post', Auth, (req, res) => {
    Models.User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            Models.Post.findAll({
                where: {
                    userId: foundUser.id
                }
            })
                .then(foundPost => {
                    res.status(200).json(foundPost)
                })
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
//GET ALL POST FROM A USER BY URL PARAM
router.get('/profile/:id', Auth, (req, res) => {
    Models.Post.findAll({
        where: {
            userId: req.params.id
        }
    })
        .then(foundPost => {
            res.status(200).json(foundPost)
        })
        .catch(err => res.status(500).json(err))
})
//GET ALL POST DATA FROM ALL USERS 
router.get('/all-users-post', Auth, (req, res) => {
    Models.Post.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    }, {
            limit: 20
        })
        .then(found => res.status(200).json(found))
        .catch(err => res.status(500).json(err))
})
router.put('/like/:id', Auth, (req, res) => {
    Models.Post.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(foundPost => {
            const likes = foundPost.likes + 1
            foundPost.update({
                likes: likes
            })
                .then(liked => res.status(200).json(liked))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
router.put('/unlike/:id', Auth, (req, res) => {
    Models.Post.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(foundPost => {
            const unlike = foundPost.likes - 1
            unlike < 0 ? unlike = 0 : unlike;
            foundPost.update({
                likes: unlike
            })
                .then(liked => res.status(200).json(liked))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
router.get('/find/:id', Auth, (req, res) => {
    Models.Post.findAll({
        where: {
            id: req.params.id
        }
    })
        .then(foundPost => {
            res.status(200).json(foundPost)
        })
        .catch(err => res.status(500).json('ERROR', err))
})
module.exports = router;