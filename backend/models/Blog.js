module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define('Blog', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 120],
                    msg: 'Blog title must be between 1 and 120 characters.'
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 120],
                    msg: 'Blog description must be between 1 and 250 characters.'
                }
            }
        },
        content: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                len: {
                    args: [1],
                    msg: 'Blog body must not be empty.'
                }
            }
        },
        likesCount: DataTypes.INTEGER,
        commentCount: DataTypes.INTEGER
    });

    Blog.associate = (models) => {
        models.User.hasMany(Blog, {foreignKey: 'userId'});
    }

    return Blog;
}