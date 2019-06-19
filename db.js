const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.NAME, 'postgres', process.env.PASS, {
    host: 'localhost',
    dialect: 'postgres'
})
sequelize.authenticate()
    .then(() => console.log('POSTGRES DB IS NOT CONNECTED'))
    .catch(err => console.log(err))

const Models = {
    User: sequelize.import('./models/user'),
    Post: sequelize.import('./models/post'),
    Message: sequelize.import('./models/message'),
    Following: sequelize.import('./models/following'),
    Comments: sequelize.import('./models/comments'),
    Likes: sequelize.import('./models/likes'),
}
Object.keys(Models).forEach((modelName) => {
    if ('associate' in Models[modelName]) {
        Models[modelName].associate(Models);
    }
})
module.exports = sequelize