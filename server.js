// dependencies

require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');

// app
const app = express();


// middlware
app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 3000;
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
