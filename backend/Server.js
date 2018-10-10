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
    storage: 'website.db' //specify location
    //logging: false
});

// User model
const User = sequelize.define('user', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: {type: Sequelize.STRING, unique: true},
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
    description: Sequelize.STRING,
    content: Sequelize.JSON,
    likesCount: Sequelize.INTEGER,
    commentCount: Sequelize.INTEGER
});

// Associated both ways so can get user from blog, and blog from user
User.hasMany(Blog, {foreignKey: 'userId'});
Blog.belongsTo(User, {foreignKey: 'userId'});

// Likes model
const Likes = sequelize.define('likes', {

});

User.hasMany(Likes, {foreignKey: 'userId'});
Blog.hasMany(Likes, {foreignKey: 'blogId'});

const Comments = sequelize.define('comments', {
    content: Sequelize.STRING
});

Blog.hasMany(Comments, {foreignKey: 'blogId'});
// Associated both ways so can get comments from user, and user from comments
User.hasMany(Comments, {foreignKey: 'userId'});
Comments.belongsTo(User, {foreignKey: 'userId'});

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
    .sync()

// Simulate delay
//app.use((req, res, next) => setTimeout(() => next(), 2000));

// Retrieve a single blog by id
app.get('/blog/:blogId', (req, res) => {
    Blog
        .findOne({
            where: {id: req.params.blogId},
            include: [{
                model: User,
                where: { id: {$col: 'Blog.userId'} },
                attributes: ['firstname', 'lastname'],
                required: false
            },
            {
                model: Likes,
                where: { userId: req.session.userId },
                required: false
            },
            {
                model: Comments,
                where: { blogId: req.params.blogId },
                include: [{
                    model: User,
                    where: { id: {$col: 'Comments.userId'} },
                    attributes: ['firstname', 'lastname'],
                    required: false
                }],
                required: false
            }],
            order: [
                [Comments, 'createdAt', 'DESC']
            ]
        })
        .then(blog => {
            if (blog) {
                res.status(200).json(blog);
            } else {
                res.status(404).send();
            }
        });
});

// GET / blogs:
// Retrieve a list of the 20 most recent blog posts
app.get('/blogs', (req, res) => {
    Blog
        .findAll({
            include: [{
                model: User,
                where: { id: {$col: 'Blog.userId'} },
                attributes: ['firstname', 'lastname'],
                required: false
            },
            {
                model: Likes,
                where: { userId: req.session.userId },
                required: false
            }
        ],
            attributes: {exclude: ['content'] },
            limit: 20,
            order: [['updatedAt', 'DESC']]
        })
        .then(blogs => res.status(200).json(blogs));
});

// Return ordering of blogs specified by the user
app.post('/blogsCustom', (req, res) => {
    if (req.session.userId) {
        switch (req.body.display) {
            case 'recent':
                console.log('ORDERING BY RECENT');
                Blog
                    .findAll({
                        include: [{
                            model: Likes,
                            where: { userId: req.session.userId },
                            required: false
                        },
                        {
                            model: User,
                            where: { id: {$col: 'Blog.userId'} },
                            attributes: ['firstname', 'lastname'],
                            required: false
                        }],
                        attributes: {exclude: ['content'] },
                        limit: 20,
                        order: [['createdAt', 'DESC']]
                    })
                    .then(blogs => {
                        res.status(200).json(blogs);
                    });
                break;
            case 'liked':
                console.log('ORDERING BY LIKED');
                Blog
                .findAll({
                    include: [{
                        model: Likes,
                        where: { userId: req.session.userId },
                        required: true
                    },
                    {
                        model: User,
                        where: { id: {$col: 'Blog.userId'} },
                        attributes: ['firstname', 'lastname'],
                        required: false
                    }],
                    attributes: {exclude: ['content'] },
                    limit: 20,
                    order: [['createdAt', 'DESC']]
                })
                .then(blogs => {
                    res.status(200).json(blogs);
                });
                break;
            case 'mostLiked':
                console.log('ORDERING BY MOST LIKED');
                Blog
                    .findAll({
                        include: [{
                            model: Likes,
                            where: { userId: req.session.userId },
                            required: false
                        },
                        {
                            model: User,
                            where: { id: {$col: 'Blog.userId'} },
                            attributes: ['firstname', 'lastname'],
                            required: false
                        }],
                        attributes: {exclude: ['content'] },
                        limit: 20,
                        order: [['likesCount', 'DESC']]
                    })
                    .then(blogs => {
                        res.status(200).json(blogs);
                    });
                break;
            case 'random':
                console.log('ORDERING BY RANDOM');
                Blog
                    .findAll({
                        include: [{
                            model: Likes,
                            where: { userId: req.session.userId },
                            required: false
                        },
                        {
                            model: User,
                            where: { id: {$col: 'Blog.userId'} },
                            attributes: ['firstname', 'lastname'],
                            required: false
                        }],
                        attributes: {exclude: ['content'] },
                        limit: 20,
                        order: sequelize.random()
                    })
                    .then(blogs => {
                        res.status(200).json(blogs);
                    });
                break;
            default:
                console.log('Default selected:');
                console.log('ORDERING BY RECENT');
                Blog
                    .findAll({
                        include: [{
                            model: Likes,
                            where: { userId: req.session.userId },
                            required: false
                        },
                        {
                            model: User,
                            where: { id: {$col: 'Blog.userId'} },
                            attributes: ['firstname', 'lastname'],
                            required: false
                        }],
                        attributes: {exclude: ['content'] },
                        limit: 20,
                        order: [['createdAt', 'DESC']]
                    })
                    .then(blogs => {
                        res.status(200).json(blogs);
                    });
        }
        if (req.body.display === 'recent') {
            
        } 
    } else {
        res.status(403).send();
    }
});
// Returns all the blogs belonging to a certain user
app.get('/myBlogs', (req, res) => {
    if (req.session.userId) {
        Blog
            .findAll({
                where: {userId: req.session.userId},
                attributes: {exclude: ['content'] },
                order: [['updatedAt', 'DESC']]
            })
            .then(blogs => res.status(200).json(blogs));
    } else {
        res.status(403).send();
    }
});

// Create a new blog and return it
app.post('/createBlog', (req, res) => {
    if (req.session.userId) {
        User.findOne({where: {id: req.session.userId}})
        .then(user => {
            if (user) {
                // Validate user input
                if (!req.body.title || req.body.title === '') {
                    res.status(400).send({alert: 'Blog title must not be empty.'});
                } else if (req.body.title.length > 120) {
                    res.status(400).send({alert: 'Blog title must be 120 characters or less.'});
                } else if (!req.body.description || req.body.description === '') {
                    res.status(400).send({alert: 'Blog description must not be empty.'});
                } else if (req.body.description.length > 250) {
                    res.status(400).send({alert: 'Blog description must be 250 characters or less.'});
                } else if (!req.body.content || req.body.content === '') {
                    res.status(400).send({alert: 'Blog body must not be empty.'});
                } else {
                    Blog.create({
                        title: req.body.title,
                        description: req.body.description,
                        content: req.body.content,
                        userId: req.session.userId
                    })
                    .then(newBlog => {
                        if (newBlog) {
                            res.status(201).json({blogId: newBlog.id});
                        } else {
                            res.status(409).send();
                        }
                    });
                    console.log(user.firstname + ' has created a blog post');
                }
            } else {
                res.status(403).send();
            }
        })
    } else {
        res.status(403).send();
    }
});

// Delete a blog using its id
// If there is no user logged in or the user did not create the blog, return forbidden status
app.delete('/deleteBlog', (req, res) => {
    if (req.session.userId) {
        Blog.findOne({where: {id: req.body.blogId}})
        // TODO: remove likes and comments from tables
        .then(blog => {
            if (blog) {
                console.log('blog found, userid for this blog is: ' + blog.userId)
                // Check the user is the one who created this blog
                if (blog.userId === req.session.userId) {
                    // First delete likes and comments associated with this blog
                    Likes.destroy({where: {blogId: req.body.blogId}})
                    .then(() => {
                        Comments.destroy({where: {blogId: req.body.blogId}})
                        .then(() => {
                            // Delete blog
                            Blog.destroy({where: {id: req.body.blogId}})
                            .then(affectedRows => {
                                if (affectedRows === 1) {
                                    res.status(200).send();
                                } else {
                                    res.status(409).send();
                                }
                            });
                        });
                    });
                } else {
                    res.status(403).send();
                }
            } else {
                res.status(404).send();
            }
        });
    } else {
        res.status(403).send();
    }
});

// Create a new user, create the session and return the user's firstname
app.post('/newUser', (req, res) => {
    //Validate user input
    if (!req.body.firstname || req.body.firstname.length < 2) {
        res.status(400).send({alert: 'Firstname must be 2 or more characters in length.'});
    } else if (!req.body.lastname || req.body.lastname.length < 2) {
        res.status(400).send({alert: 'Lastname must be 2 or more characters in length.'});
    } else if (!(/.{1,}@{1}.{1,}\.{1,}.{1,}/.test(req.body.email))) {
        res.status(400).send({alert: 'Email format is incorrect. It must be in a format similar to example@email.com'});
    } else if (!req.body.password || req.body.password.length < 8) {
        res.status(400).send({alert: 'Password must be 8 or more characters in length.'});
    } else {
        User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        })
        .then(newUser => {
            if (newUser) {
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
                    res.status(200).json(user);
                }
            });
        }
    });
});

// Destroy the session on logout
app.get('/logout', (req, res) => {
    req.session.destroy()
    console.log('User has logged out successfully')
    res.status(200).send();
});

// Returns the user firstname if there is a session
app.get('/checkSession', (req, res) => {
    if (req.session.userId) {
        User
            .findOne({where: {id: req.session.userId}})
            .then(user => {
                if (user) {
                    res.status(200).json(user)
                } else {
                    res.status(404).send();
                } 
            });
    }
});

// Add a like to a blog post
// If the post is already liked, unlike the blog post
app.post('/likeBlog', (req, res) => {
    if (req.session.userId) {
        Blog
            .findOne({where: {id: req.body.blogId}})
            .then(blog => {
                if (blog) {
                    // Check if blog post already liked by user
                    Likes.findOne({ where: { blogId: req.body.blogId, userId: req.session.userId } })
                        .then(row => {
                            if (row) {
                                // If already liked, unlike blog post
                                blog.update({likesCount: blog.likesCount - 1})
                                .then(affectedBlogRows => {
                                    if (affectedBlogRows) {
                                        Likes.destroy({where: {userId: req.session.userId, blogId: req.body.blogId}})
                                            .then(deletedLikedRows => {
                                                if (deletedLikedRows) {
                                                    // Successfully removed like from blog post
                                                    console.log('Blog post unliked')
                                                    res.status(200).json({"liked": false});
                                                } else {
                                                    res.status(409).send();
                                                }
                                            });
                                    } else {
                                        res.status(409).send();
                                    }
                                });
                            } else {
                                // If not already liked, Like blog post
                                Likes.create({userId: req.session.userId, blogId: req.body.blogId})
                                    .then(affectedLikesRows => {
                                        if (affectedLikesRows) {
                                            blog.update({ likesCount: blog.likesCount + 1 })
                                                .then(affectedBlogRows => {
                                                    if (affectedBlogRows) {
                                                        // Successfully liked blog post
                                                        console.log('Blog post liked');
                                                        res.status(200).json({ "liked": true });
                                                    } else {
                                                        res.status(409).send();
                                                    }
                                                });
                                        } else {
                                            res.status(409).send();
                                        }
                                    });
                            }
                        })
                } else {
                    res.status(404).send();
                }
            })
    } else {
        res.status(403).send();
    }
});

// Add a comment to a blog post
app.post('/commentBlog', (req, res) => {
    if (req.session.userId) {
        Blog
            .findOne({where: {id: req.body.blogId}})
            .then(blog => {
                if (blog) {
                    if (!req.body.comment || req.body.comment === '') {
                        res.status(400).send({alert: 'Comment must not be empty.'});
                    } else {
                        Comments.create({userId: req.session.userId, blogId: req.body.blogId, content: req.body.comment})
                        .then(affectedCommentRow => {
                            if (affectedCommentRow) {
                                blog.update({commentCount: blog.commentCount + 1})
                                    .then(affectedBlogRow => {
                                        if (affectedBlogRow) {
                                            console.log('Blog post commented')
                                            res.status(200).json({ "updatedCommentCount": blog.commentCount, affectedCommentRow});
                                        } else {
                                            res.status(409).send();
                                        }
                                    });
                            } else {
                                res.status(409).send();
                            }
                        });
                    }
                } else {
                    res.status(404).send();
                }
            });
    } else {
        res.status(403).send();
    }
});

server = app.listen(5000, () => {
    console.log('Running on http://localhost:5000/');
});

// For unit testing
module.exports = server;