var knex = require('../database'),
	bookshelf = require('bookshelf')(knex),
	Warnet = require('./warnet');

var Pc = bookshelf.Model.extend({
	tableName: 'pc'
	// ,
	// warnet: function(){
	// 	return this.belongsTo(Warnet);
	// }
});

module.exports = Pc;