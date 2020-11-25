////////////// configure passport/password auth //////////////

// http://www.passportjs.org/docs/
// require the passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models'); // require the models

// SERIALIZING USER DATA
// passport will serialize the info
// serialize = convert it to easily transfer/storable data
// that makes it easier to login

//
passport.serializeUser((user, done) => {
  // callback looks for user, and then runs callback and passes it in
  done(null, user.id);
});


//parameters (err, user, other info)

// DE-SERIALIZING USER DATA
// take user id and look it up in the database

// deserialize
//check db for primary key with id
// get the user and then call next

passport.deserializeUser((id, next) => {
  db.user
    .findByPk(id)
    .then((user) => {
      if (user) {
        next(null, user);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// inside local strategy(obj, function)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, next) => {
      // now find a user in the db where the email matches the user
      db.user
        .findOne({
          where: { email },
        })
        .then((user) => {
          // check if there is a user and if pw is valid

          if (!user || !user.validPassword(password)) {
            // check inside the instance if the user's password matches, OR if a user even exists
            // if no match, run callback
            next(null, false);
          } else {
            // else we found a user + pw matcches, so we pass the user back
            next(null, user);
          }
        })
        .catch(next);  // giving catch a function
        // next is a function
        // passing the function next into catch
        //>>>>>.catch((error)=>{next(error)})
    }
  )
);

//export this
module.exports = passport;