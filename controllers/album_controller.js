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

  // check for user
  const user = await models.User.fetchById(req.user.id, { withRelated: ['albums']});
  // save the users related albums to the userAlbums
  const userAlbums = user.related('albums');
  // find an album with requested album id
  const album = userAlbums.find(album => album.id == req.params.albumId);

  if (!album) {
    return res.status(404).send({
        status: 'fail',
        message: 'Album could not be found',
    });
};

  // get the requested album id and the related photos
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

  // check for user
  const user = await models.User.fetchById(req.user.id, { withRelated: ['albums']});

  // save the users related albums to the userAlbums
  const userAlbums = user.related('albums');

  // find an album with requested album id
  const album = userAlbums.find(album => album.id == req.params.albumId);

  // check if the album with the id exists
  const albumId = await models.Album.fetchById(req.params.albumId);

  if (!album) {
     res.status(404).send({
        status: 'fail',
        message: 'Album to update could not be found',
    });
    return;
  };

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
};

const addPhoto = async (req, res) => {
  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: 'fail', data: errors.array() });
  }

  // get only the validated data from request
  const validData = matchedData(req);


  const user = await models.User.fetchById(req.user.id, { withRelated: ['albums', 'photos']});

  // get related albums and find the requested album
  const userAlbum = user.related('albums').find(album => album.id == req.params.albumId);

  // get related photos and find the requested photo
  const userPhoto = user.related('photos').find(photo => photo.id == validData.photo_id);


  const album = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos']});

  // find requested photo and add to album
  const existingPhoto = album.related('photos').find(photo => photo.id == validData.photo_id);

  if (!album) {
    debug("The album to update could not be found. %o", { id: photoId });
    res.status(404).send({
      status: 'fail',
      data: 'Album to add could not be found',
    });
    return;
  }

  if (existingPhoto) {
    return res.send({
      status: 'fail',
      data: "The photo already exists"
    });
  }

  if (!userAlbum || !userPhoto) {
    res.status(403).send({
      status: 'fail',
      data: 'Album or Photo could not be found'
    });
    return;
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