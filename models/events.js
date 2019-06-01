let mongoose=require('mongoose');

//events schema
let eventSchema = mongoose.Schema({
	event_UserName:{
		type:String,
		required: true
	},
	event_name:{
		type:String,
		required: true
	},

	event_body:{
		type:String,
		required: true
	}

});

let Events = module.exports=mongoose.model('events', eventSchema);
