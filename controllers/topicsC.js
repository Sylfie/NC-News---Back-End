const { getAll, getOneByParams, updateById, postItemByParams, getItemsByParams } = require('../utils/controllerTemplates.js');
const { Topic, Article } = require('../models');


const getAllTopics = (req, res, next) => {
    getAll(Topic).then(topics => {
        topics ? res.send({ topics }) : next({ status: 404, msg: "Items not found" });
    })
    //catch block?!??!
};

const getArticlesByTopicSlug = (req, res, next) => {
    let topicSlug = req.params;
    return Topic.find()
        .then(topics => {
            if (topics.find(topic => topic.slug === req.params.topic_slug) === undefined) throw { status: 404, message: "No such topic slug found" };
            return getItemsByParams(Article, topicSlug)
        })
        .then(articles => {
            if (articles === undefined || articles.length === 0) {
                throw { status: 404, message: "Articles not found" };
            } else if (articles.length > 0) {
                res.send({ articles });
            }
        })
        .catch(err => {
            err.name === 'CastError' ? next({ status: 400, msg: 'Error: bad user request' }) : next(err);
        })

};

const postArticlesByTopicSlug = (req, res, next) => {
    //if req.body does not have the necessary keys
    return Topic.findOne({ slug: req.params.topic_slug })
        .then(topic => {
            if (topic === null) throw { status: 404, message: "No topic found" };
            let body = req.body;
            let topicSlug = req.params;
            return postItemByParams(Article, topicSlug, body)
        })
        .then(newArticle => {
            console.log(newArticle)
            if (newArticle) res.status(201).send({ message: `Sucessfully added an article titled ${newArticle.title} to ${newArticle.belongs_to}`, article: newArticle })
        })
        .catch(err => console.log(err))
    //validation error ?!
};


module.exports = { getAllTopics, getArticlesByTopicSlug, postArticlesByTopicSlug };