module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define('likes', {});
    return Likes;
}