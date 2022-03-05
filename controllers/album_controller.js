const debug = require('debug')('media:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// GET all the albums
const index = async (req, res) => {
  const all_albums = await models.Album.fetchAll();

  res.send({
    status: 'success',
    data: {
      albums: all_albums
    }
  });
}

// GET a specific album with photos and users
const show = async (req, res) => {
  const album = await new models.Album({ id: req.params.albumId })
    .fetch({ withRelated: ['photos', 'users'] });

  res.send({
    status: 'success',
    data: {
      album
    }
  });
}

// POST a new album
const store = async (req, res) => {
   
  // check for any validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 'fail', data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);
  
  try {
    const album = await new models.Album(validData).save();
    debug("Created new album successfully: %O", album);

    res.send({
      status: 'success',
      data: {
        album
      }
    });

  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Exception thrown in database when creating a new album.',
    });
    throw error;
  }
}

// PUT (update) an album
const update = async (req, res) => {

  // save the album id
  const albumId = req.params.albumId;

  // check if the album with the id exists
  const album = await new models.Album({ id: albumId }).fetch({ require: false });

  if (!album) {
    debug("The album to update could not be found. %o", { id: albumId });
    res.status(404).send({
      status: 'fail',
      data: 'album Not Found',
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
    const updatedAlbum = await album.save(validData);
    debug("Updated album successfully: %O", updatedAlbum);

    res.send({
      status: 'success',
      data: {
        album
      }
    });

  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Exception thrown in database when updating a new album.',
    });
    throw error;
  }
}

// DELETE a specific album
const destroy = async(req, res) => {
  try {
      let album = await models.Album.where( { "id" : req.params.id  } ).fetch( { require: true } );
      album = await album.destroy();

      return res.status(200).send(
          {
              success: true, 
              data: {
                  album
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

const addPhoto = async (req, res) => {
  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 'fail', data: errors.array() });
  }

  // get only the validated data from request
  const validData = matchedData(req);

  // fetch album and eager-load photos relation
  const album = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos'] });

  // get the album's photos
  const photos = album.related('photos');

  // check if the photo is already in the album's list of books
  const existingPhoto = photos.find(photo => photo.id == validData.photo.id);

  // if it already exists, bail
	if (existingPhoto) {
		return res.send({
			status: 'fail',
			data: 'Photo already exists.',
		});
	}

	try {
		const result = await album.photos().attach(validData.photo_id);
		debug("Added photo to album successfully: %O", result);

		res.send({
			status: 'success',
			data: null,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to a album.',
		});
		throw error;
	}
}

module.exports = {
 index,
 show,
 store,
 update,
 destroy,
 addPhoto,
}