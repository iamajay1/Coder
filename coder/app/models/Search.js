//defining mongoose Schema
//including module
var mongoose = require('mongoose');
//declare schema object
var Schema =mongoose.Schema;
var searchSchema= new Schema({
  sId                :   {type:Number,id:true},
  sText              :   {type:String, default:'',required:true},
  sName              :   {type:String, default:'',required:true}
	
});


mongoose.model('Search',searchSchema);
