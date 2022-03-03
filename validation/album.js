/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');


// Validation rule for creating an album
const createRules = [
	body('title').exists().isLength({ min: 4 }),
];

// Optional validation rule for updating album
const updateRules = [
	body('title').optional().isLength({ min: 4 }),
];

module.exports = {
	createRules,
	updateRules,
}