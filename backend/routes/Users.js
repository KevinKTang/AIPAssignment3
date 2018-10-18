var models = require('../models');
var express = require('express');
var router = express.Router();
const { performance } = require('perf_hooks');

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash password before create a new user
models.User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, saltRounds)
        .then(hash => user.password = hash)
        .catch(err => console.error(err));
});

// Create a new user, create the session and return the user's firstname
router.post('/newUser', (req, res) => {
    let startTime = performance.now();
    //Validate user input
    if (!req.body.firstname || req.body.firstname.length < 2) {
        res.status(400).send({ alert: 'Firstname must be 2 or more characters in length.' });
    } else if (!req.body.lastname || req.body.lastname.length < 2) {
        res.status(400).send({ alert: 'Lastname must be 2 or more characters in length.' });
    } else if (!(/[\w+.]+@((\w[\w-]*)\.)+(\w[\w-]*)/.test(req.body.email))) {
        res.status(400).send({ alert: 'Email format is incorrect. It must be in a format similar to example@email.com' });
    } else if (!req.body.password || req.body.password.length < 8) {
        res.status(400).send({ alert: 'Password must be 8 or more characters in length.' });
    } else {
        models.User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        })
            .then(newUser => {
                if (newUser) {
                    console.log('Time taken');
                    console.log(performance.now() - startTime);
                    req.session.userId = newUser.id;
                    res.status(200).json(newUser);
                    console.log('New user ' + newUser.firstname + ' created');
                } else {
                    res.status(409).send();
                }
            })
            .catch(Sequelize.UniqueConstraintError, (err) => {
                res.status(409).send();
            });
    }
});

// If user login successful, create the session and return the user's firstname
router.post('/login', (req, res) => {
    models.User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                res.status(401).send();
                console.log('User does not exist');
            } else {
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (!result) {
                        res.status(401).send();
                        console.log('Username or password incorrect');
                    } else {
                        req.session.userId = user.id;
                        console.log(user.firstname + ' has logged in successfully');
                        res.status(200).json(user);
                    }
                });
            }
        });
});

// Destroy the session on logout
router.get('/logout', (req, res) => {
    req.session.destroy()
    console.log('User has logged out successfully')
    res.status(200).send();
});

// Returns the user firstname if there is a session
router.get('/checkSession', (req, res) => {
    if (req.session.userId) {
        models.User
            .findOne({ where: { id: req.session.userId } })
            .then(user => {
                if (user) {
                    res.status(200).json(user)
                } else {
                    res.status(404).send();
                }
            });
    }
});

module.exports = router;