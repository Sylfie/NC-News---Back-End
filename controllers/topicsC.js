const { Topic } = require('../models');

const getAllTopics = (req, res, next) => {
    Topic.find()
        .then(topics => {
            console.log(topics)
            res.status(200).send(topics);
        })
        .catch(next);
};

const getArticlesByTopicSlug = (req, res, next) => {
    return;
}; //optional

const postArticlesByTopicSlug = (req, res, next) => {
    let body = req.body;
    return;
};


module.exports = { getAllTopics, getArticlesByTopicSlug, postArticlesByTopicSlug };