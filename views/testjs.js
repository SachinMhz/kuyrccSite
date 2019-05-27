var user= module.exports=mongoose.model('Users',userSchema);


//user defined functions
module.exports.findUserByEmail = function(email,callback){
	var query = {email : email};
	user.findOne(query,callback);
}


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
		dbvariable.findUserByEmail(email,function(err,users){
			res.render('frontend',{
				title:"Users Found",
				users:users,
			});
		});
		//res.locals.userGolbal = users
	}
});
