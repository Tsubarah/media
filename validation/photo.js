/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');

// Validation rules for adding a photo
const createRules = [
  body('title').exists().isLength({ min: 4 }),
  body('url').exists().isURL(),
  body('comment').optional(),
];


// Optional validation rules for updating a photo
const updateRules = [
  body('title').optional().isLength({ min: 4 }),
  body('url').optional().isURL(),
  body('comment').optional(),
];

module.exports = {
  createRules,
  updateRules,
}