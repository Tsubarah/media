const express = require('express');
const router = express.Router();
const album_controller = require('../controllers/album_controller');
const album_validationRules = require('../validation/album');

/* Get all resources */
router.get('/', album_controller.index);

/* Get a specific resource */
router.get('/:albumId', album_controller.show);

/* Store a new resource */
router.post('/', album_validationRules.createRules, album_controller.store);

/* Add a photo to an album */
router.post('/:albumId/photos', album_validationRules.addPhotoRules, album_controller.addPhoto);

/* Update a specific resource */
router.put('/:albumId', album_validationRules.updateRules, album_controller.update);

/* Destroy a specific resource */
router.delete('/:albumId', album_controller.destroy);

module.exports = router;