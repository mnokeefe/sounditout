// EP17 only allow admins to users who aren't them
module.exports = function (req, res, ok) {

  var sessionUserMatchesId = req.session.User.id === req.param('id');
  var isAdmin = req.session.User.admin;

  // The requested id does not match the user's id,
  // and this is not an admin
  if (!(sessionUserMatchesId || isAdmin)) {
    var noRightsError = [{name: 'noRights', message: 'You must be an admin.'}]
    req.session.flash = {
      err: requireLogInError
    }
    res.redirect('/session/new');
    return;
  }

  ok();

};