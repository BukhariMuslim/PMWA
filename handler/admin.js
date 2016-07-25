var User = require('../model/user'),
	Permission = require('../model/permission'),
	Pc = require('../model/pc'),
	Warnet = require('../model/warnet'),
	Komentar = require('../model/komentar'),
	fs = require('fs'),
	handler;

var index = function(req, res){
	User
	.where({"mbr_username":req.session.user})
	.fetch()
	.then(function(current_user){
		Warnet.fetchAll()
		.then(function(current_warnet){
			Warnet
			.query(function(qb){
				qb.orderBy('net_created', 'DESC').limit(10);
			})
			.fetchAll()
			.then(function(new_net) {
				res.render('./admin/index.html',{
					current_user:current_user.toJSON(),
					new_net:new_net.toJSON(),
					current_warnet: current_warnet.toJSON()
				});
			});
		}).catch(function(err){
			console.log("Warnet err :" + err);			
			res.sendStatus(500);
		});
	})
	.catch(function(err){
		console.log("Warnet user :" + err);
		res.sendStatus(500);
	});	
};

var search = function(req, res){
	User
	.where({"mbr_username":req.session.user})
	.fetch()
	.then(function(current_user){
		Warnet.fetchAll()
		.then(function(current_warnet){
			Warnet
			.query(function(qb){
				qb.orderBy('net_created', 'DESC').limit(10);
			})
			.fetchAll()
			.then(function(new_net) {
				if (req.query.search) {
					var search = req.query.search;
					Warnet
					.query(function (qb) {
						qb.where('net_name', 'LIKE', '%' + search + '%');
					})
					.fetchAll()
					.then(function (search_net) {
						var total = 0;
						if (search_net.toJSON) {
							search_net = search_net.toJSON();
							total = search_net.length;
						}
						var result = {
							total: total,
							par: search
						};
						res.render('./admin/index.html',{
							current_user:current_user.toJSON(),
							new_net: new_net.toJSON(),
							result: result,
							current_warnet: search_net
						});
					})
				}
				else {
					res.render('./admin/index.html',{
						current_user:current_user.toJSON(),
						new_net:new_net.toJSON(),
						current_warnet: current_warnet.toJSON()
					});
				}
			});
		}).catch(function(err){
			console.log("Warnet err :" + err);			
			res.sendStatus(500);
		});
	})
	.catch(function(err){
		console.log("Warnet user :" + err);
		res.sendStatus(500);
	});	
};

var logout = function(req, res){
	req.session.destroy(function (err) {
		res.redirect('../');
	});
};


var showWarnet = function(req, res){
	var netId = req.params.id,
		username = req.session.user;

	User
		.where({ "mbr_username" : username })
		.fetch()
		.then(function(current_user){
			current_user = current_user.toJSON();
			Warnet.where({ "net_id" : netId })
				.fetch()
				.then(function (current_net) {
					if (current_net.toJSON) {
						current_net = current_net.toJSON();
					}
					User.where({ "mbr_id" : current_net.net_owner })
					.fetch()
					.then(function(current_net_user) {
						if (current_net_user.toJSON) {
							current_net_user = current_net_user.toJSON();
						}
						Pc.where({ 'pc_net_id' : netId })
						.fetchAll()
						.then(function(current_pc) {
							if (current_pc.toJSON) {
								current_pc = current_pc.toJSON();
							}
							Komentar
							.where({ "com_net_id" : netId })
							.fetchAll()
							.then(function(current_comment) {
								if (current_comment.toJSON) {
									current_comment = current_comment.toJSON();
								}
								res.render('./admin/add_net.html',{
									current_user: current_user,
									current_net: current_net,
									current_pc: current_pc,
									current_comment: current_comment,
									current_net_user: current_net_user,
									isBelong: current_user.mbr_username == username,
									isLogin: true
								});	
							});
						});
					})
					.catch(function(err){
						console.log("Warnet user :" + err);
						res.sendStatus(500);
					});
				})
				.catch(function(err){
					console.log("Warnet user :" + err);
					res.sendStatus(500);
				});
		})
		.catch(function(err){
			console.log("Warnet user :" + err);
			res.sendStatus(500);
		});
};

var newWarnet = function(req, res){
	var username = req.session.user;

	User
		.where({ "mbr_username" : username })
		.fetch()
		.then(function(current_user){
			res.render('./admin/add_net.html',{
				current_user: current_user.toJSON(),
				isInsert: true 
			});
		})
		.catch(function(err){
			res.sendStatus(500);
		});
};

var editWarnet = function(req, res){
	var netId = req.params.id,
		username = req.session.user;

	User
		.where({ "mbr_username" : username })
		.fetch()
		.then(function(current_user){
			current_user = current_user.toJSON();
			Warnet.where({ "net_id" : netId })
				.fetch()
				.then(function (current_net) {
					current_net = current_net.toJSON();
					User.where({ "mbr_id" : current_net.net_owner })
					.fetch()
					.then(function(current_net_user) {
						Pc.query('where', 'pc_net_id', '=', netId)
						.count('pc_net_id')
						.then(function(current_pc){
							console.log(current_pc);
							res.render('./admin/add_net.html',{
								current_user: current_user,
								current_net: current_net,
								current_net_user: current_net_user.toJSON(),
								isBelong: current_user.mbr_username == username,
								isEdit : true
							});
						}); 
					})
					.catch(function(err){
						console.log("Warnet user :" + err);
						res.sendStatus(500);
					});
				})
				.catch(function(err){
					console.log("Warnet user :" + err);
					res.sendStatus(500);
				});
		})
		.catch(function(err){
			console.log("Warnet user :" + err);
			res.sendStatus(500);
		});
};

var saveWarnet = function (req, res) {
	var body = req.body,
		dirname = "/public/user/img/temp",
		file = req.file,
		tmp_path,
		target_path,
		name = body.name,
		kota = body.kota,
		phone = body.phone,
		alamat = body.alamat,
		keterangan = body.keterangan,
		latLng = body.latLng,
		printer = body.printer,
		game = body.game,
		pulsa = body.pulsa,
		ketik = body.ketik,
		acc = body.acc,
		otr = body.otr,
		jlh = body.jlh,
		err_msg = "Simpan Warnet Gagal.",
		username = req.session.user,
		current_user;

	if (file) {
		tmp_path = file.path;
	}

	if (!jlh) jlh = 0;

	if (name == '') { 
		return res.status(409).send(err_msg + " Nama tidak boleh kosong");
	}

	User
		.where({ "mbr_username" : username })
		.fetch()
		.then(function(current_user){
			current_user = current_user.toJSON();
			if (name == '') {
				return res.status(409).send(err_msg + " Nama warnet tidak boleh kosong");
			}

			new Warnet({
				'net_owner': current_user.mbr_id,
				'net_name': name,
				'net_city': kota,
				'net_map': latLng,
				'net_addr': alamat,
				'net_desc': keterangan,
				'net_phone': phone,
				'net_f_printer': !!printer,
				'net_f_pulsa': !!pulsa,
				'net_f_game': !!game,
				'net_f_ketik': !!ketik,
				'net_f_acc': !!acc,
				'net_f_otr': !!otr,
				'net_created': Date.now()
			})
			.save()
			.then(function(post) {
				post = post.toJSON();
				var id = post.id;
				target_path = __dirname + "/public/user/img/net/net" + id + ".jpg";
				target_path = target_path.replace("\handler", "");
				if (tmp_path) {
					fs.rename(tmp_path, target_path, function (err) {
						if (err) console.log(err);
						fs.unlink(tmp_path, function (err) {
							if (err) console.log(err);
						})
					})
				}

				for (var i = 0; i < jlh; i++) {
					new Pc({
						'pc_mbr_id': '',
						'pc_net_id': id,
						'pc_stat': true
					}).save();
				}

				res.end(JSON.stringify({status: 200, success: "Warnet Berhasil disimpan"}))		
			})
			.catch(function(err){
				fs.unlink(tmp_path, function (err) {
					if (err) console.log(err);
				})
				res.status(409).send(err_msg + " " + err);
			});
		})
		.catch(function(err){
			console.log("Warnet user :" + err);
			res.sendStatus(500);
		});
};

var updateWarnet = function (req, res) {
	var body = req.body,
		dirname = "/public/user/img/temp",
		file = req.file,
		tmp_path,
		target_path,
		name = body.name,
		kota = body.kota,
		phone = body.phone,
		alamat = body.alamat,
		keterangan = body.keterangan,
		latLng = body.latLng,
		printer = body.printer,
		pulsa = body.pulsa,
		game = body.game,
		ketik = body.ketik,
		acc = body.acc,
		otr = body.otr,
		jlh = body.jlh,
		err_msg = "Update Warnet Gagal.",
		current_user;

	if (file) {
		tmp_path = file.path;
	}

	if (!jlh) jlh = 0;	

	if (name == '') { 
		return res.status(409).send(err_msg + " Nama tidak boleh kosong");
	}

	new Warnet()
	.where({ 'net_id': body.id })
	.save({
		'net_name': name,
		'net_city': kota,
		'net_map': latLng,
		'net_addr': alamat,
		'net_desc': keterangan,
		'net_phone': phone,
		'net_f_printer': !!printer,
		'net_f_pulsa': !!pulsa,
		'net_f_game': !!game,
		'net_f_ketik': !!ketik,
		'net_f_acc': !!acc,
		'net_f_otr': !!otr,
		'net_created': Date.now()
	}, { 
		path: true,
		method: 'update' 
	})
	.then(function(post) {
		target_path = __dirname + "/public/user/img/net/net" + body.id + ".jpg";
		target_path = target_path.replace("\handler", "");
		if (tmp_path) {
			fs.rename(tmp_path, target_path, function (err) {
				if (err) console.log(err);
			})
		}
		new Pc()
		.where({ "pc_net_id" : req.params.id })
		.destroy()
		.then(function(model){
			for (var i = 0; i < jlh; i++) {
				new Pc({
					'pc_mbr_id': '',
					'pc_net_id': body.id,
					'pc_stat': true
				}).save();
			}
		});

		res.end(JSON.stringify({status: 200, success: "Warnet Berhasil diupdate"}))		
	})
	.catch(function(err){
		fs.unlink(tmp_path, function (err) {
			if (err) console.log(err);
		})
		res.status(409).send(err_msg + " " + err);
	});
};

var saveKomentar = function(req, res){
	var username = req.session.user,
		body = req.body,
		rating = body.rating,
		komentar = body.komentar;
	
	if (komentar == '') { 
		return res.status(409).send(err_msg + " Komentar tidak boleh kosong");
	}

	User
	.where({ "mbr_username" : username })
	.fetch()
	.then(function(current_user){
		current_user = current_user.toJSON();
		new Komentar({
			'com_net_id' : body.netId,
			'com_user_id' : current_user.mbr_id,
			'com_user_nm' : current_user.mbr_name,
			'com_desc' : komentar,
			'com_rate' : rating[0],
			'com_dt': Date.now()
		}).save()
		.then(function(komentar_dat) {
			Komentar
			.where({ "com_net_id" : body.netId })
			.fetchAll()
			.then(function (current_comment){
				if (current_comment.toJSON) {
					current_comment = current_comment.toJSON();
				}
				res.end(JSON.stringify({status: 200, success: "Komentar Berhasil disimpan", current_comment: current_comment }))		
			});
		});
	});
		
};

var warnet = function(req, res){
	var username = req.session.user;
	User
	.where({ "mbr_username" : username })
	.fetch()
	.then(function(current_user){
		current_user = current_user.toJSON();
		Warnet.where({ "net_owner" : current_user.mbr_id })
		.fetchAll()
		.then(function (current_warnet) {
			res.render('./admin/my_warnet.html', {
				current_user: current_user,
				current_warnet: current_warnet.toJSON()
			});
		});
	});
};

var deleteWarnet = function(req, res){
	new Warnet()
	.where({ "net_id" : req.params.id })
	.destroy()
	.then(function(model){
		new Pc()
		.where({ "pc_net_id" : req.params.id })
		.destroy()
		.then(function(model){
			res.sendStatus(204);
		});
	});
};

var profile = function (req, res) {
	var userId = req.params.id,
		username = req.session.user;

	if (userId) {
		User
			.where({ "mbr_id" : userId })
			.fetch()
			.then(function(current_user){
				current_user = current_user.toJSON();
				Warnet.where({ "net_owner" : current_user.mbr_id })
					.fetchAll()
					.then(function (current_warnet) {
						res.render('./admin/profile.html', {
							current_user: current_user,
							isBelong: current_user.mbr_username == username,
							current_warnet: current_warnet.toJSON(),
							isEdit: false 
						});
					});
			});
	}
}

var editProfile = function (req, res) {
	var userId = req.params.id,
		username = req.session.user;
	
	if (userId) {
		User
			.where({ "mbr_id" : userId })
			.fetch()
			.then(function(current_user){
				current_user = current_user.toJSON();
				Warnet.where({ "net_owner" : current_user.mbr_id })
					.fetchAll()
					.then(function (current_warnet) {
						res.render('./admin/profile.html', {
							current_user: current_user,
							isBelong: current_user.mbr_username == username,
							current_warnet: current_warnet.toJSON(),
							isEdit: true 
						});
					});
			});
	}
}

var updateProfile = function (req, res) {
	var body = req.body,
		dirname = "/public/user/img/temp",
		file = req.file,
		tmp_path,
		target_path = __dirname + "/public/user/img/profile/prof" + body.id + ".jpg",
		name = body.name,
		email = body.email,
		tempatLahir = body.tempatLahir,
		dateLahir = body.dateLahir,
		phone = body.phone,
		err_msg = "Update Profile Gagal.";

	target_path = target_path.replace("\handler", "");
	
	if (file) {
		tmp_path = file.path;
	}

	if (name == '') {
		return res.status(409).send(err_msg + " Nama tidak boleh kosong");
	}
	if (email == '') {
		return res.status(409).send(err_msg + " Email tidak boleh kosong");
	}
	if (tempatLahir == '') {
		return res.status(409).send(err_msg + " Tempat Lahir tidak boleh kosong");
	}
	if (dateLahir == '') {
		return res.status(409).send(err_msg + " Tanggal Lahir tidak boleh kosong");
	}

	new User()
	.where({ 'mbr_id': body.id })
	.save({
		'mbr_name': name,
		'mbr_tempat_lahir': tempatLahir,
		'mbr_tgl_lhr': dateLahir,
		'mbr_email': email,
		'mbr_phone': phone	
	}, { 
		path: true,
		method: 'update' 
	})
	.then(function(post) {
		if (tmp_path) {
			fs.rename(tmp_path, target_path, function (err) {
				if (err) console.log(err);
			})
		}
		
		res.end(JSON.stringify({status: 200, success: "Profil Berhasil diupdate"}))		
	})
	.catch(function(err){
		fs.unlink(tmp_path, function (err) {
			if (err) console.log(err);
		})
		res.status(409).send(err_msg + " " + err);
	});
}

var profileImg = function (req, res) {
	var userId = req.params.id,
		dirname = "./public/user/img",
		img;

	var path = dirname + "/profile/prof" + userId + ".jpg"; 
	
	fs.readFile(path, function (err, content) {
		if (err) {
			fs.readFile(dirname + "/empty_profile.jpg", function (err, content) {
				if (err) {
					res.writeHead(400, {'Content-type':'text/html'})
					console.log(err);
					res.end("Gambar tidak ditemukan");    
				} else {
					res.writeHead(200,{'Content-type':'image/jpg'});
					res.end(content);
				}
			});
		} else {
			res.writeHead(200,{'Content-type':'image/jpg'});
			res.end(content);
		}
	});
}

handler = {
	index : index,
	logout: logout,
	profile: profile,
	editProfile: editProfile,
	updateProfile: updateProfile,
	warnet: warnet,
	saveKomentar: saveKomentar, 
	newWarnet: newWarnet,
	showWarnet: showWarnet,
	editWarnet: editWarnet,
	saveWarnet: saveWarnet,
	updateWarnet: updateWarnet,
	deleteWarnet : deleteWarnet,
	search: search
};

module.exports = handler;