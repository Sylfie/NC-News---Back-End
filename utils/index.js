const generateReferenceObject = (obj, processedData) => {
    return processedData.find(datum => (datum.username === obj.created_by))._id;
};

const generateReferenceObject2 = (obj, processedData) => {
    return processedData.find(datum => (datum.title === obj.belongs_to))._id;
};

const formatArticleData = (articleData, userDocs) => {
    return articleData.map(articleDatum => {
        return {
            ...articleDatum,
            belongs_to: articleDatum.topic,
            created_by: generateReferenceObject(articleDatum, userDocs)
        };
    });
};

const formatCommentData = (commentData, userDocs, topicDocs) => {
    return commentData.map(commentDatum => {
        return {
            ...commentDatum,
            created_by: generateReferenceObject(commentDatum, userDocs),
            belongs_to: generateReferenceObject2(commentDatum, topicDocs)
        };
    });
};






module.exports = { formatArticleData, formatCommentData, generateReferenceObject };