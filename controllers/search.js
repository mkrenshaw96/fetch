const router = require('express').Router();
const User = require('../db').import('../models/user')
const Auth = require('../middleware/auth');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
router.get('/:id', Auth, (req, res) => {
    User.findAll({
        where: {
            [Op.or]: [
                {
                    username: {
                        [Op.iLike]: '%' + req.params.id + '%'
                    }
                },
                {
                    firstname: {
                        [Op.iLike]: '%' + req.params.id + '%'
                    }
                },
                {
                    lastname: {
                        [Op.iLike]: '%' + req.params.id + '%'
                    }
                },
                {
                    name: {
                        [Op.iLike]: '%' + req.params.id + '%'
                    }
                }
            ]
        }
    })
        .then(found => res.status(200).json(found))
        .catch(err => res.status(500).json(err))
})
module.exports = router;