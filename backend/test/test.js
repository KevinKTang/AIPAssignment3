'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const chaihttp = require('chai-http');

chai.use(chaihttp);

const server = require('../Server.js');
var agent = chai.request.agent(server);

describe('Users', () => {

    let firstname = 'Darcy';
    let lastname = 'Smith';
    let userEmail = 'darcysmith@tgmail.com';
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

describe('Blogs', () => {

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
                        body: 'This is the body of the blog post.'
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

    it('No created blogs to start off with', () => {
        // Login first
        return agent
            .post('/newUser')
            .send({
                firstname: 'firstname18462',
                lastname: 'lastname',
                email: 'user@email.com',
                password: 'userPassword'
            })
            .then(() => {
                return agent
                    .get('/myBlogs')
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.eql([]);
                    });
            });
    });

    let blogTitle = 'Blog Title';
    let blogContent = 'This is the body of the blog post.';
    let createdBlogId = '';

    it('Create a blog', () => {
        return agent
            .post('/createBlog')
            .send({
                title: blogTitle,
                content: blogContent
            })
            .then((res) => {
                expect(res).to.have.status(201);
            });
    });

    it('Retrieve created blog', () => {
        return agent
            .get('/myBlogs')
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body[0].title).to.equal(blogTitle);
                expect(res.body[0].content).to.equal(blogContent);
                createdBlogId = res.body[0].id;
            })
    });

    it('Delete incorrect blog post', () => {
        return agent
            .delete('/deleteBlog')
            .send({
                blogId: 2000
            })
            .then((res) => {
                expect(res).to.have.status(404);
            });
    });

    it('Delete blog post', () => {
        return agent
            .delete('/deleteBlog')
            .send({
                blogId: createdBlogId
            })
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

});