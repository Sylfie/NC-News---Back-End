# Project 'Northcoders News'

Multistage full-stack project designed to create an api which handles database-server interactions and displays/updates results based on user requests and queries. The database of choice is MongoDB, server-side is handled with Express, hosting for the deployed project is on Heroku. For more information on packages and software used, please see the sections below.

## Getting Started

1. Fork and clone this repo to your own machine.

2. Run 'npm install' in your CLI to fetch all modules.

### Prerequisites 

Please ensure you are using version 10+ of Node.js and 6+ of npm to avoid version incompatibilities.

### Installing

In order to run tests locally or see results in a browser/Postman, make a config folder in your root directory. It should contain a cofig.js which will allow you to swap environments when necessary.

Example: 

    const NODE_ENV = process.env.NODE_ENV || "dev";

    const config = {
        test: {
            DB_URL: 'mongodb://localhost:27017/nc_news_test'
        },
        dev: {
            DB_URL: 'mongodb://localhost:27017/nc_news'
        }
    }

Make sure you also export NODE_ENV as a config object: 

module.exports = config[NODE_ENV];

Default environment will be 'dev', when tests are run with 'npm test', it will automatically switch to 'test'.

## Running the tests

Run 'npm test' in your CLI. This should automatically seed the data for a each test. 

All tests should be working alright, however, there is an issue on some machines where some of the tests might break and show a GET hook error. 
If it does, you can try running each router's describe block with .only separately. For more details on the error, please check the comments in index.spec.js.

### Tests

Tests focus on CRUD and can be split into two sections: getting the right response depending on the request and error handling for each endpoint when things do not work as expected.

* Example 1 (right response, status 200):

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

* Example 2 (error, status 404):

    it('GET /topics/:topics_slug/articles - returns an error message and status 404 when a slug is not found', () => {
        return request
            .get('/api/topics/pink_fluffy_unicorns/articles')
            .expect(404)
            .then(res => {
                expect(res.body).to.have.key('message');
                expect(res.body.message).to.equal("No such topic slug found");
        });
    });

The database is reseeded on each test to ensure values are being checked properly. 

## Deployment

You can find a deployed version of the project [here](https://ncnewsbend.herokuapp.com/api). 

## Built With

* [mocha](https://mochajs.org/), [chai](http://www.chaijs.com/), [supertest](https://www.npmjs.com/package/supertest) - unit tesing.
* [postman](https://www.getpostman.com/), [nodemon](https://nodemon.io/) - dev testing. 
* [body-parser](https://www.npmjs.com/package/body-parser), [express](https://expressjs.com/), [mongoose](http://mongoosejs.com/) - user interactions.
* [mongoDB](https://www.mongodb.com/) - database.
* [heroku](https://dashboard.heroku.com/apps) - deployment. 

* More information about Front-End will be availabe here once its project stage is completed.

## Authors

* **Sylfie** 

## License
This project is part of Northcoders Development Pathway Programme. 

## Acknowledgments
* A big thank you to all the tutors for the guidance and a special thank you to [Lou](https://github.com/louillustrator) for being my second pair of eyes while troubleshooting.
