var hUser = require('./handler').user,
	hAdmin = require('./handler').admin;

function user(req, res, next){
	if (typeof req.session.user !== 'undefined'){
		return next();
	}
	else {
		hUser.index(req, res, next);
	}
};

function net(req, res, next){
	if (typeof req.session.user !== 'undefined'){
		return next();
	}
	else {
		hUser.showWarnet(req, res, next);
	}
};

function netAdmin(req, res, next){
	if (typeof req.session.user === 'undefined'){
		return next();
	}
	else {
		hAdmin.showWarnet(req, res, next);
	}
};

function admin(req, res, next){
	if (typeof req.session.user === 'undefined'){
		return next();
	}
	else {
		hAdmin.index(req, res, next);
	}
};

var auth = {
	user : user,
	net : net,
	admin : admin
}

module.exports = auth;