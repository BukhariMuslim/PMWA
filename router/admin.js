var express = require('express'),
	multer = require('multer'),
	upload = multer({
		dest: 'public/user/img/temp/',
		onFileUploadStart: function (file) {
			console.log(file.originalname + ' is starting ...')
		}
	}),
	r = express.Router(),
	h = require('../handler').admin,
	auth = require('../auth'),
	router;

router = function(app){
	r.get('/', auth.user, h.index);
	r.get('/profile/:id', auth.user, h.profile);
	r.get('/profile/edit/:id', auth.user, h.editProfile);
	r.put('/profile/updateProfile', upload.single('gambar'), auth.user, h.updateProfile);
	r.get('/warnet/', auth.user, h.warnet);
	r.get('/warnet/new', auth.user, h.newWarnet);
	r.get('/warnet/edit/:id', auth.user, h.editWarnet);
	r.post('/warnet/saveWarnet', upload.single('gambar'), auth.user, h.saveWarnet);
	r.put('/warnet/updateWarnet', upload.single('gambar'), auth.user, h.updateWarnet);
	r.post('/postComment', auth.user, h.saveKomentar);
	r.delete('/warnet/delete/:id', auth.user, h.deleteWarnet);
	r.get('/warnet/:id', auth.net, h.showWarnet);
	r.get('/admin/logout', auth.user, h.logout);
	r.get('/search/', auth.search, h.search);
	app.use(r);
};

module.exports = router;