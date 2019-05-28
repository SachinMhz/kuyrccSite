const LocalStrategy = require('passport-local').Strategy;
const User= require('../models/users');
const config=require('../config/database');
const bcrypt= require('bcryptjs');

module.exports=function(passport){
	//Local Strategy
	passport.use(new LocalStrategy({
		usernameField:'LoginEmail',
		passwordField:'LoginPassword'},

		function(username, password , done){
		//Match Username
		let query={email:username};
		User.findOne(query, function(err, users){
			if(err) throw err;
			if(!users){
				console.log('No user');
				return done(null, false,{message: 'No User Found'});

			}
			if(users){
				console.log('User found');
			}
			//Match password
			bcrypt.compare(password,users.pwd, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					console.log('Password Matched');
					return done(null,users,{message: 'successfully Login'});
				}
				else{
					return done(null, false,{message: 'Wrong Password'});
				}
			});
		});

	}));

	passport.serializeUser(function(users, done) {
	  done(null, users.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, users) {
	    done(err, users);
	  });
	});
}
