module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstname: {
            type: DataTypes.STRING,
            notNull: true,
            len: [2, 200]
        },
        lastname: {
            type: DataTypes.STRING,
            notNull: true,
            len: [2, 200]
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true
        },
        password: {
            type: DataTypes.STRING,
            len: [2, 200]
        }
    });

    // Associated both ways so can get user from blog, and blog from user
    User.associate = (models) => {
        models.Blog.belongsTo(User, {foreignKey: 'userId'});
        models.Comments.belongsTo(User, {foreignKey: 'userId'});
    }

    return User;
}