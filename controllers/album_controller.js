const debug = require('debug')('media:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// GET all the albums for authenticated user
const index = async (req, res) => {

  const user = await models.User.fetchById(req.user.id, { withRelated: ['albums']});
 
  res.status(200).send({
    status: 'success',
    data: {
      albums: user.related('albums')
    }
  });
};

// GET a specific album with photos for authenticated user
const show = async (req, res) => {

  const user = await models.User.fetchById(req.user.id, { withRelated: ['albums']});
  const userAlbums = user.related('albums');
  const album = userAlbums.find(album => album.id == req.params.albumId);

  if (!album) {
    return res.status(404).send({
        status: 'fail',
        message: 'Album could not be found',
    });
};

  const albumId = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos']});

  res.send({
    status: 'success',
    data: {
      albums: albumId
    }
  });
};

// POST a new album
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
      data: 'Album could not be found',
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

const addPhoto = async (req, res) => {
  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 'fail', data: errors.array() });
  }

  // get only the validated data from request
  const validData = matchedData(req);

  // fetch album and photos relation
  const album = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos'] });

  // get the album's photos
  const photos = album.related('photos');

  // check if the photo is already in the album's list of photos
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
 addPhoto,
}