const express = require('express');
const router = express.Router();
const photo_controller = require('../controllers/photo_controller');
const photo_validationRules = require('../validation/photo');

/* Get all resources */
router.get('/', photo_controller.index);

/* Get a specific resource */
router.get('/:photoId', photo_controller.show);

/* Store a new resource */
router.post('/', photo_validationRules.createRules, photo_controller.store);

/* Update a specific resource */
router.put('/:photoId', photo_validationRules.updateRules, photo_controller.update);


module.exports = router;