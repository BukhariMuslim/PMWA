var knex = require('../database'),
	bookshelf = require('bookshelf')(knex),
	User = require('./user'),
	Warnet = require('./warnet');

var Post = bookshelf.Model.extend({
	tableName: 'post',
	user: function(){
		return this.belongsTo(User);
	},
	warnet: function(){
		return this.belongsTo(Warnet);
	}
});

module.exports = Post;