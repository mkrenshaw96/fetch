require('dotenv').config();
const express = require('express');
const app = express();
const postController = require('./controllers/posts');
const userController = require('./controllers/users');
require('./db').sync();
app.use(express.json())
app.use(require('./middleware/headers'));
app.use('/user', userController);
app.use('/post', postController);
app.get('/', (req, res) => res.send('THIS IS A TEST GET REQUEST'));
app.listen(process.env.PORT, () => console.log(`PORT IS RUNNING ON ${process.env.PORT}`))