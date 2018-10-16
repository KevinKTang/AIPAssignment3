module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('comments', {
        content: DataTypes.STRING
    });

    return Comments;
}