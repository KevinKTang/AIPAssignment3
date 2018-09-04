const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

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
    content: Sequelize.STRING
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

        Blog.create({title: 'Cats', content: 'I like cats. They are great to have as a pet.'});
        Blog.create({title: 'Dogs', content: 'I like dogs. They are fun and like to run around at the park.'});
        Blog.create({title: 'Sequelize', content: 'Sequelize is an object relational mapper. It has been used in this project!'});
    });

// GET / users:
// Retrieve a list of all users in the database
app.get('/users', (req, res) => {
    User
        .findAll()
        .then(rows => res.json(rows));
});

// GET / blogs:
// Retrieve a list of all users in the database
app.get('/blogs', (req, res) => {
    Blog
        .findAll()
        .then(rows => res.json(rows));
});

// GET /finduser?email=<email>
// Retrieve all records that match a user's firstname
app.get('/finduser', (req, res) => {
    User
        .findOne({where: {email: req.query.email}}) // Check findOne syntax later
        .then(rows => res.json(rows));
});

// GET /find?title=<Title>
// Retrieve all records that match a blog's title
app.get('/findblog', (req, res) => {
    Blog
        .findAll({where: {title: req.query.title}})
        .then(rows => res.json(rows));
});

// To test connection with frontend
app.get('/ping', (req, res) => {
    res.status(200);
    res.send({'data': {
        'answer': 'pong'
    }});
})

app.post('/createBlog', (req, res) => {
    Blog.create({
        title: req.body.title,
        content: req.body.content
    })
    .then(newBlog => {
        res.send(newBlog);
    })
});

server = app.listen(5000, () => {
    console.log('Running on http://localhost:5000/');
});