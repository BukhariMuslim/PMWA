var knex = require('../database'),
	bookshelf = require('bookshelf')(knex),
	User = require('./user'),
	Warnet = require('./warnet');

var Rate = bookshelf.Model.extend({
	tableName: 'rate',
	user: function(){
		return this.belongsTo(User);
	},
	warnet: function(){
		return this.belongsTo(Warnet);
	}
});

module.exports = Rate;