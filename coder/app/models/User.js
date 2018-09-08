//defining mongoose Schema
//including module
var mongoose = require('mongoose');
//declare schema object
var Schema =mongoose.Schema;
var userSchema= new Schema({
  name            :   {type:String, default:'',required:true},
  email           :   {type:String, deafult:'',required:true},
  mobileno        :   {type:Number, default:''},
  password        :   {type:String, default:''},
  bdate           :   {type:Date},
  gender          :   {type:String}
});


mongoose.model('User',userSchema);
