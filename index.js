require('dotenv').config();
const express = require('express'),
    app = express(),
    db = require('./db').sync(),
    userController = require('./controllers/user'),
    postController = require('./controllers/post'),
    followingController = require('./controllers/following'),
    commentController = require('./controllers/comment'),
    likeController = require('./controllers/like'),
    profileController = require('./controllers/profile'),
    feedController = require('./controllers/feed');
app.use(require('./middleware/headers'));
app.use(express.json());
app.use('/user', userController);
app.use('/media', postController);
app.use('/follow', followingController);
app.use('/comment', commentController);
app.use('/like', likeController);
app.use('/profile', profileController)
app.use('/feed', feedController);
app.listen(process.env.PORT, () => console.log(`APP IS LISTENING ON ${process.env.PORT}`))