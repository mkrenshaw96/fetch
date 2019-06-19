module.exports = (sequelize, DataTypes) => {
    const following = sequelize.define('following', {
        followingUserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    following.associate = (models) => {
        following.belongsTo(models.User, {
            foreignKey: 'userId'
        })
    }
    return following
}