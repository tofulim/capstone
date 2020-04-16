module.exports = (sequelize, DataTypes) => {
  return sequelize.define('playlist', {
    id : {
      type : DataTypes.STRING(30),
      allowNull : false,
    },
    artist: {
      type : DataTypes.STRING(30),
      allowNull : false,
    },
    title: {
      type : DataTypes.STRING(80),
      allowNull : false,
    },
    vid:{
      type : DataTypes.STRING(20),
      primaryKey : true,
    },
    official_flag:{
      type : DataTypes.STRING(1),
    },
    thumbNail:{
      type: DataTypes.STRING(50),
    },
  }, {
    timestamps : true, // true -> createdAt, updatedAt column
  })
};
