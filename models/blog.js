'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      blog.belongsTo(models.account);
      blog.belongsTo(models.category, {foreignKey : 'category_id'});
      blog.hasMany(models.like_activity);
      // blog.hasMany(models.like_activity, { foreignKey: 'blog_id' });
      // blog.hasMany(models.like_activity);
    }
  }
  blog.init({
    blog_id :{
      type: DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement: true
    },
    title :{type: DataTypes.STRING, allowNull:false},
    imgURL :{type: DataTypes.STRING, allowNull:false},
    vidURL :{type: DataTypes.STRING},
    content :{type: DataTypes.STRING(500), allowNull:false},
    keywords :{type: DataTypes.STRING, allowNull:false},
    country :{type: DataTypes.STRING, allowNull:false}
  }, {
    sequelize,
    modelName: 'blog',
    freezeTableName: true
  });
  return blog;
};