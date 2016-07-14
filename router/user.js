var express = require('express'),
	r = express.Router(),
	h = require('../handler').user,
	auth = require('../auth'),
	router;

router = function(app){
	r.get('/login', auth.admin, h.login);
	r.get('/profile_img/:id', h.profileImg);
	r.get('/net_img/:id', h.netImg);
	r.post('/logging_in', h.logging_in);
	r.get('/register', auth.admin, h.register);
	r.post('/registering', h.registering);
	app.use(r);
};
module.exports = router;