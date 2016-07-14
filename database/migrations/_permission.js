var table = function(table){
	table.increments('id_permission').primary();
	table.boolean('manage_user');
	table.boolean('manage_post');
	table.integer('username').references('user.mbr_username');
};

exports.up = function(knex, Promise) {
	return knex.schema.createTable('permission', table)
		.then(function () {
			console.log('Permission table was created!');
			return knex("permission").insert([
				{ 
					manage_user: true,
					manage_post: true,
					username: 1
				},
				{ 
					manage_user: false,
					manage_post: false,
					username: 2
				}
			]);
		});
};

exports.down = function(knex, Promise) {
	return knex.schema
		.dropTable('permission', table)
		.then(function () {
			console.log('Permission table was dropped!');
		});  
};
