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

// Add photo to album validation rules
const addPhotoRules = [
	body('photo_id').exists().bail().custom(async value => {
		const photo = await new models.Photo({ id: value }).fetch({ require: false });
		if (!photo) {
			return Promise.reject(`The photo with the ID ${value} does not exist.`);
		}

		return Promise.resolve();
	}),
];

module.exports = {
	createRules,
	updateRules,
	addPhotoRules,
}