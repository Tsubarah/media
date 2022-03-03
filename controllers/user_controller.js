const debug = require('debug')('media:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// GET all the users
const index = async (req, res) => {
  const user = await models.User.fetchAll();

  res.send({
    status: 'success',
    data: {
      user
    }
  });
}

// GET a specific user
const show = async (req, res) => {
  const user = await new models.User({ id: req.params.userId })
    .fetch();

  res.send({
    status: 'success',
    data: {
      user
    }
  });
}

// POST a new user
const store = async (req, res) => {


  // check for any validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 'fail', data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);
  

  try {
    const user = await new models.User(validData).save();
    debug("Created new user successfully: %O", user);

    res.send({
      status: 'success',
      data: {
        user
      }
    });

  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Exception thrown in database when creating a new user.',
    });
    throw error;
  }
}

// PUT (update) a user
const update = async (req, res) => {
  
  // save the user id
  const userId = req.params.userId;

  // check if the user with the id exists
  const user = await new models.User({ id: userId }).fetch({ require: false });

  if (!user) {
    debug("user to update was not found. %o", { id: userId });
    res.status(404).send({
      status: 'fail',
      data: 'user Not Found',
    });
    return;
  }

  // check for any validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 'fail', data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);

  try {
    const updatedUser = await user.save(validData);
    debug("Updated user successfully: %O", updatedUser);

    res.send({
      status: 'success',
      data: {
        user
      }
    });

  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Exception thrown in database when updating a new user.',
    });
    throw error;
  }
}

// DELETE a specific user
const destroy = async(req, res) => {
  try {
      let user = await models.User.where( { "id" : req.params.id  } ).fetch( { require: true } );
      user = await user.destroy();

      return res.status(200).send(
          {
              success: true, 
              data: {
                  user
              }
          }
      );

  } catch (err) {
      log('Destroy failed %s', err.message);
      return res.status(500).send(
          {
              success: false,
              data: err.message
          }
      );  
  }
} 

module.exports = {
 index,
 show,
 store,
 update,
 destroy,
}