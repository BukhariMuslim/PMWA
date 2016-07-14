var knex = require('../database'),
	bookshelf = require('bookshelf')(knex),
	Warnet = require('./warnet'),
	Permission = require('./permission');

var User = bookshelf.Model.extend({
	tableName: 'user',
	permission: function(){
		return this.belongsTo(Permission);
	},
	warnet: function(){
		return this.hasMany(Warnet);
	}
});

module.exports = User