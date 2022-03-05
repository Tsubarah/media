module.exports = (bookshelf) => {
	return bookshelf.model('Album', {
		tableName: 'albums',
		photos() {
			return this.belongsToMany('Photo');
		},
    users() {
      return this.belongsTo('User');
    }
	}, {
		async fetchById(id) {
			return await new this({ id }).fetch();
		}
	});
}


      // belongsToMany - many to many

      // belongsTo - 1 author

      // hasMany - 1-n