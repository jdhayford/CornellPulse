// rest.js

// BASE SETUP
// =============================================================================
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var mysql = require('mysql');
var times = require('./gymHours.json');


// var port = process.env.PORT || 8080;        // set our port

// get our custom functions
var api = require('./api.js');
var tools = require('./tools.js');
var calc = require('./calc.js');

// First  create a connection to the db
var connection = mysql.createConnection({
  host: "pulsardb.cdfrfpjssrqw.us-west-2.rds.amazonaws.com",
  user: "awsuser",
  password: "cornellpulse",
  database: "cornellpulsedb"
});


api.getToken(null,function(val) {
	token = val;
	console.log("Token has been updated!");
})



// Run query and store the response in a json
connection.query( "SELECT centerName, MAX(count) AS 'weekMax'" +
	"FROM `Diners` WHERE datetime BETWEEN SYSDATE() - INTERVAL 7 DAY AND SYSDATE() GROUP BY centerName", function(err, rows){
	if(err)	{
		throw err;
	}else{
		// Query the surge information
		connection.query( "SELECT centerName, MAX(count) AS 'weekMax'" +
		"FROM `surgeDiners` WHERE datetime BETWEEN SYSDATE() - INTERVAL 7 DAY AND SYSDATE() GROUP BY centerName", function(err, surgeRows){
		if(err)	{
			throw err;
		}else{
			// Pull in array from rest call
			api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/1',token, function(count1) {	
				// Pull in array from rest call
				api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/2',token, function(count2) {
					api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/3',token, function(count3) {
						api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/4',token, function(count4) {
							api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/5',token, function(count5) {
								var data = {data:[]};
								
								count1.forEach(function (diner) {
									var one, two, three, four,five = 0;
									one = diner.CustomerCount;
									count2.forEach(function(din) {
										if (din.DiningUnit == diner.DiningUnit) {two = din.CustomerCount - one};
									})
									count3.forEach(function(din) {
										if (din.DiningUnit == diner.DiningUnit) {three = din.CustomerCount - one - two};
									})
									count4.forEach(function(din) {
										if (din.DiningUnit == diner.DiningUnit) {four = din.CustomerCount - one - two - three};
									})
									count5.forEach(function(din) {
										if (din.DiningUnit == diner.DiningUnit) {five = din.CustomerCount - one - two - three - four};
									})

									// Pull the service rate for the current location from the rates.json
									console.log(diner.DiningUnit,calc.weightedActivity(diner,[one,two,three]));
								})
								})	
						});
					});
				});
			});
		}})
	}
})
