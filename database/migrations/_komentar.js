var table = function(table){
	table.increments('com_id').primary();
	table.string('com_net_id').references('warnet.mbr_id');
	table.string('com_user_id').references('user.mbr_id');
	table.string('com_user_nm');
	table.text('com_desc');
	table.integer('com_rate');
	table.dateTime('com_dt');
}
exports.up = function(knex, Promise) {
	return knex.schema.createTable('komentar', table)
		.then(function () {
			console.log('Komentar table was created!');
		});
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTable('komentar', table)
		.then(function () {
			console.log('Komentar table was dropped!');
		});  
};
