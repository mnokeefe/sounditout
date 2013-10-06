// EP17 only allow admins
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller
  if (req.session.User && req.session.User.admin) {
    return ok();
  }

  // EP14
  else {
    var requireLogInError = [{name: 'requireAdminError', message: 'You must be an admin.'}]
    req.session.flash = {
      err: requireAdminError
    }
    res.redirect('/session/new');
    return;
  }
};