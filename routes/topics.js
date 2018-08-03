const topicsRouter = require('express').Router();
const { getAllTopics, getArticlesByTopicSlug, postArticlesByTopicSlug } = require('../controllers/topicsC');

topicsRouter.route('/').get(getAllTopics);

topicsRouter.route('/:topic_slug/articles')
    .get(getArticlesByTopicSlug)
    .post(postArticlesByTopicSlug);

module.exports = topicsRouter;