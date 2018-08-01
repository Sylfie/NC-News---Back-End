const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, updateArticleById } = require('../controllers/articlesC');

articlesRouter.route('/').get(getAllArticles);

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .put(updateArticleById);

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)


module.exports = articlesRouter;