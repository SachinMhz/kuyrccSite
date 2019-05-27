const express = require('express');
const passport=require('passport');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const expressValidator = require('express-validator');
const flash =  require('connect-flash');
const session = require('express-session');
const config=require('./config/database');
const bcrypt=require('bcryptjs');


mongoose.connect('mongodb://localhost:27017/KUYRCCdb');
let db = mongoose.connection;
//this line was added
//check db connection
db.once('open', function(){
	console.log('connected to mongoDB');
});

//check for db errors
db.on('error', function(err){
	console.log(err);
});

//init backend
const backend=express();
//defining path to img folder
backend.use(express.static('img'));
//backend.use(express.static(path.join(__dirname,'nameOfFile')));

//passport config
require('./config/passport')(passport);

//passport middleware
backend.use(passport.initialize());
backend.use(passport.session());

//setting global variables
backend.use(function(req,res,next){
		res.locals.usersGlobal = req.users || null;
		console.log('from backend.use');
		console.log(req.users);
		console.log(res.locals.usersGlobal);
		next();
});

//Login Route
backend.get('/login', function(req, res){
			res.render('login');
			console.log("loginROute");
});


//setting global user variable for all url
backend.get('*', function(req,res,next){
	res.locals.usersGlobal=req.users || null;
	console.log(res.locals.usersGlobal);
	next();
	if(!req.users){
		console.log('Express session is not started');
	}
	else{
		console.log('Express session is started');
	}
});

//express Session middle Middleware
backend.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

//express Message  Middlewar
backend.use(require('connect-flash')());
backend.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator Middlewar
backend.use(expressValidator());


//Bring in models
let dbvariable = require('./models/users');

//load view engine
backend.set('views', path.join(__dirname, 'views'));
backend.set('view engine','pug');

//Body parser Middleware
// parse application/x-www-form-urlencoded
backend.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
backend.use(bodyParser.json())

//home route
backend.get('/', function(req, res){
				res.render('index',{
				title:'KUYRCC'
	});
});
//FrontEnd page route
backend.get('/frontend', function(req, res){
				res.render('frontend',{
					title:'FrontEnd'
	});
});

//add route
backend.get('/registerPage', function(req, res){
	res.render('register',{
		title:'Register'
	});
});

//for checking if users are registered in database or not route
backend.get('/checklist', function(req, res){
		dbvariable.find({}, function(err, users){
			if(err){
				console.log(err);
			}else{
				res.render('lists',{
					title:'Lists',
					users: users
				});
			}
		});
	});

//getting single user information
backend.get("/users/:id",function(req,res){
			dbvariable.findById(req.params.id,function(err,users){
				res.render('user',{
					title:"Users Details",
					users:users
				});
			});
	});


//logout route
backend.get('/logout',function(req,res){
	req.logout();
	req.flash('success','You are logged out');
	res.redirect('/frontend');
});

//add login route
backend.post('/:id', function(req, res){
	const email=req.body.LoginEmail;
	const pwd=req.body.LoginPassword;
	console.log("login process");
	req.checkBody('LoginEmail','Email is required').notEmpty();
	req.checkBody('LoginEmail','Email is not valid').isEmail();
	req.checkBody('LoginPassword','Password is required').notEmpty();
	req.checkBody('LoginPassword','wrong password').equals(req.body.LoginPassword);
	let errors = req.validationErrors();
	if(errors){
		res.render('frontend',{
			errors:errors
		});
	}else{
		req.flash('success','You are logged in');
		dbvariable.findUserByEmail(email,function(err,users){
			res.render('frontend',{
				title:"Users Found",
				users:users,
			});
		});
		// res.locals.userGolbal = req.users;
		// console.log(req.users);
	}
});

//add registration route
backend.post('/:id', function(req, res){
	const name=req.body.RegName;
	const email=req.body.RegEmail;
	const pwd=req.body.RegPassword;
	const conpwd=req.body.RegCPassword;
	console.log("registration process");
	req.checkBody('RegName','UserName is required').notEmpty();
	req.checkBody('RegPassword')
		    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')
		    .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long and contain number').matches(/\d/);

	req.checkBody('RegEmail','Email is required').notEmpty();
	req.checkBody('RegEmail','Email is not valid').isEmail();
	req.checkBody('RegPassword','Password is required').notEmpty();
	req.checkBody('RegCPassword','Passwords do not match').equals(req.body.RegPassword);

	let errors = req.validationErrors();
	if(errors){
		res.render('frontend',{
			errors:errors
		});
	}else{
			let x= new dbvariable({
				name:name,
				email:email,
				pwd:pwd,
				conpwd:conpwd

			});

			bcrypt.genSalt(10,function(err,salt){
				bcrypt.hash(x.pwd,salt,function(err, hash){
					if(err){
						console.log(err);
					}
					x.pwd=hash;
					x.save(function(err){
						if(err){
							console.log(err);
							return;
						}
						else{
							req.flash('success','You  are now registered and can now log in');
							res.redirect('frontend');
						}
					});
				});
			});
	}
});

//to start server
backend.listen(3000,function(){
	console.log('Server started on port 3000...');
});
