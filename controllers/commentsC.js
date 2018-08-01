const { Comment } = require('../models');

const getAllComments = (req, res, next) => {
    res.status(200).send({ message: 'GETTING ALL Comments' })
    // Comment.find()
};

const getCommentById = (req, res, next) => {
    return;
}; //optional

const updateCommentById = (req, res, next) => {
    return;
};

const deleteCommentById = (req, res, next) => {
    return;
};

module.exports = { getAllComments, getCommentById, updateCommentById, deleteCommentById };