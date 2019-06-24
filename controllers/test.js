import React, { useState } from 'react';
import './Auth.css';
const Auth = (props) => {

    const [login, setLogin] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginToggle = (event) => {
        event.preventDefault();
        setLogin(!login);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let url = login ? 'http://localhost:3000/auth/signin' :
            'http://localhost:3000/auth/signup';

        let reqBody = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
            .then(res => res.json())
            .then(data => props.storeToken(data.sessionToken))
            .catch(err => console.log(err));
    };

    return (
        <form className="card" onSubmit={(e) => handleSubmit(e)}>
            <h1>{login ? 'Sign In' : 'Sign Up'}</h1>

            {
                login ? null
                    : <React.Fragment>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" name="firstName" />
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" name="lastName" />
                    </React.Fragment>
            }


            <label htmlFor="email">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="text" name="email" />
            <label htmlFor="password">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} type="text" name="password" />
            <br />
            <button onClick={(e) => loginToggle(e)} href="#" className="myButton">Login/Sign Up Toggle</button>
            <button href="#" className="myButton">Submit</button>
        </form>
    )
}

export default Auth;

const router = require('express').Router();
const User = require('../db').import('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateSession = require('../middleware/validate-session')

router.post('/signin', (request, response) => {
    User.findOne({
        where: {
            email: request.body.email
        }
    })
        .then(user => {
            if (user) {
                bcrypt.compare(request.body.password, user.password, (err, matches) => {
                    if (matches) {
                        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                        response.json({
                            user: user,
                            message: "successfully authenticated",
                            sessionToken: token
                        })
                    } else {
                        response.status(502).send({ error: err + 'bad gateway' });
                    }
                })
            } else {
                response.status(500).send({ error: 'failed to authenticate' })
            }
        }
        )
    err => response.status(501).send({ error: 'failed to process' });
});

router.post('/signup', (request, response) => {
    User.create({
        userName: request.body.userName,
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, 10)
    })
        .then(
            createSuccess = (user) => {
                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                response.json({
                    user: user,
                    message: "user created",
                    sessionToken: token
                })
            },
            createError = err => response.send(500, err)
        );
});

router.put('/:id', validateSession, (request, response) => {
    User.update(request.body, {
        where: { id: request.params.id },
        returning: true
    })
        .then(User => response.status(200).json(User))
        .catch(err => response.status(500).json({ error: err }))
});


router.delete('/:id', validateSession, (request, response) => {
    User.destroy({
        where: { id: request.params.id },
    })
        .then(User => response.status(200).json(User))
        .catch(err => response.status(500).json({ error: err }))
});


module.exports = router;