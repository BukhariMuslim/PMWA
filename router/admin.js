var express = require('express'),
	r = express.Router(),
	h = require('../handler').admin,
	auth = require('../auth'),
	router;

router = function(app){
	r.get('/', auth.user, h.index);
	r.get('/profile/:id', auth.user, h.profile);
	r.get('/profile/edit/:id', auth.user, h.editProfile);
	r.put('/profile/updateProfile', auth.user, h.updateProfile);
	r.get('/admin/logout', auth.user, h.logout);
	app.use(r);
};

module.exports = router;