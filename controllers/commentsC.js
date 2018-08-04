const { getAll, getOneByParams, updateVoteById, deleteById } = require('../utils/controllerTemplates.js');
const { Comment } = require('../models');

const getAllComments = (req, res, next) => {
    getAll(Comment).then(comments => {
        comments ? res.send({ comments }) : next({ status: 404, msg: "Items not found" });
    })
        .catch(err => next(err));
};

const getCommentById = (req, res, next) => {
    return;
}; //optional

const updateCommentById = (req, res, next) => {
    let id = { _id: req.params.id };
    let { vote } = req.query;
    return updateVoteById(Comment, id, vote)
        .then(updatedComment => {
            res.status(200).send({ message: `successfully updated the votes of comment ${id._id}`, comment: updatedComment })
        })
        .catch(err => err.name === "CastError" ? next({ status: 400, message: "Error: Bad server request" }) : next(err));
};

const deleteCommentById = (req, res, next) => {
    let id = { _id: req.params.id };
    return deleteById(Comment, id)
        .then(removed => (removed === null || removed == undefined) ? next({ status: 404, message: "Error: Comment not found" }) : res.status(200).send({ message: `successfully deleted comment ${id._id}`, removed_comment: removed }))
        .catch(err => next(err));
};

module.exports = { getAllComments, getCommentById, updateCommentById, deleteCommentById }; 