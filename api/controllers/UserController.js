/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  
  // This loads the signup page --> user/new.ejs
  'new': function (req, res) {
    res.view();
  },

  create: function (req, res, next) {

    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    User.create( userObj, function userCreated (err, user) {

      // If there's an error show them using flash.js policy
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }

        // If error redirect back to sign-up page
        return res.redirect('/user/new');
      }

      // Log the user in on creation of account
      req.session.authenticated = true;
      req.session.User = user;

      // After successfully creating the user
      // redirect to the show action
      res.redirect('/user/show/'+user.id);
    });
  },

  // Render the profile view (e.g. /views/show.ejs)
  show: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },

  index: function (req, res, next) {

    // Get an array of all users in the User collection (table)
    User.find(function foundUsers (err, users) {
      if (err) return next(err);
      // Pass the array down to the /views/index.ejs page
      res.view({
        users: users
      });
    });
  },

  // Render the edit view (/views/edit.ejs)
  edit: function (req, res, next) {

    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      res.view({
        user: user
      });
    });
  },

  // Process the info from edit view
  update: function (req, res, next) {



    User.update(req.param('id'), req.params.all(), function userUpdated (err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function (req, res, next) {

    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);
      });

      res.redirect('user');

    });
  }

};
