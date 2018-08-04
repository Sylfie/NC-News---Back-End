const getAll = (Model) => {
    return Model.find()
        .then(allItems => allItems)

};

const getOneByParams = (Model, parameter) => {
    if (parameter.hasOwnProperty('_id')) {
        return Model.findOne(parameter)
            .then(item => item)
    } else if (parameter.hasOwnProperty('username')) {
        return Model.findOne(parameter)
            .then(item => item)
    }
};

const getItemsByParams = (Model, parameter) => {
    if (parameter.hasOwnProperty('_id')) {
        return Model.find({ belongs_to: parameter._id })
            .then(list => list)
    } else if (parameter.hasOwnProperty('topic_slug')) {
        return Model.find({ belongs_to: parameter.topic_slug })
            .then(list => list)
    }

};

const postItemByParams = (Model, parameter, item) => {
    if (parameter.hasOwnProperty('_id')) {
        return new Model({ ...item, belongs_to: parameter._id, }).save()
            .then(item => item)
    } else if (parameter.hasOwnProperty('topic_slug')) {
        return new Model({ ...item, belongs_to: parameter.topic_slug, }).save()
            .then(item => item)
    }
};

const updateVoteById = (Model, parameter, vote) => {
    const voteCount = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;
    const update = { $inc: { votes: voteCount } }
    return Model.findByIdAndUpdate(parameter, update, { new: true })
        .then(item => item)
};

const deleteById = (Model, parameter) => {
    return Model.findByIdAndRemove(parameter)
        .then(removed => removed)
};

module.exports = { getAll, getOneByParams, getItemsByParams, postItemByParams, updateVoteById, deleteById };