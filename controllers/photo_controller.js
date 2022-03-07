const debug = require('debug')('media:photo_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// GET all the photos
const index = async (req, res) => {
  
  const user = await models.User.fetchById(req.user.id, { withRelated: ['photos']});

  res.send({
    status: 'success',
    data: {
      photos: user.related('photos')
    }
  });
}

// GET a specific photo
const show = async (req, res) => {
  
  const user = await models.User.fetchById(req.user.id, { withRelated: ['photos']});
  const userPhotos = user.related('photos');
  const photos = userPhotos.find(photo => photo.id == req.params.photoId);

  if (!photos) {
    return res.status(404).send({
        status: 'fail',
        message: 'Photo could not be found',
    });
}

  const photoId = await models.Photo.fetchById(req.params.photoId);

  res.send({
    status: 'success',
    data: {
      photos: photoId
    }
  });
}

// POST a new photo
const store = async (req, res) => {

  // check for any validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 'fail', data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);

  validData.user_id = req.user.id;

  try {
    const photo = await new models.Photo(validData).save();
    debug("Created new photo successfully: %O", photo);

    res.send({
      status: 'success',
      data: {
        photo
      }
    });

  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Exception thrown in database when creating a new photo.',
    });
    throw error;
  }
}

// PUT (update) a photo
const update = async (req, res) => {

  // save the photo id
  const photoId = req.params.photoId;

  // check if the album with the id exists
  const photo = await new models.Photo({ id: photoId }).fetch({ require: false });

  if (!photo) {
    debug("The photo to update could not be found. %o", { id: photoId });
    res.status(404).send({
      status: 'fail',
      data: 'Photo could not be found',
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
    const updatedPhoto = await photo.save(validData);
    debug("Updated photo successfully: %O", updatedPhoto);

    res.send({
      status: 'success',
      data: {
        photo
      }
    });

  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Exception thrown in database when updating a new photo.',
    });
    throw error;
  }
}

// DELETE a specific photo
const destroy = async(req, res) => {
  try {
      let photo = await models.Photo.where( { "id" : req.params.id  } ).fetch( { require: true } );
      photo = await photo.destroy();

      return res.status(200).send(
          {
              success: true, 
              data: {
                  photo
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