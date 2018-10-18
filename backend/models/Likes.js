module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define('Likes', {});

    Likes.associate = (models) => {
        models.User.hasMany(Likes, {foreignKey: 'userId'});
        models.Blog.hasMany(Likes, {
            foreignKey: 'blogId',
            onDelete: 'cascade',
            hooks: true
        });
    }

    return Likes;
}