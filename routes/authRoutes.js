const passport = require('passport');

module.exports = (app) => {
	app.get(
		'/auth/google',
		passport.authenticate('google', {
			scope: [ 'profile', 'email' ]
		})
	);

	app.get('/auth/google/callback', passport.authenticate('google'));

	// kills the cookie holding user identity
	app.get('/api/logout', (req, res) => {
		req.logout();
		res.send(req.user);
	});

	//inspect req.user and test auth
	//visit api/current user, should see user details
	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
	});
};
