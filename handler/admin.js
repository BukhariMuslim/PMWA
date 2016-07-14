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


handler = {
	index : index,
	logout: logout
};

module.exports = handler;