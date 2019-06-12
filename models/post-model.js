module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PostData', {
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        owner_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        posted_by_username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        likes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        comments: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}