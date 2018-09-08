var mongoose = require('mongoose');
var express = require('express');
var userRouter = express.Router();
var userModel = mongoose.model('User');
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require('./../../middlewares/auth');
var helmet =require('helmet');
var nodemailer = require('nodemailer');
module.exports.controller_1 = function(app){
  userRouter.use(helmet());
  userRouter.get('/',function(req,res){
    res.render('login');
  }); //end login screen
  userRouter.get('/signup',function(req,res){
    res.render('signup');
  });// end of sign up screen

  userRouter.get('/profile',auth.checkLogin,function(req,res){

      res.render('profile',{user:req.session.user,cart:req.session.cart});

  });//end of dashboard screen

  userRouter.get('/logout',function(req,res){
    req.session.destroy(function(err){
    res.redirect('/');
    });
  });
  userRouter.get('/all',function(req,res){
    userModel.find({},function(err,allUsers){
      if(err){
        res.send(err);
      }else{
        res.send(allUsers);
      }
    });//end userModel find
  });//end get all user

  userRouter.post('/users/signup',function(req,res){
    if(req.body.name!=undefined && req.body.email!=undefined && req.body.mobileno!=undefined && req.body.password!=undefined && req.body.bdate!=undefined && req.body.gender!=undefined ){
      var newUser =new userModel({

        name            :   req.body.name,
        email           :   req.body.email,
        mobileno        :   req.body.mobileno,
        password        :   req.body.password,
        bdate           :   req.body.bdate,
        gender          :   req.body.gender
      }); //end new user

      newUser.save(function(err){
        if(err){
          console.log("errrrrrrrrrrrrrr");
          var myResponse = responseGenerator.generate(true,err,500,null);
        //  res.render(myResponse);
         res.render('error',{
           message:myResponse.message,
           error:myResponse.data,
           user:req.session.user,

         });

        }else{
          console.log("success");
        //    var myResponse = responseGenerator.generate(false,"The User Is Registered Successfully",200,newUser);
              req.session.user =newUser;
              //delete the password from session information
              delete req.session.user.password;
              res.redirect('/dashboard');

        }
      });// end new user save

    }else{
      var myResponse = {
        error : true,
        message : "some body parameter is missing"  ,
        status : 403,
        data : null
      };
      res.render(myResponse);
    }
  });

  userRouter.post('/users/login', function(req,res){
    userModel.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]},function(err,foundUser){
      if(err){
          var myResponse = responseGenerator.generate(true,err,403,null);
          res.render(myResponse);
      }else if (foundUser == null || foundUser == undefined || foundUser.name == undefined) {
        var myResponse= responseGenerator.generate(true,"user not found, check your Email ID OR Password",404,null);
        //res.render(myResponse);
        console.log(myResponse.message);
        res.render('error',{

          message:myResponse.message,
          error:myResponse.data,
          user:req.session.user,

        });
      }else {
      //    var myResponse =responseGenerator.generate(false,"Login Successfully",200,foundUser);
        //  res.render(myResponse);
        console.log("user found");
        req.session.user = foundUser;
        delete req.session.user.password;
        res.redirect('/dashboard');
      }
    }); //end find
  });// end login api
  
  app.use('/', userRouter);
}
