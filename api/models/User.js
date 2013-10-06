/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  // Only save attributes that exist here to the database
  schema: true,

  attributes: {

    name: {
      type: 'string',
      required: true
    },

    title: {
      type: 'string'
    },

    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    encryptedPassword: {
      type: 'string'
    }

    // Prevent these values being sent back to the client
    // toJSON: function() {
    //   var obj = this.toObject();
    //   delete obj.password;
    //   delete obj.confirmation;
    //   delete obj.encryptedPassword;
    //   delete obj._csrf;
    //   return obj;
    // }

  },

  beforeCreate: function (values, next) {

    // This checks to make sure the password and password confirmation match before creating record
    if (!values.password || values.password != values.confirmation) {
      return next({err: ["Password doesn't match password confirmation."]});
    }

    require('bcrypt').hash(values.password, 10, function passwordEncrypted (err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }

};
