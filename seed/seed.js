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
            return Promise.all([Article.insertMany(formatArticleData(articleData, userDocs)), topicDocs, userDocs]);
        })
        .then(([articleDocs, topicDocs, userDocs]) => {
            return Promise.all([Comment.insertMany(formatCommentData(commentData, userDocs, articleDocs)), articleDocs, topicDocs, userDocs])
        })
        .then(([commentDocs, articleDocs, topicDocs, userDocs]) => {
            console.log(`Inserted ${commentDocs.length} comments, ${articleDocs.length} articles, ${topicDocs.length} topics and ${userDocs.length} users`)
            return [commentDocs, articleDocs, topicDocs, userDocs];
        })
        .catch(err => console.log(err)); //remember next!?
}

module.exports = seedDB;