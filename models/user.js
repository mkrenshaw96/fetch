module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profilePicUrl: {
            type: DataTypes.STRING
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mediaCount: {
            type: DataTypes.INTEGER
        },
        followersCount: {
            type: DataTypes.INTEGER
        },
        followingCount: {
            type: DataTypes.INTEGER
        }
    })
    user.associate = (models) => {
        user.hasMany(models.Following, {
            as: 'following',
            foreignKey: 'userId'
        })
        user.hasMany(models.Post, {
            as: 'post',
            foreignKey: 'userId'
        })
        user.hasMany(models.Comments, {
            as: 'comment',
            foreignKey: 'userId'
        })
        user.hasMany(models.Likes, {
            as: 'likes',
            foreignKey: 'userId'
        })
        // user.hasMany(models.message, {
        //     as: 'message',
        //     foreignKey: 'userId'
        // })
    }
    return user;
}