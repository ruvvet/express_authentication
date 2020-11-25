module.exports = (req, res, next) => {
  // check if user
  // if no user, give error messge
  if (!req.user) {
    req.flash('error', 'Login to access!'); //req.flash takes 2 param (type of message, 'message);
    res.redirect('/auth/login');
  } else {
    next(); // run the next function - aka - renders the page
  }
};


//module.exports = isLoggedIn;