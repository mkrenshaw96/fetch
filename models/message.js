module.exports = (sequelize, DataTypes) => {
    return sequelize.define('message', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        messagedUserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}