/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

// Validation rules for adding a photo
const createRules = [
  body('title').exists().isLength({ min: 4 }),
  body('url').exists().isURL(),
  body('comment').optional(),
  /*
  body('user_id').exists().bail().custom(async value => {
   const user = await new models.User({ id: value }).fetch({ require: false });
   if (!user) {
     return Promise.reject(`User with ID ${value} does not exist.`);
   }

   return Promise.resolve();
 }),
 */
];


// Optional validation rules for updating a photo
const updateRules = [
  body('title').optional().isLength({ min: 4 }),
  body('url').optional().isURL(),
  body('comment').optional(),
  /*
  body('photoId').exists().bail().custom(async value => {
    const photoId = await new models.User({ id: value }).fetch({ require: false });
    if (!photoId) {
      return Promise.reject(`Photo with ID ${value} does not exist.`);
  }
      return Promise.resolve();
  }),
  */
];

module.exports = {
  createRules,
  updateRules,
}