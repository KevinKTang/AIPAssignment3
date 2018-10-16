const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
const http = require('http');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    // In production, change secret randomly generated string from an environment variable
    secret: 'super secret',
    genid: function (req) {
        // Use UUIDs for session IDs
        return uuidv4();
    },
    saveUninitialized: false,
    /*
    resave: true // Come back to this when sorted out store
    app.set('trust proxy', 1) // Come back to this
    secure: true // For https enabled websites
    resave: true, // If session store doesn't implement touch command */
}));

var models = require('./models');

var users = require('./routes/Users.js');
var blogs = require('./routes/Blogs.js');

app.use('/', users, blogs);

var server = http.createServer(app);


// Simulate delay
//app.use((req, res, next) => setTimeout(() => next(), 2000));

// Set up the tables
models.sequelize.sync().then(() => {
    // Listen on port
 //   server.listen(5000, () => {
 //       console.log('Express server listening on port 5000');
 //   });
});

server = app.listen(5000, () => {
    console.log('Running on http://localhost:5000/');
});



// For unit testing
module.exports = server;