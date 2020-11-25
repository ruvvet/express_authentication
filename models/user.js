'use strict';

// hash passwords for user by
// requiring bcrypt inside the model
const bcrypt = require('bcrypt');

const { Model } = require('sequelize');

//module.exports is a function that has 2 parameters
// parameters = sequelize and datatypes
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

    // validate password
    validPassword(passwordTyped) {

      return bcrypt.compareSync(passwordTyped, this.password);
    }

    // remove the pw before its userData is serialized/returned for any call
    // only removes pw from request, not from the DB itself
    toJSON() {
      let userData = this.get();
      // delete - deletes the key we give it
      delete userData.password;
      return userData;
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
        // https://regexr.com/
        // https://sequelize.org/master/manual/validations-and-constraints.html
        // for more validation
        validate: {
          len: {
            args: [8, 99],
            msg: 'Password must be between 8-99 characters.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'user',
    }
  );

  //sequelize hooks
  // have specific hooks  - https://sequelize.org/master/manual/hooks.html
  // allows us to change a user as they come in

  user.addHook('beforeCreate', (pendingUser) => {
    //now bcrypt can hash the pw
    // call the hashsync function and pass in the user
    //hashSync ([input], [# of times its encrypted])
    // more than 12 encryptions will take a long time
    // 12x hash is safe + efficient

    //then set pw to equal the hashed version
    pendingUser.password = bcrypt.hashSync(pendingUser.password, 12);
  });

  return user;

};

// HASH THE USER PASSWORD
// add a method

// addhook is a sequelize method that adds a method
// 'beforecreate' means >>> do it before its added to the table
