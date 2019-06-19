module.exports = (sequelize, DataTypes) => {
    const likes = sequelize.define('likes', {

    });
    likes.associate = (models) => {
        likes.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        likes.belongsTo(models.Post, {
            foreignKey: 'postId'
        })
    }
    return likes;
}