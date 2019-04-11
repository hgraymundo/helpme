var Sequelize = require("sequelize");
var sequelize = new Sequelize('6H0rGKVAeP', '6H0rGKVAeP', 'f93vwsCH60', {
  host: 'remotemysql.com',
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: true
  },
  timezone: '-06:00'
});
var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
//
db.account  = require('./account.js')(sequelize, Sequelize);
db.user  = require('./user.js')(sequelize, Sequelize);
db.alert  = require('./alert.js')(sequelize, Sequelize); 

//
db.user.hasMany(db.alert, { foreignKey: 'user_id', sourceKey: 'uuid'});
db.alert.belongsTo(db.user, { foreignKey: 'user_id', targetKey: 'uuid'});

module.exports = db;
