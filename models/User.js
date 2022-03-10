
const bcrypt = require('bcryptjs');

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
		photos() {
			return this.hasMany('Photo');
		},
    albums() {
      return this.hasMany('Album');
    }
	}, {
		async login(email, password) {
	
			// find a user with this email
			const user = await new this({ email }).fetch({ require: false });
			if (!user) {
				return false;
			}
			// get the user's password and put it in hash
			const hash = user.get('password');
	
			// hash the incoming users password
			// compare if the generated hash matches the db-hash
			const result = await bcrypt.compare(password, hash);
			if (!result) {
				return 'Incorrect password', false;
			}
	
			// return the authenticated user
			return user;
		},

		async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		}
	});
};

