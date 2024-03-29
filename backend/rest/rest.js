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

function createResponse(token) {
	// Set up json objects that we will populate and respond 
	var data = {
		gyms : [],
		diners : []
	};
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
				api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/25', token, function(counts) {	
					// Pull in array from rest call
					api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/5', token, function(surges) {
						// Pull in diner information from the eateries API
						api.statusCall("https://now.dining.cornell.edu/api/1.0/dining/eateries.json",function (status) {
							// Pull in array from rest call
							api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/1',token, function(count1) {	
								// Pull in array from rest call
								api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/2',token, function(count2) {
									api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/3',token, function(count3) {
										api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/4',token, function(count4) {
											api.restCall('https://api.ssit.scl.cornell.edu/activity/dining/5',token, function(count5) {
												
												// Push json object for each gym
												rows.forEach(function(diner,index){
													// Convert name to the one used by eateries API
													var newName = tools.getOppositeName(diner.centerName);

													if (newName == '') { console.log(diner.centerName);}
													var one, two, three, four,five = 0;
													count1.forEach(function (din) {
														if (din.DiningUnit == diner.centerName) {one = din.CustomerCount;}
													})
													count2.forEach(function(din) {
														if (din.DiningUnit == diner.centerName) {two = din.CustomerCount - one};
													})
													count3.forEach(function(din) {
														if (din.DiningUnit == diner.centerName) {three = din.CustomerCount - one - two};
													})
													count4.forEach(function(din) {
														if (din.DiningUnit == diner.centerName) {four = din.CustomerCount - one - two - three};
													})
													count5.forEach(function(din) {
														if (din.DiningUnit == diner.centerName) {five = din.CustomerCount - one - two - three - four};
													})
													// Pull the service rate for the current location from the rates.json
													var surge = calc.weightedActivity(diner,[one,two,three]);

													
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
															// Get information for the current meal
															currentEvent: (status[newName] ? status[newName].currentEvent:null),
															// Get next time
															nextEvent: (status[newName] ? status[newName].nextEvent:null),
															// Pull image src for diner thumbnail
															about: (status[newName] ? status[newName].src:null),
															// Get campus building location of the eatery
															building: (status[newName] ? status[newName].eatery.location:null),
															// Get short eatery description
															eateryType: (status[newName] ? status[newName].eatery.eateryTypes[0]:null),
															// Get list of dining items for the eatery
															diningItems: (status[newName] ? status[newName].eatery.diningItems:null),
															experimentalSurge: surge
															});
												});
												// Sort the diner objects alphabetically based on the new names
												data.diners.sort(function(a, b){
												    if(a.location < b.location) return -1;
												    if(a.location > b.location) return 1;
												    return 0;
												})
												return data;
											})	
										});
									});
								});
							});
							
							
						})	
					
					});
				});
			}})
		}
	})
}


module.exports = {
	createResponse : createResponse
};