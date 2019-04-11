var bcrypt = require('bcryptjs');

module.exports = function(sequelize, Sequelize) {
// personal
  var user = sequelize.define('user', {
    uuid: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    cellphone: {
      type: Sequelize.STRING,
      unique: {
        msg: 'This cellphone number is already taken.'
      }
    },
    firstname: {
      type: Sequelize.STRING,
      notEmpty: true,
      notNull: true
    },
    lastname: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    mlastname: {
      type: Sequelize.STRING,
      notEmpty: false
    },
    birthday: {
      type: Sequelize.DATEONLY,
    },
    blood: {
      type: Sequelize.STRING,
      notEmpty: false
    },
    gender: {
      type: Sequelize.ENUM('FEMALE', 'MALE'),
      defaultValue: 'MAlE'
    },
    weight: {
      type: Sequelize.FLOAT,
      notEmpty: false
    },
    height: {
      type: Sequelize.FLOAT,
      notEmpty: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        unique: {
          msg: 'This email is already taken.'
        }
    },
    password: {
      type: Sequelize.STRING,
      notEmpty: false
    },
    status: {
      type: Sequelize.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    }
  },
  {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(13);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  }
  );
  return user;
}
