const router = require('express').Router();
const User = require('../db').import('../models/user')
const Auth = require('../middleware/auth');
router.get('/:id', Auth, (req, res) => {
    User.findAll({
        where: {
            username: req.params.id
        }
    })
        .then(found => res.status(200).json(found))
        .catch(err => res.status(500).json(err))
})
module.exports = router;