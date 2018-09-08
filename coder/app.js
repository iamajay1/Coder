var express= require('express');
var app = express();
var mongoose = require('mongoose');
var server = require('http').createServer( app )
var util =require('util');
var bodyParser= require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger =require('morgan');
var path=require('path');
var fs = require('fs');
var helmet = require('helmet');
var userRouter =express.Router();
//var User = mongoose.model('User');
//var methodOverride = require('method-override');
var auth2 = require('./middlewares/auth2.js');
var port = process.env.PORT||1993;

app.use(require('morgan')('combined'));

//-------------------------------------------------------------------
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());
app.use(session({
 name :  'my cat',
 secret : 'myAppSecret', //encryption key
 resave : true,
 httpOnly :  true,// to prevent cookie forgery
 saveUninitialized : true,
 cookie : { secure : false} //make it true in case of ssl
}));
//-----------------------Database work---------------------------------------//
var dbPath="mongodb://localhost/myCoder";

db = mongoose.connect(dbPath);
mongoose.connection.once('open',function(){
  console.log('Connected To Database Successfully!');
});
//-----------------------------------------
//configure view engine to render EJS templates
app.set('views',path.join(__dirname + '/app/views'));
app.set('view engine', 'ejs');
//cmd- npm install ejs --save
app.use(express.static(__dirname + '/public'));

//------------recognised JS file--------------------------------

fs.readdirSync('./app/models').forEach(function(file){
  if(file.indexOf('.js'))

  require('./app/models/'+file);
});

fs.readdirSync('./app/controllers').forEach(function(file){
  if(file.indexOf('.js')){
    var route = require('./app/controllers/'+file);

    route.controller_1(app);

  }
});

//including auth file
var auth = require('./middlewares/auth.js');

//----------------------------------------------
//var mongoose = require('mongoose');
var userModel = mongoose.model('User');

//set the middleware as app level middleware
app.use(function(req,res,next){
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
});

//define routes


app.get('/',function(req,res){
  res.render('login',{user:req.session.user});
});

//app.get('/Search',function(req,res){
 // res.render('dashboard',{user: req.session.user});
//});

app.get('/dashboard',function(req,res){
  res.render('dashboard',{user:req.session.user});
});
app.get('/logout',function(req,res){
   req.logout();
  res.redirect('/');
});

app.get('/signup',function(req,res){
  res.render('signup');
});


//------------------------------------error detect---------------------------
app.use(function(err,req,res,next){
  res.status(err.status || 500);
  res.render('error',{
    message:err.message,
    error:err,
    user:req.session.user,
   
  });
});
app.use(function(err,req,res,next){
  res.status(err.status || 404);
  res.render('error',{
    message:err.message,
    error:err,
    user:req.session.user,
   
  });
});
//-------------------------localhost--------------------------------
server.listen(port,function(){
  console.log("Listening on port:" +port);
});
//--------------------Google Authentication--------------------------

function ensureAuthenticated(req,res,next){
   if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
