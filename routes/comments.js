const commentsRouter = require('express').Router();
const { getAllComments, getCommentById, updateCommentById, deleteCommentById } = require('../controllers/commentsC');

commentsRouter.route('/').get(getAllComments);

commentsRouter.route('/:id')
    .get(getCommentById) //optional
    .put(updateCommentById)
    .delete(deleteCommentById)


module.exports = commentsRouter;