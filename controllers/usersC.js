const { User } = require('../models');

const getAllUsers = (req, res, next) => {
    res.status(200).send({ message: 'GETTING ALL Topics' })
    // Comment.find()
};

const getUserByUsername = (req, res, next) => {
    return;
}; //optional



module.exports = { getAllUsers, getUserByUsername };