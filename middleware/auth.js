const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user-model');
const Auth = (req, res, next) => {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err && decoded) {
            User.findOne({
                id: decoded.id
            })
                .then(found => {
                    if (!found && err) throw err;
                    req.user = found
                    return next();
                })
                .catch(err => {
                    next(err)
                })
        } else {
            req.errors = err
            return res.status(500).json({
                message: 'NOT AUTHORIZED'
            })
        }
    })
}
module.exports = Auth;