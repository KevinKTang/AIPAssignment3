var models = require('../models');
var express = require('express');
var router = express.Router();

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash password before creating a new user
models.User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, saltRounds)
        .then(hash => user.password = hash)
        .catch(err => console.error(err));
});

// Create a new user, create the session and return the user information
router.post('/newUser', (req, res) => {
    models.User.create({
        validate: true,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    })
    .then((newUser) => {
        if (newUser) {
            req.session.userId = newUser.id;
            res.status(200).json({firstname: newUser.firstname, lastname: newUser.lastname});
            console.log('New user ' + newUser.firstname + ' created');
        } else {
            res.status(500).send();
        }
    })
    .catch(Sequelize.UniqueConstraintError, () => {
        res.status(409).send();
    })
    .catch(Sequelize.ValidationError, (err) => {
        res.status(400).send({alert: err.message});
    })
    .catch(() => res.status(500).send());
});

router.delete('/deleteUser', (req, res) => {
    if (req.session.userId) {
        console.log('Deleting user with id ' + req.session.userId);
        // First delete associated blogs, comments and likes
        models.Likes.destroy({ where: { userId: req.session.userId } })
        .then(() => {
            models.Comments.destroy({ where: {userId: req.session.userId } })
            .then(() => {
                models.Blog.destroy({ where: {userId : req.session.userId } })
                .then(() => {
                    // Delete user
                    models.User.destroy({ where: {id: req.session.userId} })
                    .then((affectedRows) => {
                        if (affectedRows === 1) {
                            // Delete current user session
                            req.session.destroy();
                            console.log('User deleted')
                            res.status(200).send();
                        } else {
                            res.status(409).send();
                        }
                    })
                    .catch(() => res.status(500).send());
                })
                .catch(() => res.status(500).send());
            })
            .catch(() => res.status(500).send());
        })
        .catch(() => res.status(500).send());
    } else {
        res.status(401).send();
    }
});

// If user login successful, create the session and return the user information
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
                        res.status(200).json({firstname: user.firstname, lastname: user.lastname});
                    }
                });
            }
        })
        .catch(() => res.status(500).send());
});

// Destroy the session on logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    console.log('User has logged out successfully');
    res.status(200).send();
});

// Returns the user information if there is a session
router.get('/checkSession', (req, res) => {
    if (req.session.userId) {
        models.User
            .findOne({ where: { id: req.session.userId } })
            .then(user => {
                if (user) {
                    res.status(200).json({firstname: user.firstname, lastname: user.lastname})
                } else {
                    res.status(404).send();
                }
            })
            .catch(() => res.status(500).send());
    }
});

module.exports = router;