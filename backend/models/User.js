module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2],
                    msg: 'Firstname must be 2 or more characters in length.'
                }
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2],
                    msg: 'Lastname must be 2 or more characters in length.'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    args: [true],
                    msg: 'Email format is incorrect. It must be in a format similar to example@email.com'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8],
                    msg: 'Password must be 8 or more characters in length.'
                }
            }
        }
    });

    User.associate = (models) => {
        models.Blog.belongsTo(User, {foreignKey: 'userId'});
        models.Comments.belongsTo(User, {foreignKey: 'userId'});
    }

    return User;
}