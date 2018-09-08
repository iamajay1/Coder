var mongoose = require('mongoose');
var userModel = mongoose.model('User');

//app level middleware to set request user
//to check if its a legitimate user of the system
 exports.setLoggedInUser = function(req,res,next){
// checks wheather the session and session.user is exits or not
   if(req.session && req.session.user){
     userModel.findOne({'email':req.session.user.email},function(err,user){
       if(user){
         //req.user = user;
         //delete req.user.password;
         req.session.user = user;
          //deleting password
         delete req.session.user.password;
         next();

       }else{

       }
     });
   }else{
     next();
   }
 }


exports.checkLogin = function(req,res,next){
  if(!req.session.user){
    //if the user doen't exit, just redirect him on login screen
    res.redirect('/');

  }else {
    //if exit then move forward
    next();
  }
}
