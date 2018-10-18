module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1],
                    msg: 'Comment must be between 1 and 2500 characters.'
                }
            }
        }
    });

    Comments.associate = (models) => {
        models.Blog.hasMany(Comments, {foreignKey: 'blogId'});
        models.User.hasMany(Comments, {foreignKey: 'userId'});
    }

    return Comments;
}