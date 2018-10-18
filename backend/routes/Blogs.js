var models = require('../models');
var express = require('express');
var router = express.Router();

var Sequelize = require('sequelize');

// Retrieve a single blog by id
router.get('/blog/:blogId', (req, res) => {
    models.Blog
        .findOne({
            where: { id: req.params.blogId },
            include: [{
                model: models.User,
                where: { id: { $col: 'Blog.userId' } },
                attributes: ['firstname', 'lastname'],
                required: false
            },
            {
                model: models.Likes,
                where: { userId: req.session.userId },
                required: false
            },
            {
                model: models.Comments,
                where: { blogId: req.params.blogId },
                include: [{
                    model: models.User,
                    where: { id: { $col: 'Comments.userId' } },
                    attributes: ['firstname', 'lastname'],
                    required: false
                }],
                required: false
            }],
            order: [
                [models.Comments, 'createdAt', 'DESC']
            ]
        })
        .then(blog => {
            if (blog) {
                res.status(200).json(blog);
            } else {
                res.status(404).send();
            }
        })
        .catch(() => res.status(500).send());
});

// GET / blogs:
// Retrieve a list of the 20 most recent blog posts
router.get('/blogs', (req, res) => {
    models.Blog
        .findAll({
            include: [{
                model: models.Likes,
                where: { userId: req.session.userId },
                required: false
            },
            {
                model: models.User,
                where: { id: { $col: 'Blog.userId' } },
                attributes: ['firstname', 'lastname'],
                required: false
            }],
            attributes: { exclude: ['content'] },
            limit: 20,
            order: [['createdAt', 'DESC']]
        })
        .then(blogs => res.status(200).json(blogs))
        .catch(() => res.status(500).send());
});

// Returns the ordering string for sequelize to orer queries with
// depending on user input
function orderString(display) {
    console.log('Ordering by ' + display)
    switch (display) {
        case 'recent':
            return [['createdAt', 'DESC']]
        case 'liked':
            return [['createdAt', 'DESC']]
        case 'mostLiked':
            return [['likesCount', 'DESC']]
        case 'random':
            return Sequelize.fn( 'RANDOM' )
        default:
            return [['createdAt', 'DESC']]
    }
}

// Return ordering of blogs specified by the user
router.post('/blogsCustom', (req, res) => {
    if (req.session.userId) {
        let order = orderString(req.body.display);
        models.Blog
            .findAll({
                include: [{
                    model: models.Likes,
                    where: { userId: req.session.userId },
                    required: req.body.display === 'liked'
                },
                {
                    model: models.User,
                    where: { id: { $col: 'Blog.userId' } },
                    attributes: ['firstname', 'lastname'],
                    required: false
                }],
                attributes: { exclude: ['content'] },
                limit: 20,
                order: order
            })
            .then(blogs => res.status(200).json(blogs))
            .catch(() => res.status(500).send());
    } else {
        res.status(403).send();
    }
});

// Returns all the blogs belonging to a certain user
router.get('/myBlogs', (req, res) => {
    if (req.session.userId) {
        models.Blog
            .findAll({
                where: { userId: req.session.userId },
                attributes: { exclude: ['content'] },
                order: [['updatedAt', 'DESC']]
            })
            .then(blogs => res.status(200).json(blogs))
            .catch(() => res.status(500).send());
    } else {
        res.status(403).send();
    }
});

// Create a new blog and return it
router.post('/createBlog', (req, res) => {
    if (req.session.userId) {
        models.User.findOne({ where: { id: req.session.userId } })
            .then(user => {
                if (user) {
                        models.Blog.create({
                            validate: true,
                            title: req.body.title,
                            description: req.body.description,
                            content: req.body.content,
                            userId: req.session.userId
                        })
                            .then(newBlog => {
                                if (newBlog) {
                                    res.status(201).json({ blogId: newBlog.id });
                                } else {
                                    res.status(409).send();
                                }
                            })
                            .catch(Sequelize.ValidationError, (err) => {
                                res.status(400).send({alert: err.message});
                            })
                            .catch(() => {
                                res.status(500).send()
                            });
                        console.log(user.firstname + ' has created a blog post');
                   //}
                } else {
                    res.status(403).send();
                }
            })
            .catch(() => res.status(500).send());
    } else {
        res.status(403).send();
    }
});

// Delete a blog using its id
// If there is no user logged in or the user did not create the blog, return forbidden status
router.delete('/deleteBlog', (req, res) => {
    if (req.session.userId) {
        models.Blog.findOne({ where: { id: req.body.blogId } })
            .then(blog => {
                if (blog) {
                    console.log('blog found, userid for this blog is: ' + blog.userId)
                    // Check the user is the one who created this blog
                    if (blog.userId === req.session.userId) {
                        // First delete likes and comments associated with this blog
                        models.Likes.destroy({ where: { blogId: req.body.blogId } })
                            .then(() => {
                                models.Comments.destroy({ where: { blogId: req.body.blogId } })
                                    .then(() => {
                                        // Delete blog
                                        models.Blog.destroy({ where: { id: req.body.blogId } })
                                            .then(affectedRows => {
                                                if (affectedRows === 1) {
                                                    res.status(200).send();
                                                } else {
                                                    res.status(409).send();
                                                }
                                            });
                                    })
                                    .catch(() => res.status(500).send());
                            })
                            .catch(() => res.status(500).send());
                    } else {
                        res.status(403).send();
                    }
                } else {
                    res.status(404).send();
                }
            })
            .catch(() => res.status(500).send());
    } else {
        res.status(403).send();
    }
});

// Add a like to a blog post
// If the post is already liked, unlike the blog post
router.post('/likeBlog', (req, res) => {
    if (req.session.userId) {
        models.Blog
            .findOne({ where: { id: req.body.blogId } })
            .then(blog => {
                if (blog) {
                    // Check if blog post already liked by user
                    models.Likes.findOne({ where: { blogId: req.body.blogId, userId: req.session.userId } })
                        .then(row => {
                            if (row) {
                                // If already liked, unlike blog post
                                blog.update({ likesCount: blog.likesCount - 1 })
                                    .then(affectedBlogRows => {
                                        if (affectedBlogRows) {
                                            models.Likes.destroy({ where: { userId: req.session.userId, blogId: req.body.blogId } })
                                                .then(deletedLikedRows => {
                                                    if (deletedLikedRows) {
                                                        // Successfully removed like from blog post
                                                        console.log('Blog post unliked')
                                                        res.status(200).json({ "liked": false });
                                                    } else {
                                                        res.status(409).send();
                                                    }
                                                })
                                                .catch(() => res.status(500).send());
                                        } else {
                                            res.status(409).send();
                                        }
                                    });
                            } else {
                                // If not already liked, Like blog post
                                models.Likes.create({ userId: req.session.userId, blogId: req.body.blogId })
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
                        .catch(() => res.status(500).send());
                } else {
                    res.status(404).send();
                }
            })
            .catch(() => res.status(500).send());
    } else {
        res.status(403).send();
    }
});

// Add a comment to a blog post
router.post('/commentBlog', (req, res) => {
    if (req.session.userId) {
        models.Blog
            .findOne({ where: { id: req.body.blogId } })
            .then(blog => {
                if (blog) {
                    if (!req.body.comment || req.body.comment === '') {
                        res.status(400).send({ alert: 'Comment must not be empty.' });
                    } else if (req.body.comment.length > 2500) {
                        res.status(400).send({ alert: 'Comment must be 2500 characters or less.' });
                    } else {
                        models.Comments.create({ userId: req.session.userId, blogId: req.body.blogId, content: req.body.comment })
                            .then(affectedCommentRow => {
                                if (affectedCommentRow) {
                                    blog.update({ commentCount: blog.commentCount + 1 })
                                        .then(affectedBlogRow => {
                                            if (affectedBlogRow) {
                                                console.log('Blog post commented')
                                                res.status(200).json({ "updatedCommentCount": blog.commentCount, affectedCommentRow });
                                            } else {
                                                res.status(409).send();
                                            }
                                        })
                                        .catch(() => res.status(500).send());
                                } else {
                                    res.status(409).send();
                                }
                            })
                            .catch(() => res.status(500).send());
                    }
                } else {
                    res.status(404).send();
                }
            })
            .catch(() => res.status(500).send());
    } else {
        res.status(403).send();
    }
});

module.exports = router;