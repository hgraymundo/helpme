module.exports = function(sequelize, Sequelize) {
// personal
  var alert = sequelize.define('alert', {
    uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    lat: {
        type: Sequelize.STRING,
        notEmpty: false
    },
    lon: {
        type: Sequelize.STRING,
        notEmpty: true,
        notNull: true
    },
    status: {
      type: Sequelize.ENUM('Active', 'In atention', 'Attend'),
      defaultValue: 'Active'
    }
  });
  return alert;
}
