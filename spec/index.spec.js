process.env.NODE_ENV = 'test';
const seedDB = require('../seed/seed');
const data = require('../seed/testData');
// const DB_URL = require('../config/config');
const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const { expect } = require('chai');

describe('/api', () => {
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
        //error handling for get all!????

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
        //optional: 
        // it('GET /topics/:topics_slug/articles - returns an error message and status 404 when a slug is found but there are no articles found', () => { });

        //post article by topic slug
        it('POST /topics/:topics_slug/articles - returns all articles from a topic based on topic slug and status 201', () => {
            return request
                .post('/api/topics/mitch/articles')
                .expect(201)
                .then(res => {
                    expect(res.body).to.have.all.keys('message', 'article');
                    expect(res.body.article).to.be.an("object");
                    expect(res.body.articles[0]).to.have.all.keys('_id', 'title', 'votes', 'created_by', 'created_at', 'belongs_to', '__v', 'body');
                });
        });




        //400?
        // describe('users', () => { });
        // describe('articles', () => { });
        // describe('comments', () => { });

    });
});