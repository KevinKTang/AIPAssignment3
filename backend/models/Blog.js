module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define('Blog', {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        content: DataTypes.JSON,
        likesCount: DataTypes.INTEGER,
        commentCount: DataTypes.INTEGER
    });

    // Associated both ways so can get user from blog, and blog from user
    Blog.associate = (models) => {
        models.User.hasMany(Blog, {foreignKey: 'userId'});
    }

    return Blog;
}