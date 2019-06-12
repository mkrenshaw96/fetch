const Sequelize = require('sequelize');
const db = new Sequelize(process.env.NAME, 'postgres', process.env.PASS, {
    host: 'localhost',
    dialect: 'postgres'
})
db.authenticate()
    .then(() => console.log('POSTGRES DATABSE IS NOW CONNECTED'))
    .catch(err => console.log(err))

module.exports = db;