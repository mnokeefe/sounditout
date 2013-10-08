/**
 * Instrument
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  // Only save attributes that exist here to the database
  schema: true,

  attributes: {

    type: {
      type: 'string',
      required: true
    },

    brand: {
      type: 'string',
      required: true
    },

    serialNumber: {
      type: 'string'
    },

    description: {
      type: 'string'
    }

  }
};
