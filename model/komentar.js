var knex = require('../database'),
	bookshelf = require('bookshelf')(knex),
	User = require('./user'),
	Warnet = require('./warnet');

var Komentar = bookshelf.Model.extend({
	tableName: 'komentar',
	user: function(){
		return this.belongsTo(User);
	},
	warnet: function(){
		return this.belongsTo(Warnet);
	}
});

module.exports = Komentar;