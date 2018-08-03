const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, updateArticleById } = require('../controllers/articlesC');

articlesRouter.route('/').get(getAllArticles);

articlesRouter.route('/:id')
    .get(getArticleById)  //done
    .put(updateArticleById);

articlesRouter.route('/:id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)


module.exports = articlesRouter;