const bcrypt = require('bcrypt');
const debug = require('debug')('media:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');



// POST (register) a user 

const register = async (req, res) => {
  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 'fail', data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);

  console.log('The validated data:', validData);

  // generate a hash and set it for the requested users password
  try {
    validData.password = await bcrypt.hash(validData.password, 10);

  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Exception thrown when hashing the password.',
    });
    throw error;
  }

  try {
		const user = await new models.User(validData).save();
		// debug("Created new user successfully: %O", user);

		res.send({
			status: 'success',
			data: {
				email: validData.email,
        first_name: validData.first_name,
        last_name: validData.last_name
			},
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when registering a new user.',
		});
		throw error;
	}
};

/**
 * Post login a user with: 
 * "username": "",
 * "password": ""
 */

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // login user
    const user = await models.User.login(email, password);
    
    if (!user) {
        return res.status(401).send({
            status: "fail",
            data: "Login failed.",
        });
    }

    return res.status(200).send({
      status: 'success',
      data: user
    });
};

module.exports = {
  register,
  login
}