const { getAll, getOneByParams, getItemsByParams, postItemByParams, updateVoteById } = require('../utils/controllerTemplates.js');
const { Article, Comment } = require('../models');

const getAllArticles = (req, res, next) => {
    getAll(Article).then(articles => {
        articles ? res.send(articles) : next({ status: 404, msg: "Items not found" });
    })
        .catch(err => console.log(err.name)) //next bloc!
};

const getArticleById = (req, res, next) => {
    let id = { _id: req.params.id };
    getOneByParams(Article, id)
        .then(article => {
            article ? res.send(article) : next({ status: 404, msg: "Item not found" });
        })
        .catch(err => console.log(err)) //next block!
};

const getCommentsByArticleId = (req, res, next) => {
    let id = { _id: req.params.id };
    getItemsByParams(Comment, id)
        .then(comments => {
            console.log(comments)
            if (comments === undefined || comments.length === 0) {
                next({ status: 404, msg: "Items not found" });
            } else if (comments.length > 0) {
                res.send(comments);
            }
        })
        .catch(err => console.log(err)) //next block!
};

const postCommentByArticleId = (req, res, next) => {
    let id = { _id: req.params.id }
    return Article.findOne(id)
        .then(article => {
            if (article === null) throw { status: 404, msg: "No article found" };
            const { body } = req;
            return postItemByParams(Comment, id, body)
        })
        .then(newComment => {
            if (newComment) res.status(201).send({ msg: `Sucessfully added a new comment to article with ID of ${newComment.belongs_to}`, comment: newComment })
        })
        .catch(err => console.log(err))
};

//add a new comment to an article
const updateArticleById = (req, res, next) => {
    let id = { _id: req.params.id };
    let { vote } = req.query;
    return updateVoteById(Article, id, vote)
        .then(updatedArticle => {
            res.status(200).send({ msg: `successfully updated the votes of article with ID of ${id._id}`, article: updatedArticle })
        })
        .catch(err => console.log(err))
};

module.exports = { getAllArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, updateArticleById };