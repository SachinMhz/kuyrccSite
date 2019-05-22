const LocalStrategy = require('passport-local').Strategy;
const tuser= require('../models/users');
const config=require('../config/database');
const bcrypt= require('bcryptjs');

module.exports=function(passport){
	//Local Strategy
	passport.use(new LocalStrategy(function(username, password, done){
		//Match Username
		let query={username:username};
		tuser.findOne(query, function(err, users){
			if(err) throw err;
			if(!users){
				console.log('No user');
				return done(null, false,{message: 'No User Found'});

			}
			//Match password
			bcrypt.compare(password,user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null,user);
					console.log('user');
				}
				else{
					return done(null, false,{message: 'Wrong Password'});

				}
			});
		});

	}));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
}
