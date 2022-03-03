const express = require('express');
const router = express.Router();

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

module.exports = router;