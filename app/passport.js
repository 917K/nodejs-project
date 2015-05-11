// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var bcrypt = require('bcrypt-nodejs');
var db = require('./db');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.query({
            sql: "SELECT * FROM "+db.config.users_table+" WHERE id = ?",
            values: [id]
        }, function(err, result) {
            done(err, result[0]);
        });
        /*db.getConnection(function(err, connection){
            if (err) {
                throw err;
            }
            if (connection) {
                connection.query("SELECT * FROM "+db.config.users_table+" WHERE id = ? ",[id], function(err, rows){
                    connection.release();
                    done(err, rows[0]);
                });
            }
        });*/
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.query({
                sql: "SELECT * FROM "+db.config.users_table+" WHERE username = ?",
                values: [username]
            }, function(err, result) {
                if (err) {
                    return done(err);
                }
                if (result.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                }
                else {
                    // if there is no user with that username
                    // create the user
                    var newUser = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    db.query({
                        sql: "INSERT INTO "+db.config.users_table+" ( username, password ) values (?,?)",
                        values: [newUser.username, newUser.password]
                    }, function(err, result) {
                        newUser.id = result.insertId;
                        return done(null, newUser);
                    });
                }
            });
            /*db.getConnection(function(err, connection){
                if (err) {
                    throw err;
                }
                if (connection) {
                    connection.query("SELECT * FROM "+db.config.users_table+" WHERE username = ?",[username], function(err, rows) {
                        if (err) {
                            connection.release();
                            return done(err);
                        }
                        if (rows.length) {
                            connection.release();
                            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                        } else {
                            // if there is no user with that username
                            // create the user
                            var newUserMysql = {
                                username: username,
                                password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                            };

                            var insertQuery = "INSERT INTO "+db.config.users_table+" ( username, password ) values (?,?)";

                            connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                                newUserMysql.id = rows.insertId;
                                connection.release();
                                return done(null, newUserMysql);
                            });
                        }
                    });
                }
            });*/
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            db.query({
                sql: "SELECT * FROM "+db.config.users_table+" WHERE username = ?",
                values: [username]
            }, function(err, result) {
                if (err) {
                    return done(err);
                }
                if (!result.length) {
                   return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                if (!bcrypt.compareSync(password, result[0].password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }
                // all is well, return successful user
                return done(null, result[0]);
            });
            /*db.getConnection(function(err, connection){
                if (err) {
                    throw err;
                }
                if (connection) {
                    connection.query("SELECT * FROM "+db.config.users_table+" WHERE username = ?",[username], function(err, rows){
                        connection.release();
                        if (err)
                            return done(err);
                        if (!rows.length) {
                            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                        }

                        // if the user is found but the password is wrong
                        if (!bcrypt.compareSync(password, rows[0].password))
                            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                        // all is well, return successful user
                        return done(null, rows[0]);
                    });
                }
            });*/
        })
    );
};