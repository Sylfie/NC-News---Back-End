const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models')
const { formatArticleData, formatCommentData, generateReferenceObject } = require('../utils');

const seedDB = ({ articleData, commentData, topicData, userData }) => {
    return mongoose.connection.dropDatabase()
        .then(() => {
            //ORDER OF SEEDING: 1. users & topics, 2. articles, 3. comments
            return Promise.all([
                Topic.insertMany(topicData),
                User.insertMany(userData)
            ])
        })
        .then(([topicDocs, userDocs]) => {
            console.log(`Inserted ${topicDocs.length} topics and ${userDocs.length} users`)
            return Promise.all([Article.insertMany(formatArticleData(articleData, userDocs)), userDocs]);
        })
        .then(([articleDocs, userDocs]) => {
            console.log(`Inserted ${articleDocs.length} articles`)
            return Comment.insertMany(formatCommentData(commentData, userDocs, articleDocs));
        })
        .then(commentDocs => console.log(`Inserted ${commentDocs.length} comments`))
        .catch(err => console.log(err)); //remember next!?
}

module.exports = seedDB;