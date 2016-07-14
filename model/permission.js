var knex = require('../database'),
	bookshelf = require('bookshelf')(knex)
	User = require('./user');

var Permission = bookshelf.Model.extend({
	tableName: 'permission',
	user: function(){
		return this.hasMany(User);
	}
});

module.exports = Permission;