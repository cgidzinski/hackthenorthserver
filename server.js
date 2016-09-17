// server.js

// set up ======================================================================
var express  = require('express');
var app      = express();

var http = require('http').Server(app);

var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');

var config = require('./config/database.js');
var favicon = require('serve-favicon');


// CORS =======================================================================
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,x-access-token');
if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
});
//app.enable('trust proxy');

// configuration ===============================================================
mongoose.connect(config.url); // connect to our database
app.set('superSecret', config.secret); // secret variable


 app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));

app.use(favicon(__dirname + '/public/icon.ico'));
//mongoose.set('debug', true); //Enable Debug Mode for Mongoose

// routes ======================================================================
 require('./routes/api/root.js')(app, express);
// launch ======================================================================
http.listen(port);
console.log('The magic happens on port ' + port);