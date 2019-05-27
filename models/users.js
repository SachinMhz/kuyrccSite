let mongoose=require('mongoose');

//users schema
let userSchema=mongoose.Schema({
	name:{
		type:String,
		required: true
	},
	email:{
		type:String,
		required: true
	},

	pwd:{
		type:String,
		required: true
	},
	conpwd:{
		type:String,
		required: true
	}
});

var user= module.exports=mongoose.model('Users',userSchema);


//user defined functions
module.exports.findUserByEmail = function(email,callback){
	var query = {email : email};
	user.findOne(query,callback);
	console.log(user.findOne(query));
	return user;
}
