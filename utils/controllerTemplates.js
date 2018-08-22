const getAll = (Model) => {
    return Model.find()
};

const getOneByParams = (Model, parameter) => {
    return Model.findOne(parameter)
};

const getItemsByParams = (Model, parameter) => {
    return Model.find({ belongs_to: parameter.topic_slug || parameter._id })
};

//to be refactored like above:
const postItemByParams = (Model, parameter, item) => {
    if (parameter.hasOwnProperty('_id')) {
        return new Model({ ...item, belongs_to: parameter._id, }).save()
    } else if (parameter.hasOwnProperty('topic_slug')) {
        return new Model({ ...item, belongs_to: parameter.topic_slug, }).save()
    }
};

const updateVoteById = (Model, parameter, vote) => {
    const voteCount = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;
    const update = { $inc: { votes: voteCount } }
    return Model.findByIdAndUpdate(parameter, update, { new: true })
};

const deleteById = (Model, parameter) => {
    return Model.findByIdAndRemove(parameter)
};

module.exports = { getAll, getOneByParams, getItemsByParams, postItemByParams, updateVoteById, deleteById };