// timedRest.js

// BASE SETUP
// =============================================================================
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var mysql = require('mysql');
var times = require('./gymHours.json');

var port = process.env.PORT || 8080;        // set our port

// get our custom functions
var api = require('./api.js');
var tools = require('./tools.js');

// First  create a connection to the db
var connection = mysql.createConnection({
  host: "pulsardb.cdfrfpjssrqw.us-west-2.rds.amazonaws.com",
  user: "awsuser",
  password: "cornellpulse",
  database: "cornellpulsedb"
});

// Set timed interval for the API to refresh its data
var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
	// Set up json objects that we will populate and respond 
	data = {
		gyms : [],
		diners : []
	};

	

	// Run query and store the response in a json
	connection.query("SELECT centerName, MAX(count) AS 'weekMax'" +
		"FROM `Gyms` WHERE datetime BETWEEN SYSDATE() - INTERVAL 7 DAY AND SYSDATE() GROUP BY centerName", function(err, rows){
		if(err)	{
			throw err;
		}else{
			// Pull in array from rest call
			api.restCall('https://api.ssit.scl.cornell.edu/activity/fitness/50', function(counts) {		
				// Push json object for each gym
				rows.forEach(function(gym,index){
					data.gyms.push({
							location:gym.centerName,
							count: tools.parseCount(gym.centerName,counts,'FacilityName'),
							peak: gym.weekMax,
							status:tools.gymTime(gym.centerName,times)});
				});
			});	
		}
	});

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
				api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/25', function(counts) {	
					// Pull in array from rest call
					api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/5', function(surges) {
						// Pull in diner information from the eateries API
						api.statusCall("https://now.dining.cornell.edu/api/1.0/dining/eateries.json",function (status) {
							// Push json object for each gym
							rows.forEach(function(diner,index){
								// Convert name to the one used by eateries API
								var newName = tools.getOppositeName(diner.centerName);
								if (newName == '') { console.log(diner.centerName);}
								data.diners.push({
										location: newName,
										// For count, find matching rest call data
										count: tools.parseCount(diner.centerName,counts,'DiningUnit'),
										peak: diner.weekMax,
										surgeCount:tools.parseCount(diner.centerName,surges,'DiningUnit'),
										// Take from surge query
										surgePeak:surgeRows[index].weekMax,
										// Take status from eatery API response
										status: (status[newName] ? status[newName].status: (tools.parseCount(diner.centerName,counts,'DiningUnit') > 0 ?'Open' : 'Closed')),
										// Pull image src for diner thumbnail
										image: (status[newName] ? status[newName].src:null)
										});
							});
							// Sort the diner objects alphabetically based on the new names
							data.diners.sort(function(a, b){
							    if(a.location < b.location) return -1;
							    if(a.location > b.location) return 1;
							    return 0;
							})
							
						})	
					
					});
				});
			}})
		}
	})
	console.log('Data updated!');
	

	}, the_interval);


	app.get('/api', function (req, res) {
		res.set('Content-Type', 'application/json; charset=utf-8');
		res.header("Access-Control-Allow-Origin", "*");
		res.send(data);
	})

	app.listen(3000, function() {
		console.log("App listening on port 3000!");
	})
