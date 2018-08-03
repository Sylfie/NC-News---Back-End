const { getAll, getOneByParams, updateVoteById, deleteById } = require('../utils/controllerTemplates.js');
const { Comment } = require('../models');

const getAllComments = (req, res, next) => {
    getAll(Comment).then(comments => {
        comments ? res.send(comments) : next({ status: 404, msg: "Items not found" });
    })
        .catch(err => console.log(err.name));
};

const getCommentById = (req, res, next) => {
    return;
}; //optional

const updateCommentById = (req, res, next) => {
    let id = { _id: req.params.id };
    let { vote } = req.query;
    console.log(id)
    return updateVoteById(Comment, id, vote)
        .then(updatedComment => {
            res.status(200).send({ msg: `successfully updated the votes of comment ${id._id}`, comment: updatedComment })
        })
        .catch(err => console.log(err))
    //updates successfully but cnsecutive votes do not increase, reseed?
};

const deleteCommentById = (req, res, next) => {
    let id = { _id: req.params.id };
    return deleteById(Comment, id)
        .then(removed => {
            removed === null ? res.status(200).send({ msg: `successfully deleted comment ${id._id}` }) : next({ status: 500, msg: "Ineternal server error" })
        })
        .catch(err => console.log(err))
    //message to be changed
    //if a comment is already deleted, does it default to null?

};

module.exports = { getAllComments, getCommentById, updateCommentById, deleteCommentById };