import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
    static associate(models) {

    }


    static async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
}

export default (sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        gid: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userType: {
            type: DataTypes.ENUM('admin', 'writer', 'subscriber'),
            defaultValue: 'subscriber',
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
            beforeUpdate: async (user) => {
                if (user.password && user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        }
    });

    return User;
};
