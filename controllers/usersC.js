const { getAll, getOneByParams, updateById } = require('../utils/controllerTemplates.js');
const { User } = require('../models');

const getAllUsers = (req, res, next) => {
    getAll(User).then(users => users ? res.send({ users }) : next({ status: 404, message: "Error: No users found" }))
        .catch(next);
};

const getUserByUsername = (req, res, next) => {
    let username = { username: req.params.username };
    getOneByParams(User, username)
        .then(user => user ? res.send({ user }) : next({ status: 404, message: "Error: user not found" }))
        .catch(err => next(err));
};



module.exports = { getAllUsers, getUserByUsername };