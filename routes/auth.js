const express = require('express');

const router = express.Router();

const db = require('../models');
const passport = require('../config/ppConfig');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

////////////////// SIGNUP ROUTER ////////////////////////
router.post('/signup', (req, res) => {
  console.log(req.body);
  db.user
    .findOrCreate({
      where: { email: req.body.email },
      defaults: {
        name: req.body.name,
        password: req.body.password,
      },
    })
    .then(([user, created]) => {
      if (created) {
        console.log(`${user.name} was created`);
        // flash message

        const successObject = {
          // successreidrect + successflash are passport recognized keywords
          successRedirect: '/',
          successFlash: 'Account created, login in...', // passport reads this flash message and sends a flash message
        };

        passport.authenticate('local', successObject)(req, res);

      } else {
        // email already exists
        // so make a flash message
        req.flash('error', 'Email already in use');
        res.redirect('/auth/signup');
      }
    })
    .catch((err) => {
      console.log('error', err); // this is where we could see the model validation msg
      req.flash('error', 'Email/PW incorrect - Try again.');
      res.redirect('/auth/signup');
    });
});

//////////////////////// LOGIN ROUTE ///////////////////

router.post(
  '/login',
  // authenticate user through passport
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: 'Logging in...',
    failureFlash: 'Login attempt failed. Try again.',
  })
);
// passport.authenticate returns a function


/// ALT

// router.post(
//   '/login', (req, res) =>{

//     const render = passport.authenticate('local', {
//       successRedirect: '/',
//       failureRedirect: '/auth/login',
//       successFlash: 'Logging in...',
//       failureFlash: 'Login attempt failed. Try again.',
//     });

//     render(req, res)
//   }
// );




//// LOGOUT//////////////////////////
router.get('/logout', (req, res) => {
  // removes info from session
  req.logout();
  req.flash('success', 'Logging out...');
  res.redirect('/');
});

module.exports = router;
