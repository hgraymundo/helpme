var bcrypt = require('bcryptjs');
module.exports = function(sequelize, Sequelize) {
// account
    var account = sequelize.define('account', {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING,
            validate: {
              isEmail: {
                msg: 'It is not a valid email.'
              },
            },
            unique: {
              msg: 'This email is already taken.'
            }
        },
        password: {
            type: Sequelize.STRING,
            notEmpty: true,
            notNull: true,
            len: {
              args: [6,15],
              msg: "The password must be between 6 and 15 characters"
            }
        },
        status: {
          type: Sequelize.ENUM('Active', 'Inactive'),
          defaultValue: 'Active' //its must be changed to inactive, to use the process of activating by email.
        }
    },
    {
      hooks: {
        beforeCreate: (account) => {
          const salt = bcrypt.genSaltSync(13);
          account.password = bcrypt.hashSync(account.password, salt);
        }
      }
    }
  );
  return account;
}
