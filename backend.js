const express = require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const expressValidator = require('express-validator');
const flash =  require('connect-flash');
const session = require('express-session');

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
//add registration route
backend.post('/:id', function(req, res){
	console.log('submitted');
	req.checkBody('RegName','UserName is required').notEmpty();
	req.checkBody('RegPassword')
		    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')
		    .isLength({ min: 5 }).withMessage('must be at least 5 chars long and contain number').matches(/\d/);
	// req.checkBody('RegCPassword').custom((value, { req }) => {
	//   if (value != req.body.RegPassword) {
	//     throw new Error('Password confirmation does not match password');
	//   }return true;
	// });
	//get errors
	let errors = req.validationErrors();
	if(errors){
		res.render('frontend',{
			errors:errors
		});
	}else{
			let x= new dbvariable();
			x.name=req.body.RegName;
			x.email=req.body.RegEmail;
			x.password=req.body.RegPassword;

			x.save(function(err){
				if(err){
					console.log(err);
					return;
				}
				else{
					req.flash('success','User is added');
					res.redirect('/frontend');
				}
			});
	}
	return;
});

//to start server
backend.listen(3000,function(){
	console.log('Server started on port 3000...');
});
