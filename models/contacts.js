let mongoose=require('mongoose');

//contacts schema
let contactSchema = mongoose.Schema({
  Name:{
    type:String,
    required: true

  },
  Email_id:{
    type: String,
    required: true

  },
  Mobile_no:{
    type: String,
    required: true
  }

});

let Contacts = module.exports=mongoose.model('contacts', contactSchema);
