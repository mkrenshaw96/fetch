module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PostData', {
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        posted_by_username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comments: {
            type: DataTypes.STRING,
            allowNull: true
        },
        caption: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_location: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}