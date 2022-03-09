/**
 * Album Validation Rules
 */

const { body } = require('express-validator');


// Validation rule for creating an album
const createRules = [
	body('title').exists().isLength({ min: 4 }),
];

// Optional validation rule for updating album
const updateRules = [
	body('title').optional().isLength({ min: 4 }),
];

// Add photo to album validation rules
const addPhotoRules = [
	body('photo_id').exists().isInt()
];

module.exports = {
	createRules,
	updateRules,
	addPhotoRules,
}