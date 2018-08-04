const { getAll, getOneByParams, getItemsByParams, postItemByParams, updateVoteById } = require('../utils/controllerTemplates.js');
const { Article, Comment } = require('../models');

const getAllArticles = (req, res, next) => {
    getAll(Article).then(articles => {
        articles ? res.send({ articles }) : next({ status: 404, msg: "Items not found" });
    })
        .catch(err => next(err));
};

const getArticleById = (req, res, next) => {
    let id = { _id: req.params.id };
    getOneByParams(Article, id)
        .then(article => {
            (article === undefined || article === null) ? next({ status: 404, message: "Error: Article not found" }) : res.send({ article });
        })
        .catch(err => err.name === 'CastError' ? next({ status: 400, message: "Error: Invalid user id!" }) : next(err));
};

const getCommentsByArticleId = (req, res, next) => {
    let id = { _id: req.params.id };
    getItemsByParams(Comment, id)
        .then(comments => {
            if (comments === undefined || comments.length === 0) {
                throw { status: 404, message: "Error: No comments found" };
            } else if (comments.length > 0) {
                res.send({ comments });
            }
        })
        .catch(err => err.name === "CastError" ? next({ status: 400, message: "Error: Bad server request" }) : next(err));

};

const postCommentByArticleId = (req, res, next) => {
    let id = { _id: req.params.id }
    return Article.findOne(id)
        .then(article => {
            if (article === null) throw { status: 404, message: "Error: No article found" };
            const { body } = req;
            return postItemByParams(Comment, id, body)
        })
        .then(newComment => {
            if (newComment) res.status(201).send({ message: `Sucessfully added a new comment to article with ID of ${newComment.belongs_to}`, comment: newComment })
        })
        .catch(err => (err.name === "ValidationError" || err.name === "CastError") ? next({ status: 400, message: "Error: Bad server request" }) : next(err));
};

//update article votecount by id:
const updateArticleById = (req, res, next) => {
    let id = { _id: req.params.id };
    let { vote } = req.query;
    return updateVoteById(Article, id, vote)
        .then(updatedArticle => (updatedArticle !== null && updatedArticle !== undefined) ? res.status(200).send({ message: `successfully updated the votes of article with ID of ${id._id}`, article: updatedArticle }) : next({ status: 404, message: "Error: Article not found" }))
        .catch(err => err.name === "CastError" ? next({ status: 400, message: "Error: Bad server request" }) : next(err));
};

module.exports = { getAllArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, updateArticleById };