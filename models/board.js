module.exports = (sequelize, DataTypes) => {
  return sequelize.define('board', {
    number : {
      type : DataTypes.INTEGER,
      allowNull : false,
      primaryKey : true,
      autoIncrement : true,
    },
    text : {
      type : DataTypes.STRING(140),
      allowNull : false,
    },
    img : {
      type : DataTypes.STRING(200),
      allowNull : false,
    },
  }, {
    timestamps : true, // true -> createdAt, updatedAt column생성
  })
};
