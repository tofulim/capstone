const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);
db.Playlist = require('./playlist')(sequelize, Sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Board = require('./board')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.User.hasMany(db.Board);
db.Board.belongsTo(db.User);
db.Board.belongsToMany(db.Hashtag, { through : 'BoardHashtag'});
db.Hashtag.belongsToMany(db.Board, { through : 'BoardHashtag'});

module.exports = db;
