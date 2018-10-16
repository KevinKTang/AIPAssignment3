module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {type: DataTypes.STRING, unique: true},
        password: DataTypes.STRING
    });

    // Associated both ways so can get user from blog, and blog from user
    User.associate = (models) => {
        models.Blog.belongsTo(User, {foreignKey: 'userId'});
        models.Comments.belongsTo(User, {foreignKey: 'userId'});
    }

    return User;
}