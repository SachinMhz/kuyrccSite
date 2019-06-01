let mongoose=require('mongoose');

//question schema
let questionSchema = mongoose.Schema({
	question_UserName:{
		type:String,
		required: true
	},
  question_email:{
		type:String,
		required: true
	},

	question_body:{
		type:String,
		required: true
	}

});

let Questions = module.exports=mongoose.model('questions', questionSchema);
