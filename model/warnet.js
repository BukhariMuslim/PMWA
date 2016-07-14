var knex = require('../database'),
	bookshelf = require('bookshelf')(knex),
	User = require('./user');
	
var Warnet = bookshelf.Model.extend({
	tableName: 'warnet',
	user: function(){
		return this.belongsTo(User);
	}
});

module.exports = Warnet;