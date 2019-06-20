const router = require('express').Router(),
    multer = require('multer'),
    User = require('../db').import('../models/user'),
    Auth = require('../middleware/auth'),
    multerS3 = require('multer-s3'),
    AWS = require('aws-sdk');
const ACCESS = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});
const upload = multer({
    storage: multerS3({
        s3: ACCESS,
        bucket: process.env.BUCKET_2,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `-PROFILE-PIC-${req.user.username}` + '-' + Date.now() + '-' + file.originalname)
        }
    })
})
// router.put('/update', Auth, upload.single('image'), (req, res) => {
//     User.findOne({
//         where: {
//             id: req.user.id
//         }
//     })
//         .then(foundUser => {
//             foundUser.update({
//                 profilePicUrl: req.file.location,
//                 bio: req.body.bio,
//                 name: req.body.name
//             })
//                 .then(updatedUser => res.status(200).json(updatedUser))
//                 .catch(err => res.status(500).json(err))
//         })
//         .catch(err => res.status(500).json(err))
// })
router.put('/update-profile-photo', Auth, upload.single('image'), (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            foundUser.update({
                profilePicUrl: req.file.location
            },
                {
                    returning: true
                })
                .then(updated => res.status(200).json(updated))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
router.put('/update-bio', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            foundUser.update({
                where: {
                    bio: req.body.bio
                }
            },
                {
                    returning: true
                })
                .then(updated => res.status(200).json(updated))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
router.put('/update-name', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundUser => {
            foundUser.update({
                name: req.body.name
            },
                {
                    returning: true
                })
                .then(updated => res.status(200).json(updated))
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})
router.get('/user-profile', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundProfile => res.status(200).json(foundProfile))
        .catch(err => res.status(500).json(err))
})
router.get('/my-profile', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    })
        .then(foundProfile => res.status(200).json(foundProfile))
        .catch(err => res.status(500).json(err))
})
//
router.get('/user-profile/:id', Auth, (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(foundProfile => res.status(200).json(foundProfile))
        .catch(err => res.status(500).json(err))
})
module.exports = router;