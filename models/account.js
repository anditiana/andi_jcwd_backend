'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account.hasMany(models.blog);
      account.hasMany(models.like_activity);
      // account.hasMany(models.like_activity,{ foreignKey: 'user_id' });
      // account.hasMany(models.like_activity);
    }
  }
  account.init({
    username: {
      type : DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    email: {
      type : DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    phone: {
      type : DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    password: {
      type : DataTypes.STRING,
      allowNull:false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    imgURL: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'account',
    freezeTableName: true
  });
  return account;
};