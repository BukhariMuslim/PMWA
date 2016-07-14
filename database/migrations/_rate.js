var table = function(table){
	table.increments('rt_id').primary();
	table.string('rt_mbr_id').references('user.mbr_id');
	table.string('rt_net_id').references('warnet.net_id');
	table.integer('rt_val');
}
exports.up = function(knex, Promise) {
	return knex.schema.createTable('rate', table)
		.then(function () {
			console.log('Rate table was created!');
		});
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTable('rate', table)
		.then(function () {
			console.log('Rate table was dropped!');
		});  
};
