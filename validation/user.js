/**
 * User Validation Rules
 */


const { body } = require('express-validator');
const models = require('../models');


// Validation rules for creating a user
const createRules = [
  body('email').exists().isEmail().custom(async value => {
    const email = await new models.User({ email: value }).fetch({ require: false });
    if (email) {
      return Promise.reject("This email already exists.");
    }

    return Promise.resolve();
  }),
  body('password').exists().isLength({ min: 6 }),
  body('first_name').exists().isLength({ min: 2 }),
  body('last_name').exists().isLength({ min: 2 }),
];

// Optional validation rules for updating a user
const updateRules = [
  body('password').optional().isLength({ min: 4 }),
  body('first_name').optional().isLength({ min: 2 }),
  body('last_name').optional().isLength({ min: 2 }),
];

module.exports = {
  createRules,
  updateRules,
}
