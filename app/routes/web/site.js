var router = require('express').Router();
var site = require('./../../controllers/web/site');

// =====================================
// HOME PAGE (with login links) ========
// =====================================
router.get('/', site.showIndex);

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
router.get('/login', site.showLogin);

// process the login form
router.post('/login', site.login, site.afterLogin);

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/signup', site.showSignup);

// process the signup form
router.post('/signup', site.signup);

// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', site.isLoggedIn, site.showProfile);

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', site.logout);

module.exports = router;