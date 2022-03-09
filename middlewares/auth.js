const models = require('../models');


// HTTP Basic Authentication
const basic = async (req, res, next) => {
  
  // check for Authorization header
  if (!req.headers.authorization) {

    return res.status(401).send({
      status: 'fail',
      data: 'Authorization required'
    });
  }

  // Split header into basic and payload
  const [authSchema, base64Payload] = req.headers.authorization.split(' ');

  
  // check if the authSchema is not basic, if so fail the authorization
  if (authSchema.toLowerCase() !== "basic") {

		return res.status(401).send({
			status: 'fail',
			data: 'Authorization required',
		});
	}

  // decode payload from base64 to an ascii string
  const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii');

  // split decoded payload into email and password
  const [email, password] = decodedPayload.split(':');

  const user = await models.User.login(email, password);

	if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authorization failed',
		});
	}

  // attach the user to the request
  req.user = user;

  next();
}

module.exports = {
  basic
}