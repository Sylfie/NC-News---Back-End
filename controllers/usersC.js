const { getAll, getOneByParams, updateById } = require('../utils/controllerTemplates.js');
const { User } = require('../models');

const getAllUsers = (req, res, next) => {
    getAll(User).then(users => {
        users ? res.send(users) : next({ status: 404, msg: "Items not found" });
    })
        .catch(err => console.log(err.name));
};

const getUserByUsername = (req, res, next) => {
    let username = { username: req.params.username };
    getOneByParams(User, username)
        .then(user => {
            user ? res.send(user) : next({ status: 404, msg: "Item not found" });
        })
        .catch(err => console.log(err)) //next bloc!
};



module.exports = { getAllUsers, getUserByUsername };