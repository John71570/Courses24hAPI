var passport = require('passport');
var LocalStrategy = require('passport-local');
var sequelize = require('../config/config-database').sequelize;
var Equipe = sequelize.import('../models/equipe');
var sha256 = require('sha256');

let localAuthenticationConfiguration = passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	},
	function(login, password, done) {
		Equipe.findOne({ raw: true, where: { equipe_nom: login }})
			.then( equipe => {

				setTimeout(function () {

					if (!equipe) {
						return done(null, false, {message: 'Incorrect username.'});
					}
					if (equipe.equipe_mdp != sha256.x2(password + equipe.equipe_sel)) {
						return done(null, false, {message: 'Incorrect password.'});
					}
					return done(null, equipe);

				}, 1000);

			})
			.catch( err => {
				return done(err);
			});
	}
));

passport.serializeUser(function(equipe, done) {
	done(null, equipe);
});

passport.deserializeUser(function(equipe, done) {
	done(null, equipe);
});

module.exports = {
	localAuthenticationConfiguration: localAuthenticationConfiguration
}