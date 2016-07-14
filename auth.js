var hUser = require('./handler').user,
	hAdmin = require('./handler').admin;

function unauthorizedUser(res){
	// res.redirect('./');
	res.render('./user/index.html');
	// return res.sendStatus(401);
};

function unauthorizedAdmin(res){
	// res.redirect('./');
	res.render('./admin/index.html');
	// return res.sendStatus(401);
};

function unauthorizedForNet(res){
	// res.redirect('./');
	res.render('./user/net.html');
	// return res.sendStatus(401);
};

function user(req, res, next){
	if (typeof req.session.user !== 'undefined'){
		return next();
	}
	else {
		hUser.index(req, res, next);
	}
	// return unauthorizedUser(res);
};

function net(req, res, next){
	if (typeof req.session.user !== 'undefined'){
		return next();
	}
	else {
		hUser.showWarnet(req, res, next);
	}
	// return unauthorizedForNet(res);
};

function netAdmin(req, res, next){
	if (typeof req.session.user === 'undefined'){
		return next();
	}
	else {
		hAdmin.showWarnet(req, res, next);
	}
	// return unauthorizedForNet(res);
};

function admin(req, res, next){
	if (typeof req.session.user === 'undefined'){
		return next();
	}
	else {
		hAdmin.index(req, res, next);
	}
	// return unauthorizedAdmin(res);
};

var auth = {
	user : user,
	net : net,
	admin : admin
}

module.exports = auth;