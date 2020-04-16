module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    nickname : {
      type : DataTypes.STRING(40),
      allowNull : false,
    },
    id : {
      type : DataTypes.STRING(30),
      allowNull : false,
      primaryKey : true,
    },
    provider: {
      type : DataTypes.STRING(10),
      allowNull : false,
      defaultValue : 'local',
    }
  }, {
    timestamps : true, // true -> createdAt, updatedAt column생성
  })
};
