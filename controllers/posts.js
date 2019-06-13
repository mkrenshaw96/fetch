const router = require('express').Router(),
    multer = require('multer'),
    IMAGE = require('../db').import('../models/post-model'),
    Auth = require('../middleware/auth.js'),
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
        bucket: 'fetch-api-images',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `-USER-${req.user.username}` + '-' + Date.now() + '-' + file.originalname)
        }
    })
})
router.post('/', Auth, upload.single('image'), (req, res) => {
    IMAGE.create({
        location: req.file.location,
        owner_id: req.user.id,
        posted_by_username: req.user.username,
        likes: 0,
        comments: null,
        caption: req.body.caption,
        user_location: req.body.user_location
    })
        .then(createdPost => res.status(200).json({ 'POST SUCCESSFULLY CREATED': createdPost }))
        .catch(err => {
            res.status(500).json({ error: err, message: 'FAILED TO CREATE POST' })
            console.log(err);
        })
});
module.exports = router;