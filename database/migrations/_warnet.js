var table = function(table){
	table.increments('net_id').primary();
	table.integer('net_owner').references('user.mbr_id');
	table.string('net_name');
	table.text('net_addr');
	table.text('net_desc');
	table.string('net_city');
	table.string('net_map');
	table.string('net_phone');
	table.boolean('net_f_printer');
	table.boolean('net_f_pulsa');
	table.boolean('net_f_game');
	table.boolean('net_f_ketik');
	table.boolean('net_f_acc');
	table.boolean('net_f_otr');
	table.dateTime('net_created');
}
exports.up = function(knex, Promise) {
	return knex.schema.createTable('warnet', table)
		.then(function () {
			console.log('Warnet table was created!');
		});
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTable('warnet', table)
		.then(function () {
			console.log('Warnet table was dropped!');
		});  
};
