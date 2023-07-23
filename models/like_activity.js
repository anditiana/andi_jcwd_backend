'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like_activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // blog.hasMany(like_activity, { foreignKey: 'blog_id' });
      // like_activity.belongsTo(models.blog, { foreignKey: 'blog_id' });
      // like_activity.belongsTo(models.account, { foreignKey: 'user_id' });
      like_activity.belongsTo(models.account);
      like_activity.belongsTo(models.blog);
    }
  }
  like_activity.init({
  }, {
    sequelize,
    modelName: 'like_activity',
    freezeTableName: true,
    timestamps : false
  });
  like_activity.removeAttribute('id');
  return like_activity;
};