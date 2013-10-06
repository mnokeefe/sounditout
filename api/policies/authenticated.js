/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller
  if (req.session.authenticated) {
    return ok();
  }

  // User is not allowed
  // Sail default:
  // else {
  //   return res.send("You are not permitted to perform this action.", 403);
  // }

  // EP14
  else {
    var requireLogInError = [{name: 'requireLogin', message: 'You must be signed in.'}]
    req.session.flash = {
      err: requireLogInError
    }
    res.redirect('/session/new');
    return;
  }
};