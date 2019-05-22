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

let user= module.exports=mongoose.model('Users',userSchema);
