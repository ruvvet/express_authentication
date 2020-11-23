'use strict';

// hash passwords for user by
// requiring bcrypt inside the model
const bcrypt = require('bcrypt');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            // sets len check/validation
            args: [1, 99],
            msg: 'Name must be between 1-99 characters.',
          },
        },
      },

      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            // assumes true, so sends invalid email if false
            msg: 'Invalid email',
          },
        },
      },

      password: {
        type: DataTypes.STRING,

        validate: {
          len: {
            args: [12, 99],
            msg: 'Password must be between 12-99 characters.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'user',
    }
  );
  return user;
};

// HASH THE USER PASSWORD
// add a method

// addhook is a sequelize method that adds a method
// 'beforecreate' means >>> do it before its added to the table

user.addHook('beforeCreate', (pendingUser) => {
  //now bcrypt can hash the pw
  // call the hashsync function and pass in the user
  //hashSync ([input], [# of times its encrypted])
  // more than 12 encryptions will take a long time
  // 12x hash is safe + efficient
  let hash = bcrypt.hashSync(pendingUser.password, 12);

  //then set pw to equal the hashed version
  pendingUser.password = hash;
});

// validate password
user.prototype.validPassword = function (passwordTyped) {
  let correctPassword = bcrypt.compareSync(passwordTyped, this.password);

  return correctPassword;
};

// remove the pw before its userData is serialized/returned for any call
// only removes pw from request, not from the DB itself
user.prototype.toJSON = function (){

  let userData = this.get();
  delete userData.password;
  return userData;
}