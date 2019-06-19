const db = require('../db');
const Models = {
    User: db.import('./user'),
    Post: db.import('./post'),
    Message: db.import('./message'),
    Following: db.import('./following'),
    Comments: db.import('./comments'),
    Likes: db.import('./likes'),
}
module.exports = Models