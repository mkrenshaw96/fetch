module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
        postUrl: {
            type: DataTypes.STRING
        },
        likes: {
            type: DataTypes.INTEGER
        },
        caption: {
            type: DataTypes.STRING
        },
        postedFromLocation: {
            type: DataTypes.STRING
        }
    })

    post.associate = (models) => {
        post.belongsTo(models.User, {
            foreignKey: 'userId'
        })
        post.hasMany(models.Comments, {
            as: 'comments',
            foreignKey: 'postId'
        })
        post.hasMany(models.Likes, {
            as: 'like',
            foreignKey: 'postId'
        })
    }
    return post;
}