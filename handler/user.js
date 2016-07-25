var Warnet = require('../model/warnet'),
	User = require('../model/user'),
	Pc = require('../model/pc'),
	Permission = require('../model/permission'),
	Komentar = require('../model/komentar'),
	fs = require('fs'),
	handler;

var index = function(req, res){
	Warnet.fetchAll()
		.then(function(current_warnet){
			Warnet
			.query(function(qb){
				qb.orderBy('net_created', 'DESC').limit(10);
			})
			.fetchAll()
			.then(function(new_net) {
				res.render('./user/index.html',{
					new_net:new_net.toJSON(),
					current_warnet: current_warnet.toJSON()
				});
			});
		}).catch(function(err){
			console.log("Warnet err :" + err);			
			res.sendStatus(500);
		});
};

var search = function(req, res){
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
						res.render('./user/index.html',{
							new_net: new_net.toJSON(),
							result: result,
							current_warnet: search_net
						});
					})
				}
				else {
					res.render('./user/index.html',{
						new_net:new_net.toJSON(),
						current_warnet: current_warnet.toJSON()
					});
				}
			});
		}).catch(function(err){
			console.log("Warnet err :" + err);			
			res.sendStatus(500);
		});
};

var showWarnet = function(req, res){
	var netId = req.params.id;
	
	Warnet.where({ "net_id" : netId })
		.fetch()
		.then(function (current_net) {
			current_net = current_net.toJSON();
			User.where({ "mbr_id" : current_net.net_owner })
			.fetch()
			.then(function(current_net_user) {
				if (current_net_user.toJSON) {
					current_net_user = current_net_user.toJSON();
				}
				Pc.query('where', 'pc_net_id', '=', netId)
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
						res.render('./user/net.html',{
							current_net: current_net,
							current_pc: current_pc,
							current_comment: current_comment,
							current_net_user: current_net_user
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
};

var login = function(req, res){
	res.render('./user/login.html');
};

var register = function(req, res){
	res.render('./user/register.html');
};

var logging_in = function(req, res){
	var username = req.body.username,
		pass = req.body.password,
		url = './user/login.html',
		err_msg = "Kombinasi username dan password tidak ditemukan.",
		realPass;

	User.where('mbr_username', username)
	.fetch()
	.then(function(user){
		realPass = user.get('mbr_password');
		if (pass === realPass){
			req.session.user = username;
			if(username === "admin"){
				req.session.admin = true;
			}
			res.end(JSON.stringify({status: 200, success: "Login Success"}))
			// res.render("./admin/index.html");
			// res.redirect('/');
		}else{
			res.status(401).send(err_msg);
		};
	}).catch(function(err){
		res.status(401).send(err_msg);
	}); 
};

var registering = function (req, res) {
	var err_msg = "Pendaftaran gagal.";	
	var username = req.body.username;
	var password = req.body.password;
	var confPassword = req.body.confPassword;
	var name = req.body.name;
	var email = req.body.email;
	var tempatLahir = req.body.tempatLahir;
	var dateLahir = req.body.dateLahir;
	var phone = req.body.phone;

	if (username == '') { 
		return res.status(409).send(err_msg + " Username tidak boleh kosong");
	}
	if (password == '') {
		return res.status(409).send(err_msg + " Password tidak boleh kosong");
	}
	if (password != confPassword) {
		return res.status(409).send(err_msg + " Konfirmasi Password tidak sama old = (" + password + "), conf = (" + confPassword + ")");
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

	new User({
		'mbr_username': username,
		'mbr_password': password,
		'mbr_name': name,
		'mbr_email': email,
		'mbr_tempat_lahir': tempatLahir,
		'mbr_tgl_lhr': dateLahir,
		'mbr_phone': phone,
		'mbr_act': true
	}).save()
	.then(function(user){
		new Permission({
			'manage_user': true,
			'manage_post': true,
			'username': user.get('mbr_username')
		}).save()
		.then(function(permission){
			res.end(JSON.stringify({status: 200, success: "Akun berhasil didaftarkan"}))
		})
	})
	.catch(function(err){
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

var netImg = function (req, res) {
	var userId = req.params.id,
		dirname = "./public/user/img",
		img;
	
	var path = dirname + "/net/net" + userId + ".jpg"; 
	
	fs.readFile(path, function (err, content) {
		if (err) {
			fs.readFile(dirname + "/empty_computer.jpg", function (err, content) {
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
	index: index,
	logging_in: logging_in,
	login: login,
	register: register,
	registering: registering,
	showWarnet: showWarnet,
	profileImg: profileImg,
	netImg: netImg,
	search: search
};

module.exports = handler;