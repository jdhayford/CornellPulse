// Dependencies
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var moment = require('moment');
moment().format();

// First  create a connection to the db
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'pulsardb.cdfrfpjssrqw.us-west-2.rds.amazonaws.com',
        user     : 'awsuser',
        password : 'cornellpulse',
        database : 'cornellpulsedb',
        charset  : 'utf8'
  }
});

//  Express and middleware for handling request variables
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Routing
var router = express.Router();

//  Functions
// This script can make a HTTP request to the rest API
function restCall(url,cb) {
    var unirest = require('unirest');
    var rest; // will hold data response body
    // Set host name for RESR Api and authentication
    var Request = unirest.get(url);
    Request.auth({
      user: 'ssit',
      pass: "w!<AW!w_5[u'~D*4",
      sendImmediately: true
    });
    Request.header('Accept', 'application/json').end(function (data) {
        cb(JSON.parse(data.body));
    });
}

// Specialized function for looping through raw
// rest API response and combining the count with out
// existing json, where target is the string for the 
// corresponding unit location.
function parseCount(target,array,type){
	for (var i=0 ; i < array.length ; i++)
	{
	    // Look for corresponding location name, but
	    // avoid '*** Issue' locations
	    if (array[i][type].indexOf(target) > -1 &
	    		array[i][type].indexOf('Issue') == -1) {
	        return array[i].CustomerCount;
	    }
	}
}


// '/gyms' returns peaks for all gyms
router.route('/gyms')
  .get(function (req, res) {
  	// Create query
    knex.select('datetime','centerName').max('count as peak').from(function () {
    	this.select('datetime','centerName','count').from('Gyms')
    	.orderBy('datetime','desc').limit(50400).as('Gyms');
	}).as('ignored_alias').groupBy('centerName')

    // Combine query response with Cornell Rest Api
    .then(function (rows) {
    	var response = [];
    	// Pull in array from rest call
		restCall('https://api.ssit.scl.cornell.edu/activity/fitness/50', function(results) {		
			// Push json object for each gym
			rows.forEach(function(gym,index){
				response.push({
						location:gym.centerName,
						// For count, find matching rest call data
						count: parseCount(gym.centerName,results,'FacilityName'),
						peak: gym.peak});
			});
			res.json({error: false, data: response});
		});
    })

    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });






// '/diners' returns peaks for all gyms
router.route('/diners')
  .get(function (req, res) {
  	// Create query
    knex.select('datetime','centerName').max('count as peak').from(function () {
    	this.select('datetime','centerName','count').from('Diners')
    	.orderBy('datetime','desc').limit(252000).as('Diners');
	}).as('ignored_alias').groupBy('centerName')

    // Combine query response with Cornell Rest Api
    .then(function (rows) {
    	var response = [];
    	// Pull in array from rest call
		  restCall('https://api.ssit.scl.cornell.edu/activity/dining/25', function(results) {		
			// Push json object for each gym
			rows.forEach(function(diner,index){
				response.push({
						location:diner.centerName,
						// For count, find matching rest call data
						count: parseCount(gym.centerName,results,'DiningUnit'),
						peak: diner.peak});
			});
			res.json({error: false, data: response});
		});
    })

    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

// Routes
app.use('/api', router);


// Start server
app.listen(3000, function() {
  console.log("Express server listening on port %d in %s mode", 3000, app.get('env'));
});
