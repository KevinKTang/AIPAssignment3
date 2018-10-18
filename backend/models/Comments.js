module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
        content: DataTypes.STRING
    });

    Comments.associate = (models) => {
        models.Blog.hasMany(Comments, {foreignKey: 'blogId'});
        models.User.hasMany(Comments, {foreignKey: 'userId'});
    }

    return Comments;
}