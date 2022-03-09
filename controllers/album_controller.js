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
  
  // get the users related albums and find the album id
  const album = user.related('albums').find(album => album.id == req.params.albumId);
  

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

  // get user based on what user that is logged in (requested user) 
  const user = await models.User.fetchById(req.user.id, { withRelated: ['albums']});

  // save the users related albums to the userAlbums
  const userAlbums = user.related('albums');

  // find an album with requested album id
  const album = userAlbums.find(album => album.id == req.params.albumId);


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

  // get authenticated with related albums and photos
  const user = await models.User.fetchById(req.user.id, { withRelated: ['albums', 'photos']});

  // get related albums from the user and find the requested album
  const userAlbum = user.related('albums').find(album => album.id == req.params.albumId);

  // get related photos from the user and find the requested photo
  const userPhoto = user.related('photos').find(photo => photo.id == validData.photo_id);

  // get the requested album id
  const album = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos']});

  // check if the photo already exists
  const existingPhoto = album.related('photos').find(photo => photo.id == validData.photo_id);

  if (existingPhoto) {
    return res.send({
      status: 'fail',
      data: "The photo already exists"
    });
  }

  if (!userAlbum) {
    res.status(403).send({
      status: 'fail',
      data: 'Album could not be found'
    });
    return;
  }

  if (!userPhoto) {
    res.status(403).send({
      status: 'fail',
      data: 'Photo could not be found'
    });
    return;
  }
  
	try {
    await album.photos().attach(validData.photo_id);

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