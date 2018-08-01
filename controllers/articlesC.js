const { Article } = require('../models');

const getAllArticles = (req, res, next) => {
    res.status(200).send({ message: 'GETTING ALL ARTICLES' })
    // Article.find()
};

const getArticleById = (req, res, next) => {
    return;
};

const getCommentsByArticleId = (req, res, next) => {
    return;
};

const postCommentByArticleId = (req, res, next) => {
    return;
};

const updateArticleById = (req, res, next) => {
    return;
};

module.exports = { getAllArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, updateArticleById };