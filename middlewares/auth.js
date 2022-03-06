const bcrypt = require('bcrypt');
const debug = require('debug')('media:auth');
const models = require('../models');


// HTTP Basic Authentication
const basic = async (req, res) => {
  
  // check for Authorization header
  if (!req.headers.autorization) {
    debug('Authorization header missing');
  }
}