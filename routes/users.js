const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const user_validationRules = require('../validation/user');

/* Get all resources */
router.get('/', user_controller.index);

/* Get a specific resource */
router.get('/:userId', user_controller.show);

/* Store a new resource */
router.post('/', user_validationRules.createRules, user_controller.store);

/* Update a specific resource */
router.put('/:userId', user_validationRules.updateRules, user_controller.update);

/* Destroy a specific resource */
router.delete('/:userId', user_controller.destroy);

module.exports = router;