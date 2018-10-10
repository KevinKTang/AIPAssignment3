'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const chaihttp = require('chai-http');

chai.use(chaihttp);

const server = require('../Server.js');
var agent = chai.request.agent(server);

describe('Users', function() {
    this.timeout(10000);

    let firstname = 'Darcy';
    let lastname = 'Smith';
    let userEmail = 'darcysmith675423@mygmail.com';
    let userPassword = 'myPassword';

    it('Test register firstname input validation', () => {
        return agent
            .post('/newUser')
            .send({
                firstname: 'f',
                lastname: 'lastname',
                email: '5234@gmail.com',
                password: 'userPassword'
            })
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.alert).to.equal('Firstname must be 2 or more characters in length.')
            });
    });

    it('Test register lastname input validation', () => {
        return agent
            .post('/newUser')
            .send({
                firstname: 'firstname',
                lastname: 'l',
                email: '5234@gmail.com',
                password: 'userPassword'
            })
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.alert).to.equal('Lastname must be 2 or more characters in length.')
            });
    });

    it('Test register email input validation', () => {
        return agent
            .post('/newUser')
            .send({
                firstname: 'firstname',
                lastname: 'lastname',
                email: '5234@gmail',
                password: 'userPassword'
            })
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.alert).to.equal('Email format is incorrect. It must be in a format similar to example@email.com')
            });
    });

    it('Test register password input validation', () => {
        return agent
            .post('/newUser')
            .send({
                firstname: 'firstname',
                lastname: 'lastname',
                email: '5234@gmail.com',
                password: 'pass'
            })
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.alert).to.equal('Password must be 8 or more characters in length.')
            });
    });

    it('Register new user', () => {
        return agent
            .post('/newUser')
            .send({
                firstname: firstname,
                lastname: lastname,
                email: userEmail,
                password: userPassword
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.firstname).to.equal('Darcy');
                expect(res.body.lastname).to.equal('Smith');
                // Need to log out user after login to test login later
                return agent.get('/logout');
            });
    });

    it('Try to register new user with same email as another user', () => {
        return agent
            .post('/newUser')
            .send({
                firstname: 'Joe',
                lastname: 'Bloggs',
                email: userEmail,
                password: 'password'
            })
            .then((res) => {
                expect(res).to.have.status(409);
                // Need to log out user after login to test login later
                return agent.get('/logout');
            });
    });

    it ('Login attempt with incorrect email and password', () => {
        return agent
            .post('/login')
            .send({
                email: 'incorrectEmail',
                password: 'incorrectPassword'
            })
            .then((res) => {
                expect(res).to.have.status(401);
            });
    });

    it ('Login attempt with incorrect password', () => {
        return agent
            .post('/login')
            .send({
                email: userEmail,
                password: 'incorrectPassword'
            })
            .then((res) => {
                expect(res).to.have.status(401);
            });
    });

    it('Login', () => {
        return agent
            .post('/login')
            .send({
                email: userEmail,
                password: userPassword
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.firstname).to.equal(firstname);
                expect(res).to.have.cookie('connect.sid');
            });
    });

    it('Test session while logged in', () => {
        return agent
            .get('/checkSession')
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

    it('Try to get my blogs while logged out', () => {
        return agent
            .get('/logout')
            .then(() => {
                return agent
                .get('/myBlogs')
                .then(res => {
                    expect(res).to.have.status(403);
                });
            });
    });

});

describe('Blogs', function() {
    this.timeout(10000);

    after(() => {
        agent.close();
    });

    it('Try to create blog while logged out', () => {
        return agent
            .get('/logout')
            .then(() => {
                return agent
                    .post('/createBlog')
                    .send({
                        title: 'Blog Title',
                        description: 'This is the body of the blog post.'
                    })
                    .then((res) => {
                        expect(res).to.have.status(403);
                    })
            });
    });

    it('Try to delete blog while logged out', () => {
        return agent
            .delete('/deleteBlog')
            .send({
                blogId: 2000
            })
            .then((res) => {
                expect(res).to.have.status(403);
            })
    });

    let firstname = 'firstname18462';
    let lastname = 'lastname';
    let userEmail = 'user18462@email.com';
    let userPassword = 'userPassword';
    let userId = '';

    it('No created blogs to start off with', () => {
        // Login first
        return agent
            .post('/newUser')
            .send({
                firstname: firstname,
                lastname: lastname,
                email: userEmail,
                password: userPassword
            })
            .then((res) => {
                userId = res.body.id;
                return agent
                    .get('/myBlogs')
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.eql([]);
                    });
            });
    });

    let firstBlogTitle = 'First';
    let firstBlogDesc = 'This is the description of the blog post.';
    let secondBlogTitle = 'Second';
    let secondBlogDesc = 'Second description.';
    let thirdBlogTitle = 'Third';
    let thirdBlogDesc = 'Third description';
    let firstBlogId = '';
    let secondBlogId = '';
    let thirdBlogId = '';

    it('Test create blog post title input validation', () => {
        return agent
        .post('/createBlog')
        .send({
            title: '',
            description: firstBlogDesc,
            content: 'some content'
        })
        .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body.alert).to.equal('Blog title must not be empty.');
        })
    });

    it('Test create blog post description input validation', () => {
        return agent
        .post('/createBlog')
        .send({
            title: firstBlogTitle,
            description: '',
            content: 'some content'
        })
        .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body.alert).to.equal('Blog description must not be empty.');
        })
    });

    it('Test create blog post content input validation', () => {
        return agent
        .post('/createBlog')
        .send({
            title: firstBlogTitle,
            description: firstBlogDesc,
            content: ''
        })
        .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body.alert).to.equal('Blog body must not be empty.');
        })
    });

    it('Create 3 blog posts', () => {
        return agent
            .post('/createBlog')
            .send({
                title: firstBlogTitle,
                description: firstBlogDesc,
                content: 'some content'
            })
            .then((res) => {
                expect(res).to.have.status(201);
                firstBlogId = res.body.blogId;
                return agent
                    .post('/createBlog')
                    .send({
                        title: secondBlogTitle,
                        description: secondBlogDesc,
                        content: 'some content'
                    })
                    .then((res) => {
                        expect(res).to.have.status(201);
                        secondBlogId = res.body.blogId;
                        return agent
                            .post('/createBlog')
                            .send({
                                title: thirdBlogTitle,
                                description: thirdBlogDesc,
                                content: 'some content'
                            })
                            .then((res) => {
                                expect(res).to.have.status(201);
                                thirdBlogId = res.body.blogId;
                            });
                    });
            })
    });

    it('Retrieve created blog posts', () => {
        return agent
            .get('/myBlogs')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body[0].title).to.equal(thirdBlogTitle);
                expect(res.body[0].description).to.equal(thirdBlogDesc);
                expect(res.body[1].title).to.equal(secondBlogTitle);
                expect(res.body[1].description).to.equal(secondBlogDesc);
                expect(res.body[2].title).to.equal(firstBlogTitle);
                expect(res.body[2].description).to.equal(firstBlogDesc);
            })
    });

    it('View a single blog post', () => {
        return agent
            .get('/blog/' + thirdBlogId)
            .then((res) => {
                expect(res).to.to.status(200);
                expect(res).to.be.json;
                expect(res.body.title).to.equal(thirdBlogTitle);
                expect(res.body.description).to.equal(thirdBlogDesc);
                expect(res.body.user.firstname).to.equal(firstname);
                expect(res.body.user.lastname).to.equal(lastname);
            });
    });

    it('View a single blog post with incorrect blogId', () => {
        return agent
            .get('/blog/' + '-1')
            .then((res) => {
                expect(res).to.to.status(404);
            });
    });

    it('Like own blog post', () => {
        return agent
            .post('/likeBlog')
            .send({blogId: firstBlogId})
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.liked).to.be.true;
            });
    });

    it('Unlike own blog post', () => {
        return agent
            .post('/likeBlog')
            .send({blogId: firstBlogId})
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.liked).to.be.false;
            });
    });

    it('Delete incorrect blog post', () => {
        return agent
            .delete('/deleteBlog')
            .send({
                blogId: -1
            })
            .then((res) => {
                expect(res).to.have.status(404);
            });
    });

    it('Delete blog post', () => {
        return agent
            .delete('/deleteBlog')
            .send({
                blogId: firstBlogId
            })
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

    it('Like blog post while not logged in', () => {
        return agent
            .get('/logout')
            .then(() => {
                return agent
                    .post('/likeBlog')
                    .send({ blogId: secondBlogId })
                    .then(res => {
                        expect(res).to.have.status(403);
                    });
            });
    });

    it('Change ordering to sort by liked blog posts', () => {
        return agent
            .post('/login')
            .send({email: userEmail, password: userPassword})
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.firstname).to.equal(firstname);
                return agent
                    .post('/likeBlog')
                    .send({blogId: secondBlogId})
                    .then((res) => {
                            expect(res).to.have.status(200);
                            expect(res.body.liked).to.be.true;
                            return agent
                                .post('/blogsCustom')
                                .send({display: 'liked'})
                                .then(res => {
                                    // Only liked the second blog post, that should be the only blog post returned
                                    expect(res).to.have.status(200);
                                    expect(res.body.length).to.equal(1);
                                    expect(res.body[0].title).to.equal(secondBlogTitle);
                                });
                    });
            });
    });

    it('Change ordering to sort by most liked blog posts', () => {
        return agent
            .post('/blogsCustom')
            .send({ display: 'mostLiked' })
            .then(res => {
                // Only have 2 blog posts, secondBlog is liked, thirdBlog is not
                expect(res).to.have.status(200);
                expect(res.body.length).to.equal(2);
                expect(res.body[0].title).to.equal(secondBlogTitle);
                expect(res.body[1].title).to.equal(thirdBlogTitle);
            });
    });

    it('Change ordering to sort by random blog posts', () => {
        return agent
            .post('/blogsCustom')
            .send({ display: 'random' })
            .then(res => {
                // Only have 2 blog posts
                expect(res).to.have.status(200);
                expect(res.body.length).to.equal(2);
            });
    });

    it('Change ordering to sort by recent blog posts', () => {
        return agent
            .post('/blogsCustom')
            .send({ display: 'recent' })
            .then(res => {
                // Only have 2 blog posts, secondBlog was created before thirdBlog
                expect(res).to.have.status(200);
                expect(res.body.length).to.equal(2);
                expect(res.body[0].title).to.equal(thirdBlogTitle);
                expect(res.body[1].title).to.equal(secondBlogTitle);
            });
    });

    it('Check author of blog posts', () => {
        return agent
        .post('/blogsCustom')
        .send({display: 'recent'})
        .then(res => {
            expect(res).to.have.status(200);
            expect(res.body.length).to.equal(2);
            expect(res.body[0].user.firstname).to.equal(firstname);
            expect(res.body[0].user.lastname).to.equal(lastname);
            expect(res.body[1].user.firstname).to.equal(firstname);
            expect(res.body[1].user.lastname).to.equal(lastname);
        });
    });

    it('Test add comment input validation', () => {
        return agent
            .post('/commentBlog')
            .send({blogId: secondBlogId, comment: ''})
                .then(res => {
                    expect(res).to.have.status(400);
                    expect(res.body.alert).to.equal('Comment must not be empty.');
                });
    });

    it('Add a comment to a blog post', () => {
        return agent
            .post('/commentBlog')
            .send({blogId: secondBlogId, comment: 'New comment'})
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.updatedCommentCount).to.equal(1);
                    expect(res.body.affectedCommentRow.content).to.equal('New comment');
                    expect(res.body.affectedCommentRow.userId).to.equal(userId);
                    expect(res.body.affectedCommentRow.blogId).to.equal(secondBlogId);
                });
    });

    it("Try to add a comment to a blog post that doesn't exist", () => {
        return agent
        .post('/commentBlog')
            .send({blogId: -1, comment: 'New comment'})
                .then(res => {
                    expect(res).to.have.status(404);
                });
    });

    it('Try to add a comment to a blog post when not logged in', () => {
        return agent
        .get('/logout')
        .then(() => {
            return agent
            .post('/commentBlog')
            .send({blogId: secondBlogId, comment: 'New comment'})
                .then(res => {
                    expect(res).to.have.status(403);
                });
        });
    });

});