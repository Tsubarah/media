const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const auth_controller = require('../controllers/auth_controller');
const user_validationRules = require('../validation/user');

// Test to get the GET
router.get('/', (req, res, next) => {
  res.send({ 
    success: true,
    data: {
      msg: 'You called for me!'
    }
  });
});

router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'));
router.use('/users', require('./users'));

// register a user
router.post('/register', user_validationRules.createRules, auth_controller.register);

module.exports = router;