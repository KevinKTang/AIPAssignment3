const express = require('express');
const app = express();
const Sequelize = require('sequelize');

// Set up the database connection
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'mydb.db' //specify location
});

// User model
const User = sequelize.define('user', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING // Change later
});

// Blog model
const Blog = sequelize.define('blog', {
    title: Sequelize.STRING,
    body: Sequelize.STRING
})

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Set up the tables
sequelize
    // Force the database tables to be set up from scratch
    .sync({force: true}) // Drop table if exists
    .then(() => {
        User.create({firstname: 'Joe', lastname: 'Bloggs', email: 'joe@gmail.com', password: 'Bloggs'});
        User.create({firstname: 'Pete', lastname: 'Smith', email: 'pete@gmail.com', password: 'Smith'});
        User.create({firstname: 'Darcy', lastname: 'North', email: 'darcy@gmail.com', password: 'North'});

        Blog.create({title: 'Cats', body: 'I like cats. They are great to have as a pet.'});
        Blog.create({title: 'Dogs', body: 'I like dogs. They are fun and like to run around at the park.'});
        Blog.create({title: 'Sequelize', body: 'Sequelize is an object relational mapper. It has been used in this project!'});
    });

    // To test connection with frontend
    app.get('/ping', (req, res) => {
        res.json({response: 'pong'});
    })

// GET / users:
// Retrieve a list of all users in the database
app.use('/users', (req, res) => {
    User
        .findAll()
        .then(rows => res.json(rows));
});

// GET / blogs:
// Retrieve a list of all users in the database
app.use('/blogs', (req, res) => {
    Blog
        .findAll()
        .then(rows => res.json(rows));
});

// GET /finduser?email=<email>
// Retrieve all records that match a user's firstname
app.use('/finduser', (req, res) => {
    User
        .findAll({where: {email: req.query.email}})
        .then(rows => res.json(rows));
});

// GET /find?title=<Title>
// Retrieve all records that match a blog's title
app.use('/findblog', (req, res) => {
    Blog
        .findAll({where: {title: req.query.title}})
        .then(rows => res.json(rows));
});

server = app.listen(5000, () => {
    console.log('Running on http://localhost:5000/');
});