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
    let userEmail = 'darcysmith@mygmail.com';
    let userPassword = 'myPassword';

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
                expect(res.body).to.equal('Darcy');
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

    it('Try connect to session while logged out', () => {
        return agent
            .get('/checkSession')
            .then((res) => {
                expect(res).to.have.status(404);
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
                expect(res.body).to.equal(firstname);
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
                        blurb: 'This is the body of the blog post.'
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
    let firstBlogBlurb = 'This is the blurb of the blog post.';
    let secondBlogTitle = 'Second';
    let secondBlogBlurb = 'Second blurb.';
    let thirdBlogTitle = 'Third';
    let thirdBlogBlurb = 'Third blurb';
    let firstBlogId = '';
    let secondBlogId = '';
    let thirdBlogId = '';

    it('Create 3 blog posts', () => {
        return agent
            .post('/createBlog')
            .send({
                title: firstBlogTitle,
                blurb: firstBlogBlurb
            })
            .then((res) => {
                expect(res).to.have.status(201);
                firstBlogId = res.body.blogId;
                return agent
                    .post('/createBlog')
                    .send({
                        title: secondBlogTitle,
                        blurb: secondBlogBlurb
                    })
                    .then((res) => {
                        expect(res).to.have.status(201);
                        secondBlogId = res.body.blogId;
                        return agent
                            .post('/createBlog')
                            .send({
                                title: thirdBlogTitle,
                                blurb: thirdBlogBlurb
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
                expect(res.body[0].blurb).to.equal(thirdBlogBlurb);
                expect(res.body[1].title).to.equal(secondBlogTitle);
                expect(res.body[1].blurb).to.equal(secondBlogBlurb);
                expect(res.body[2].title).to.equal(firstBlogTitle);
                expect(res.body[2].blurb).to.equal(firstBlogBlurb);
            })
    });

    it('View a single post', () => {
        return agent
            .get('/blog/' + thirdBlogId)
            .then((res) => {
                expect(res).to.to.status(200);
                expect(res).to.be.json;
                expect(res.body.title).to.equal(thirdBlogTitle);
                expect(res.body.blurb).to.equal(thirdBlogBlurb);
                expect(res.body.user.firstname).to.equal(firstname);
                expect(res.body.user.lastname).to.equal(lastname);
            });
    });

    it('View a single post with incorrect blogId', () => {
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
                expect(res.body).to.equal(firstname);
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

});