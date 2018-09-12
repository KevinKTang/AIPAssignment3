const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    // In production, change secret randomly generated string from an environment variable
    secret: 'super secret',
    genid: function(req) {
        // Use UUIDs for session IDs
        return uuidv4();
    },
    saveUninitialized: false,
    // 10 minutes expiration
    cookie: { maxAge: 600000}
    /*
    resave: true // Come back to this when sorted out store
    app.set('trust proxy', 1) // Come back to this
    secure: true // For https enabled websites
    resave: true, // If session store doesn't implement touch command */
}));

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

// Hash password before create a new user
User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, saltRounds)
        .then(hash => user.password = hash)
        .catch(err => console.error(err));
});

// Blog model
const Blog = sequelize.define('blog', {
    title: Sequelize.STRING,
    content: Sequelize.STRING
});

User.hasMany(Blog, {foreignKey: 'userId'});

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
        .then(users => res.json(users));
});

// GET / blogs:
// Retrieve a list of all blogs in the database
app.get('/blogs', (req, res) => {
    Blog
        .findAll()
        .then(blogs => res.json(blogs));
});

// GET /finduser?email=<email>
// Retrieve all records that match a user's email
app.get('/finduser', (req, res) => {
    User
        .findOne({where: {email: req.query.email}}) // Check findOne syntax later
        .then(data => res.json(data));
});

// GET /find?title=<Title>
// Retrieve all records that match a blog's title
app.get('/findblog', (req, res) => {
    Blog
        .findAll({where: {title: req.query.title}})
        .then(blogs => res.json(blogs));
});

// Returns all the blogs belonging to a certain user
app.get('/myblogs', (req, res) => {
    if (req.session.id) {
        Blog
            .findAll({ where: { userId: req.session.userId } })
            .then(blogs => res.status(200).json(blogs));
    }
});

// Create a new blog and return it
app.post('/createBlog', (req, res) => {
    if (req.session.userId) {
        User.findOne({where: {id: req.session.userId}})
        .then(user => {
            if (user) {
                Blog.create({
                    title: req.body.title,
                    content: req.body.content,
                    userId: req.session.userId
                })
                .then(newBlog => {
                    res.status(201).send(newBlog);
                });
                console.log(user.firstname + ' has created a blog post');
            } else {
                res.status(403).send();
            }
        })
    } else {
        res.status(403).send();
    }
});

// Create a new user, create the session and return the user's firstname
app.post('/newUser', (req, res) => {
    User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    })
    .then(newUser => {
        if (newUser) {
            req.session.userId = newUser.id;
            res.status(200).json(newUser.firstname);
            console.log('New user ' + newUser.firstname + ' created')
        } else {
            res.status().send();
        }
    }
    )
});

// If user login successful, create the session and return the user's firstname
app.post('/login', (req, res) => {
    User.findOne({where: {email: req.body.email}})
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
                    res.status(200).json(user.firstname);
                }
            });
        }
    });
});

// Destroy the session on logout
app.get('/logout', (req, res) => {
    console.log('User has logged out successfully')
    req.session.destroy();
    res.json(req.session);
});

// Returns the user firstname if there is a session
app.get('/checkSession', (req, res) => {
    if (req.session.userId) {
        User
            .findOne({where: id = req.session.userId})
            .then(user => {
                if (user) {
                    res.status(200).json(user.firstname)
                } else {
                    res.status(404).send();
                } 
            });
    }
    else {
        res.status(404).send();
    }
});

server = app.listen(5000, () => {
    console.log('Running on http://localhost:5000/');
});