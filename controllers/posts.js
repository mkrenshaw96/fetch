const router = require('express').Router();
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const Image = require('../db').import('../models/post-model');
const Auth = require('../middleware/auth');

const awsACCESS = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    Bucket: process.env.BUCKET
});

// const upload = multer({
//     storage: multerS3({
//         s3: awsACCESS,
//         bucket: process.env.BUCKET,
//         acl: 'public-read',
//         key: (req, file, cb) => {
//             cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
//         }
//     }),
//     limits: { fileSize: 2000000 },
//     fileFilter: (req, file, cb) => {
//         checkFileType(file, cb);
//     }
// }).single('profileImage');

var postUploader = multer({
    storage: multerS3({
        s3: awsACCESS,
        bucket: 'am-image-db',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

// const checkFileType = (file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Images Only!');
//     }
// }

router.post('/upload', postUploader.single('image'), (req, res) => {
    Image.create({
        location: req.file.location,
        owner_id: req.user.id,
        posted_by: req.user.username
    })
        .then(created => res.status(200).json({ created }))
        .catch(err => res.status(500).json({ error: err }))
})

// router.post('/test', Auth, (req, res) => {
//     postImageUpload(req, res, (error) => {
//         // console.log('requestOkokok', req.file);
//         // console.log('error', error);
//         if (error) {
//             console.log('errors', error);
//             res.json({ error: error });
//         } else {
//             // If File not found
//             if (req.file === undefined) {
//                 console.log('Error: No File Selected!');
//                 res.json('Error: No File Selected');
//             } else {
//                 // If Success
//                 const imageName = req.file.key;
//                 const imageLocation = req.file.location;
//                 const userId = req.user.username;
//                 // Save the file name into database into profile model
//                 res.json({
//                     image: imageName,
//                     location: imageLocation,
//                     id: userId
//                 });
//             }
//         }
//     });
// });

module.exports = router;