module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
        content: DataTypes.STRING
    });

    Comments.associate = (models) => {
        models.Blog.hasMany(Comments, {
            foreignKey: 'blogId',
            onDelete: 'cascade',
            hooks: true
        });
        models.User.hasMany(Comments, {foreignKey: 'userId'});
    }

    return Comments;
}