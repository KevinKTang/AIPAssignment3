module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define('blog', {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        content: DataTypes.JSON,
        likesCount: DataTypes.INTEGER,
        commentCount: DataTypes.INTEGER
    });

    return Blog;
}