var passport = require('passport');
var site = {};
var log = require('./../../log')(module);
// =====================================
// HOME PAGE (with login links) ========
// =====================================
site.showIndex = function(req, res) {
  res.render('index.ejs'); // load the index.ejs file
};

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
site.showLogin = function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login.ejs', { message: req.flash('loginMessage') });
};

// process the login form
site.login = function(req, res) {
  log.info('login');
  passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
})};

site.afterLogin = function(req, res) {
  log.info('afterLogin');
  if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
  res.redirect('/');
}

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
site.showSignup = function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('signup.ejs', { message: req.flash('signupMessage') });
};

// process the signup form
site.signup = function(req, res) {
  passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  })
};

// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
site.showProfile = function(req, res) {
  res.render('profile.ejs', {
    user : req.user // get the user out of session and pass to template
  });
};

// =====================================
// LOGOUT ==============================
// =====================================
site.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// route middleware to make sure
site.isLoggedIn = function(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

module.exports = site;