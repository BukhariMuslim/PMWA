var table = function(table){
	table.increments('post_id').primary();
	table.string('post_mbr_id').references('user.mbr_id');
	table.string('post_net_id').references('warnet.net_id');
	table.string('post_title');
	table.text('post_content');
	table.integer('post_rate');
	table.dateTime('post_created');
}
exports.up = function(knex, Promise) {
	return knex.schema.createTable('post', table)
		.then(function () {
			console.log('Post table was created!');
		});
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTable('post', table)
		.then(function () {
			console.log('Post table was dropped!');
		});  
};
