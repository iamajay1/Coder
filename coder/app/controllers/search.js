var mongoose = require('mongoose');
var express = require('express');
var bodyParser= require('body-parser');
var fs = require('fs');
var userRouter = express.Router();
var userModel = mongoose.model('Search');
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require('./../../middlewares/auth');
var methodOverride = require('method-override');
var path=require('path');
var main=this;
this.text={};
const axios = require('axios');
   // to use of put method in html forms by using methodOverride put method will work
module.exports.controller_1 = function(app){

//--------------------------------------------------useing for to send put req to backend from frontend-------------------------
  userRouter.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));
//-----------------------------------------dashboard-----------------------------------------------------------  
    userRouter.get('/dashboard',auth.checkLogin,function(req,res){
    userModel.find({},function(err,search){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,err,500,null);
      //  res.render(myResponse);
          res.render('error',{
              message:myResponse.message,
              error:myResponse.data,
              user:req.session.user,

            });

      }else{
        userModel.count({},function(err,count){
          if(err){

            console.log(err);
            var myResponse = responseGenerator.generate(true,err,500,null);
          //  res.render(myResponse);
              res.render('error',{
                  message:myResponse.message,
                  error:myResponse.data,
                  user:req.session.user,

                });

          }else{
              res.render(
                'dashboard',{
                    user:req.session.user,
					search:search,
								
                    count:count

                });
          }
        });//usermodel
      }//else
    });//end userModel find
  });//end get all product
  
//-------------------------------------------------------search store to db----------------------------------------------------
app.set('json spaces', 2);
  userRouter.post('/users/Search',auth.checkLogin,function(req,res){
    console.log(req.body);
    console.log(req.files);
    if(!req.body && !req.files){
    res.json({success: false});
        }else{
          var c;
            userModel.findOne({},function(err,search){
              console.log("into detail");

              if (search) {
                console.log("if");
                c = search.id + 1;
              }else{
                c=1;
              }
        var newSearch =new userModel({
        id                 :   c,
        sText              :   req.body.sText,
		sName			   :   req.body.sName 
      }); //end new search
      newSearch.save(function(err,result){
        if(err){
          console.log("error");
          var myResponse = responseGenerator.generate(true,err,500,null);
        //  res.render(myResponse);
            res.render('error',{
                message:myResponse.message,
                error:myResponse.data,
                user:req.session.user,

              });
        }else{
              console.log("success");
			    axios.get('https://api.github.com/search/repositories?q='+req.body.sText)
				.then(response => {
					console.log(response.data);
				  res.json(response.data);
					//main.text=response.data	
				//	res.render('data',{
					//	data:response.data
					//}); 
				})
				.catch(error => {
					console.log(error);
				});
			  //                res.redirect('https://api.github.com/search/repositories?q='+ req.body.sText);
				
        }//else end
      });
    })// end new user save
     }//else
});//userRouter

  //----------------------------------allproduct--------------------------------------

userRouter.get('/allsearch',function(req,res){
  userModel.find({},function(err,search){
    if(err){
      res.send(err);
    }else{
      //res.render('dashboard',{product:product});
     res.send(search);
    }
  });//end userModel find
});
//  view product
  app.use('/', userRouter);
}
