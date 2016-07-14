var User = require('../model/user'),
	Permission = require('../model/permission'),
	Pc = require('../model/pc'),
	Warnet = require('../model/warnet'),
	Komentar = require('../model/komentar'),
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

var logout = function(req, res){
	req.session.destroy(function (err) {
		res.redirect('../');
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

handler = {
	index : index,
	logout: logout,
	profile: profile,
	editProfile: editProfile,
	updateProfile: updateProfile,
};

module.exports = handler;