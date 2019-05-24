'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
const mongoose  = require('mongoose');
const helmet    = require('helmet');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var app = express();

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({setTo: 'PHP 4.2.0'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//front-end libraries
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/util', express.static(process.cwd() + '/util'));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/testAPI.html', function(req,res) {
    res.sendFile(process.cwd() + '/views/testAPI.html');
});
  
//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
app.use('/api', apiRoutes);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  return next({status: 404, message: 'Path Not Found'})
});

// Error Handling
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }

  console.log(errCode + ' ' + errMessage)
  res.status(errCode).json({error: errMessage});  
})

//initialize db before starting up the server
const initDb = require("./util/db").initDb;
initDb( (err) => {
    if (err) 
        console.log('Error connecting to DB', err.name + ': ' + err.message);
    else {
      //Start our server and tests!
      app.listen(process.env.PORT || 3000, function () {
        console.log("Listening on port " + process.env.PORT);
        if(process.env.NODE_ENV==='test') {
          console.log('Running Tests...');
          setTimeout(function () {
            try {
              runner.run();
            } catch(e) {
              var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
          }, 1500);
        }
      });
    }
});  

module.exports = app; //for unit/functional testing