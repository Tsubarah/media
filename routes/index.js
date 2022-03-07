const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const user_validationRules = require('../validation/user');
const user_controller = require('../controllers/user_controller');

// Test to get the GET
router.get('/', (req, res, next) => {
  res.send({ 
    success: true,
    data: {
      msg: 'You called for me!'
    }
  });
});

router.use('/albums', auth.basic, require('./albums'));
router.use('/photos', auth.basic, require('./photos'));

// register a user
router.post('/register', user_validationRules.createRules, user_controller.register);

module.exports = router;