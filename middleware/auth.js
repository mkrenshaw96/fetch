const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');
const Auth = (req, res, next) => {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err && decoded) {
            User.findOne({
                where: {
                    id: decoded.id
                }
            })
                .then(foundUser => {
                    if (!foundUser && err) throw err;
                    req.user = foundUser
                    return next();
                })
                .catch(err => {
                    next(err)
                })
        } else {
            req.errors = err
            return res.status(401).json({
                message: 'NOT AUTHORIZED'
            })
        }
    })
}
module.exports = Auth;