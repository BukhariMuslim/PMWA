var table = function(table){
	table.increments('mbr_id').primary();
	table.string('mbr_username').unique();
	table.string('mbr_password');
	table.string('mbr_name');
	table.string('mbr_email');
	table.string('mbr_tempat_lahir');
	table.dateTime('mbr_tgl_lhr');
	table.string('mbr_phone');
	table.boolean('mbr_act');
};

exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', table)
  	.then(function(){
  		console.log('User table was created!');
		return knex("user").insert([
				{ 
					mbr_username: "admin",
					mbr_password: "admin",
					mbr_name: "Administrator",
					mbr_email: "admin@cariwarnet.co.id",
					mbr_tempat_lahir: "Medan",
					mbr_tgl_lhr: "01/01/1970",
					mbr_act: true
				},
				{ 
					mbr_username: "user1",
					mbr_password: "user1",
					mbr_name: "Pengguna 1",
					mbr_email: "user1@cariwarnet.co.id",
					mbr_tempat_lahir: "Medan",
					mbr_tgl_lhr: "10/04/1975",
					mbr_act: true
				}
			]);
  	});
};

exports.down = function(knex, Promise) {
  return knex.schema
  	.dropTable('user', table)
  	.then(function (){
  		console.log('User table was dropped!');
  	});
};
