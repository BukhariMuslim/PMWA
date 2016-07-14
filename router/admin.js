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
	r.get('/warnet/', auth.user, h.warnet);
	r.get('/warnet/new', auth.user, h.newWarnet);
	r.get('/warnet/edit/:id', auth.user, h.editWarnet);
	r.post('/warnet/saveWarnet', auth.user, h.saveWarnet);
	r.put('/warnet/updateWarnet', auth.user, h.updateWarnet);
	r.delete('/warnet/delete/:id', auth.user, h.deleteWarnet);
	r.get('/warnet/:id', auth.net, h.showWarnet);
	r.get('/admin/logout', auth.user, h.logout);
	app.use(r);
};

module.exports = router;