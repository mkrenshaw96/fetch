module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comment', {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        commentLikes: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        Comment.belongsTo(models.Post, {
            foreignKey: 'postId'
        })
    }
    return Comment;
}