// dependencies

require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const SESSION_SECRET = process.env.SESSION_SECRET;

console.log(SESSION_SECRET);

// app
const app = express();

//add our custom middleware
const isLoggedIn = require('./middleware/isLoggedIn');

// middlware
app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// create a session ob
// secret: the secret we're giving to the user on the site as a session cookie
// resave: saves the session even if its modified/changing windows, so its initialized w/ false
// saveUninitialized: if new session, save it and thherefore its true
// ?????????????????????????????????
// read passport/express session docs

const sessionObject = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

// the session will now use the object for each session
app.use(session(sessionObject));

//alt way of writing the session//////
// app.use(
//   session({
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

//initialize passport + run through the middleware
app.use(passport.initialize());
app.use(passport.session()); //runs a session through the middleware

// using flash throughout app to send temp messages to user
// before every route attach a user to res.local
app.use(flash());

app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  console.log(res.locals.alerts);
  res.render('index', { alerts: res.locals.alerts });
});

app.get('/profile', isLoggedIn, (req, res) => {
  //anytime the route is accessed, check if user is logged in
  // if logged in, render the page

  res.render('profile');
});

app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;

// passport module allows authentication using username/password
// there are multiple authetnication strategeies available at
// http://www.passportjs.org/packages/passport-local/
//
// also Bcrypt to hash passwords - encrypts the pw

// session key  - issues a secret that stays with them to make sure they can stay logged in
// every time they render a new page the secret stays with them until logout

// QUESTIONS

// cookies
// why do we need to serialize/deserialize credentials
