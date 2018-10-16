module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {type: DataTypes.STRING, unique: true},
        password: DataTypes.STRING
    });

    return User;
}