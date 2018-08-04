process.env.NODE_ENV = 'test';
const seedDB = require('../seed/seed');
const data = require('../seed/testData');
// const DB_URL = require('../config/config');
const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const { expect } = require('chai');

describe('/api', () => {
    //WARNING! describe block for each route (besides topics because its first) has a beforeEach hook error which might have to do with beforeEach's default async timeout. If all tests are run, it will break, if it's run with .only, it works fine
    describe('/topics', () => {
        let comments, articles, topics, users;
        beforeEach(() => {
            return seedDB(data)
                .then(docs => {
                    comments = docs[0];
                    articles = docs[1];
                    topics = docs[2];
                    users = docs[3];
                })
        });
        after(() => {
            mongoose.disconnect()
        });
        it('GET /topics - returns all topics and status 200', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('topics');
                    expect(res.body.topics[0]).to.be.an("object");
                    expect(res.body.topics[0]).to.have.all.keys('_id', 'title', 'slug', '__v');
                });
        });
        //404 and harsh reality for all imaginary collections
        it('GET /nessie - return an error message and 404 when a collection does not exist', () => {
            return request
                .get('/api/nessie')
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.key('message');
                    expect(res.body.message).to.equal("Path not found");
                })
        });
        //get all articles by topic slug
        it('GET /topics/:topics_slug/articles - returns all articles from a topic based on topic slug and status 200', () => {
            return request
                .get('/api/topics/mitch/articles')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('articles');
                    expect(res.body.articles[0]).to.be.an("object");
                    expect(res.body.articles[0]).to.have.all.keys('_id', 'title', 'votes', 'created_by', 'created_at', 'belongs_to', '__v', 'body');
                });
        });
        it('GET /topics/:topics_slug/articles - returns an error message and status 404 when a slug is not found', () => {
            return request
                .get('/api/topics/pink_fluffy_unicorns/articles')
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.key('message');
                    expect(res.body.message).to.equal("No such topic slug found");
                })
        });
        //post article by topic slug
        it('POST /topics/:topics_slug/articles - returns all articles from a topic based on topic slug and status 201', () => {
            const body = {
                "title": "Entitled to put a title when you earn a title",
                "body": "Achievement earned: Posting and Hosting",
                "created_by": "5b64816a0318403e159e7db8"
            }
            return request
                .post('/api/topics/mitch/articles')
                .send(body)
                .expect(201)
                .then(res => {
                    expect(res.body).to.have.all.keys('message', 'article');
                    expect(res.body.article).to.be.an("object");
                    expect(res.body.article).to.have.all.keys('_id', 'title', 'votes', 'created_by', 'created_at', 'belongs_to', '__v', 'body');
                });
        });
        // 404 for no topic slug 
        it('POST /topics/:topics_slug/articles - returns an error when a topic slug is not found and status 404', () => {
            const body = {
                "title": "Entitled to put a title when you earn a title",
                "body": "Achievement earned: Posting and Hosting",
                "created_by": "5b64816a0318403e159e7db8"
            }
            return request
                .post('/api/topics/pikachu/articles')
                .send(body)
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.message).to.equal("No matching topic found");
                });
        });
        // 400 for bad request - input
        it('POST /topics/:topics_slug/articles - returns an error when a topic slug is found but req.body is violating rulesets, status 400', () => {
            const body = {
                "title": "Entitled to put a title when you earn a title",
                "body": "Achievement earned: Posting and Hosting",
                "created_by": "blah-blah"
            }
            return request
                .post('/api/topics/mitch/articles')
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.message).to.equal("Error: Bad server request");
                });
        });
    });
    describe('users', () => {
        let comments, articles, topics, users;
        beforeEach(() => {
            return seedDB(data)
                .then(docs => {
                    comments = docs[0];
                    articles = docs[1];
                    topics = docs[2];
                    users = docs[3];
                })
        });
        after(() => {
            mongoose.disconnect()
        });
        // all users:
        it('GET /users - returns all topics and status 200', () => {
            return request
                .get('/api/users')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('users');
                    expect(res.body.users[0]).to.be.an("object");
                    expect(res.body.users[0]).to.have.all.keys('_id', 'username', 'name', 'avatar_url', '__v')
                });
        });
        //get user by uname:
        it('GET /users/:username - returns all users and status 200', () => {
            return request
                .get('/api/users/dedekind561')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('user');
                    expect(res.body.user).to.be.an("object");
                    expect(res.body.user).to.have.all.keys('_id', 'username', 'name', 'avatar_url', '__v');
                    expect(res.body.user.name).to.equal('mitch');

                });
        });
        //404 for existing users collection but no user match
        it('GET /users/:username - returns an error when a user is not found by username and a 404 status', () => {
            return request
                .get('/api/users/tooth_fairy')
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body).to.be.an("object");
                    expect(res.body.message).to.be.a('string');
                    expect(res.body.message).to.equal('Error: user not found');
                });
        });
        //400 for existing user but bad users path  
        it('GET /users/:username - returns an error when a username is correct but the path is wrong, status 404', () => {
            return request
                .get('/api/topics/dedekind561')
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body).to.be.an("object");
                    expect(res.body.message).to.be.a('string');
                    expect(res.body.message).to.equal('Path not found');
                });
        });
    });
    describe('articles', () => {
        beforeEach(() => {
            let comments, articles, topics, users;
            return seedDB(data)
                .then(docs => {
                    comments = docs[0];
                    articles = docs[1];
                    topics = docs[2];
                    users = docs[3];
                })
        });
        after(() => {
            mongoose.disconnect()
        });
        // all articles:
        it('GET /articles - returns all articles and status 200', () => {
            return request
                .get('/api/articles')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('articles');
                    expect(res.body.articles[0]).to.be.an("object");
                    expect(res.body.articles[0]).to.have.all.keys('_id', 'votes', 'body', 'created_at', 'created_by', 'belongs_to', 'title', '__v')
                });
        });
        //get article by id:
        it('GET /articles/:id - returns an article requested with a valid id and status 200', () => {
            return request
                .get(`/api/articles/${articles[0]._id}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('article');
                    expect(res.body.article).to.be.an("object");
                    expect(res.body.article).to.have.all.keys('_id', 'votes', 'body', 'created_at', 'created_by', 'belongs_to', 'title', '__v');
                    expect(res.body.article.body).to.be.a('string');
                    expect(res.body.article.body).to.equal('I find this existence challenging');
                });
        });
        //404 for valid id but no match found
        it('GET /articles/:id - returns an error when a valid id is passed but there is no match, status 404', () => {
            return request
                .get(`/api/articles/5b64816a0318403e159e7db8`)
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.all.keys('message')
                    expect(res.body).to.be.an("object");
                    expect(res.body.message).to.be.a('string');
                    expect(res.body.message).to.equal("Error: Article not found");
                });
        });
        //400 when id is invalid as input
        it('GET /articles/:id - returns an error when an invalid id is passed, status 400', () => {
            return request
                .get(`/api/articles/yabadabadoo`)
                .expect(400)
                .then(res => {
                    expect(res.body).to.have.all.keys('message')
                    expect(res.body).to.be.an("object");
                    expect(res.body.message).to.be.a('string');
                    expect(res.body.message).to.equal("Error: Invalid user id!");
                });
        });
        //get all comments by article id:
        it('GET /articles/:id/comments - returns all comments belonging to the article with specified id, status 200', () => {
            return request
                .get(`/api/articles/${articles[0]._id}/comments`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('comments')
                    expect(res.body.comments[0]).to.be.an("object");
                    expect(res.body.comments[0]).to.contain.all.keys('_id', 'votes', 'body', 'created_at', 'created_by', 'belongs_to', '__v');
                });
        });
        //404 when no article is found
        it('GET /articles/:id/comments - returns an error when a valid id is passed but there is no match, status 404', () => {
            return request
                .get(`/api/articles/5b64816a0318403e159e7db8/comments`)
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.all.keys('message')
                    expect(res.body).to.be.an("object");
                    expect(res.body.message).to.be.a('string');
                    expect(res.body.message).to.equal("Error: No comments found");
                });
        });
        //404 for random value of id
        it('GET /articles/:id/comments - returns an error when an invalid id is passed, status 400', () => {
            return request
                .get(`/api/articles/${'wrong'}/comments`)
                .expect(400)
                .then(res => {
                    expect(res.body).to.have.all.keys('message')
                    expect(res.body).to.be.an("object");
                    expect(res.body.message).to.be.a('string');
                    expect(res.body.message).to.equal("Error: Bad server request");
                });
        });
        //post comment by article id:
        it('POST /articles/:id/comments - post a new comment to an existing article, status 201', () => {
            const body = {
                "body": "I can speak JAVA(script)NESE",
                "created_by": "5b64816a0318403e159e7db8"
            }
            return request
                .post(`/api/articles/${articles[0]._id}/comments`)
                .send(body)
                .expect(201)
                .then(res => {
                    expect(res.body).to.have.all.keys('message', 'comment');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.comment).to.have.all.keys('_id', 'votes', 'body', 'created_at', 'created_by', 'belongs_to', '__v');
                });
        });
        //404 when id input is valid but there is no article match
        it('POST /articles/:id/comments - returns an error when the article does not exist, status 404', () => {
            const body = {
                "body": "I can speak JAVA(script)NESE",
                "created_by": "5b64816a0318403e159e7db8"
            }
            return request
                .post('/api/articles/5b64816a0318403e159e7db8/comments')
                .send(body)
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.message).to.equal("Error: No article found");
                });
        });
        //400 when invalid input is passed
        it('POST /articles/:id/comments - returns an error when invalid input is passed, status 400', () => {
            const body = {
                "body": "I can speak JAVA(script)NESE",
                "created_by": undefined
            }
            return request
                .post(`/api/articles/${articles[0]._id}/comments`)
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.message).to.equal("Error: Bad server request");
                });
        });
        //200 updates votes successfully after a vote query
        it('PUT /articles/:id?vote=up - successfully updates votecounts by one depending on query', () => {
            const originalVote = articles[0].votes;
            return request
                .put(`/api/articles/${articles[0]._id}?vote=up`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('message', 'article');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.article).to.have.all.keys('_id', 'votes', 'title', 'body', 'created_at', 'created_by', 'belongs_to', '__v');
                    expect(res.body.article.votes).to.not.equal(originalVote);
                });
        });
        //200 does not update votecount when passed an invalid value, original value is kept
        it('PUT /articles/:id?vote=peanuts - does not update votes when query input is invalid', () => {
            const originalVote = articles[0].votes;
            return request
                .put(`/api/articles/${articles[0]._id}?vote=peanuts`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('message', 'article');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.article).to.have.all.keys('_id', 'votes', 'title', 'body', 'created_at', 'created_by', 'belongs_to', '__v');
                    expect(res.body.article.votes).to.equal(originalVote);
                });
        });
    });
    describe('comments', () => {
        //get all comments:
        let comments, articles, topics, users;
        beforeEach(() => {
            return seedDB(data)
                .then(docs => {
                    comments = docs[0];
                    articles = docs[1];
                    topics = docs[2];
                    users = docs[3];
                })
        });
        after(() => {
            mongoose.disconnect()
        });
        // 200 all articles:
        it('GET /comments - returns all comments and status 200', () => {
            return request
                .get('/api/comments')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('comments');
                    expect(res.body.comments[0]).to.be.an("object");
                    expect(res.body.comments[0]).to.have.all.keys('_id', 'votes', 'body', 'created_at', 'created_by', 'belongs_to', '__v');
                });
        });
        // 200 update comment votecount by id:
        it('PUT /comments/:id?vote=up - successfully updates votecounts by one depending on query, status 200', () => {
            const originalVote = comments[0].votes;
            return request
                .put(`/api/comments/${comments[0]._id}?vote=up`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('message', 'comment');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.comment).to.have.all.keys('_id', 'votes', 'body', 'created_at', 'created_by', 'belongs_to', '__v');
                    expect(res.body.comment.votes).to.not.equal(originalVote);
                });
        });
        //200 does not update votecount when passed an invalid value, original value is kept
        it('PUT /comments/:id?vote=peanuts - does not update votes when query input is invalid, status 200', () => {
            const originalVote = comments[0].votes;
            return request
                .put(`/api/comments/${comments[0]._id}?vote=peanuts`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('message', 'comment');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.comment).to.have.all.keys('_id', 'votes', 'body', 'created_at', 'created_by', 'belongs_to', '__v');
                    expect(res.body.comment.votes).to.equal(originalVote);
                });
        });
        // delete comment:
        it('DELETE /comments/:id - deletes a comment by id, status 200', () => {
            return request
                .delete(`/api/comments/${comments[0]._id}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('message', 'removed_comment');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.removed_comment).to.have.all.keys('_id', 'votes', 'body', 'created_at', 'created_by', 'belongs_to', '__v');
                });
        });
        //404 valid id but comment doesn't exist
        it('DELETE /comments/:id - returns an error when id is valid input but it does not exist, status 404', () => {
            return request
                .delete(`/api/comments/5b64816a0318403e159e7dd0`)
                .expect(404)
                .then(res => {
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.message).to.equal("Error: Comment not found");
                });
        });
        //checking last resort 500 for invalid input which is not classed as CastError
        it('DELETE /comments/:id - returns an error when id violates id rulesets, status 500', () => {
            return request
                .delete(`/api/comments/idwannabe`)
                .expect(500)
                .then(res => {
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.be.a("string");
                    expect(res.body.message).to.equal("Internal server error");
                });
        });
    });
});
