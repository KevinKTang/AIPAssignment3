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

    secret: 'super secret'

    /*genid: function(req) {
        return uuidv4(); // Use UUIDs for session IDs
    },
    // In production, change to randomly generated string from an environment variable
    secret: 'super secret',
     resave: true // Come back to this when sorted out store
     app.set('trust proxy', 1) // Come back to this
    secure: true // For https enabled websites
    // can declare session attributes for production environment so you can still test in dev
    saveUninitialized: true, // Check later
    resave: true, // If session store doesn't implement touch command
    cookie: { maxAge: 60000} // Check later*/
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
        .catch(err => console.log(err));
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
        .then(data => res.json(data));
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

app.post('/createUser', (req, res) => {
    User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    })
    .then(newUser => {
        res.send(newUser);
    })
});

// Return true if correct login, otherwise false
app.post('/login', (req, res) => {
    User.findOne({where: {email: req.body.email}})
    .then(user => {
        if (!user) {
            res.send(JSON.stringify({'result': false}));
            console.log('user doesnt exist');
        } else {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (!result) {
                    res.send(JSON.stringify({'result': false}));
                    console.log('username or password incorrect');
                } else {
                    req.session.firstname = user.firstname;
                    console.log('session firstname is  ' + req.session.firstname);
                    console.log('login successful');
                    res.send(JSON.stringify({'result': true}));
                }
            });
        }
    });
});

// For testing purposes
app.get('/createSession', (req, res) => {
    req.session.word = 'dog';
    res.send(req.session); // Gives cookie
    console.log('word from session is ' + req.session.word);
});

app.get('/getFirstname', (req, res) => {
    if (req.session.firstname)
        res.send(JSON.stringify(req.session.firstname));
    else
        res.send(JSON.stringify('[no user logged in]'));
})

app.get('/checkSession', (req, res) => {
    console.log('word from session is ' + req.session.word);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log(req.session);
})

server = app.listen(5000, () => {
    console.log('Running on http://localhost:5000/');
});