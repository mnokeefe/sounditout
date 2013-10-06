/**
 * SessionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

// See EP14
var bcrypt = require('bcrypt');

module.exports = {

  'new': function(req, res) {
    res.view('session/new');
  },

  create: function(req, res, next) {

    // Check for email and password in params sent via the form, if none
    // redirect the browser back to the sign-in form
    if (!req.param('email') || !req.param('password')) {
      // return next({err: ["Password doesn't match password confirmation"]});

      var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}]

      // Remember that err is the object being passed down (aka flash.err), whose value
      // is another object with the key of usernamePasswordRequiredError
      req.session.flash = {
        err: usernamePasswordRequiredError
      }

      res.redirect('/session/new');
      return;
    }

    // try to find the user by their email address
    User.findOneByEmail(req.param('email')).done(function(err, user) {
      if (err) return next(err);

      // If no user is found...
      if (!user) {
        var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email') + ' not found.'}]
        req.session.flash = {
          err: noAccountError
        }
        res.redirect('/session/new');
        return;
      }

      // Compare password from the form params to the encrypted password of the user found.
      bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
        if (err) return next(err);

        // If the password from the form doesn't match the password from the database...
        if (!valid) {
          var usernamePasswordMissmatchError = [{name: 'usernamePasswordMissmatch', message: 'Your email and password don\'t match'}]
          req.session.flash = {
            err: usernamePasswordMissmatchError
          }
          res.redirect('/session/new');
          return;
        }

        // Log user in
        req.session.authenticated = true;
        req.session.User = user;

        // If the user is also an admin redirect to the user list
        // This is used in conjunction with config/policies.js
        if (req.session.User.admin) {
          res.redirect('/user');
          return;
        }

        // Redirect to their profile page (/views/user/show.ejs)
        res.redirect('/user/show/' + user.id);
      });
    });
  },

  destroy: function(req, res, next) {

    // Wipe out the session (log out)
    req.session.destroy();

    // Redirect the browser to the sign-in screen
    res.redirect('/session/new');

  }

};
