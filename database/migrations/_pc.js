var table = function(table){
	table.increments('pc_id').primary();
	table.string('pc_mbr_id');
	table.string('pc_net_id'); //.references('warnet.net_id')
	table.boolean('pc_stat');
}
exports.up = function(knex, Promise) {
	return knex.schema.createTable('pc', table)
		.then(function () {
			console.log('Pc table was created!');
		});
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTable('pc', table)
		.then(function () {
			console.log('Pc table was dropped!');
		});  
};
