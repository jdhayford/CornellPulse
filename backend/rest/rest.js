// rest.js
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
    Request.header('Accept', 'application/json').end(function (response) {
        cb(JSON.parse(response.body));
    });
}

// Specialized function for looping through raw
// rest API response, array, and combining the count with out
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

/*NAMES_MAP is a one-to-one mapping between Dining Hall names from now.dining.cornell api 
(https://now.dining.cornell.edu/api/1.0/dining/eateries.json) and from CornellPulse's own API

NOTE: 
	We are missing Bear's Den, Stocking Hall Dairy Bar, Mattins
 */
var NAMES_MAP = {
	"Kosher": "104West!",
	"Olin Libe Cafe": "Amit Bhatia Libe Café",
	"Sage" : "Atrium Café",
	"Bear Necessities" :"Bear Necessities Grill & C-Store",
	"Carl Becker House" : "Becker House Dining Room",
	"Big Red Barn" : "Big Red Barn",
	"Bus Stop Bagels" : "Bus Stop Bagels",
	"Cafe Jennie" : "Café Jennie",
	"Carols Cafe" : "Carol's Café",
	"Alice Cook House" : "Cook House Dining Room",
	"Goldie's" : "Goldie's Café",
	"Green Dragon" : "Green Dragon",
	"Ivy Room" : "Ivy Room",
	"Jansens at Bethe House" : "Jansen's Dining Room at Bethe House",
	"Jansen's Market" : "Jansen's Market",
	"Keeton House" : "Keeton House Dining Room",
	"Marthas" : "Martha's Café",
	"Duffield": "Mattin's Café",
	"North Star Marketplace" : "North Star Dining Room",
	"Okenshields" : "Okenshields",
	"Risley" : "Risley Dining Room",
	"RPME" : "Robert Purcell Marketplace Eatery", 
	"Rose House" : "Rose House Dining Room",
	"Rustys" : "Rusty's",
	"Sweet Sensation" : "Sweet Sensations",
	"Synapsis Cafe" : "Synapsis Café", 
	"Trillium" : "Trillium",
	"Statler Terrace":"Terrace",
	"Statler Macs" : "Mac's Café"
}

/* Given a name (from either our API or from now.dining.cornell), returns opposite name*/

function getOppositeName(name) {
	if (! NAMES_MAP[name]) {

		for(var key in NAMES_MAP) {
			var value = NAMES_MAP[key];
			if (name === value) {
				return key;
			}
		}
	} else {
		return NAMES_MAP[name];
}}

// BASE SETUP
// =============================================================================
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var mysql = require('mysql');
var oust = require('oust');
var times = require('./gymHours.json');

var port = process.env.PORT || 8080;        // set our port

// First  create a connection to the db
var connection = mysql.createConnection({
  host: "pulsardb.cdfrfpjssrqw.us-west-2.rds.amazonaws.com",
  user: "awsuser",
  password: "cornellpulse",
  database: "cornellpulsedb"
});


// This script can make a HTTP request to the dining rest API
function statusCall(url,cb) {
    var unirest = require('unirest');
    var rest; // will hold data response body
    // Set host name for RESR Api and authentication
    var Request = unirest.get(url);
    Request.header('Accept', 'application/json').end(function (response) {
        // Take down current timestamp in seconds
        var now = Math.floor(Date.now()/1000);
        var eateries = {};
        // Iterate through each eatery in the API response
        response.body.data.eateries.forEach(function (eatery){
            var status = "Closed";
            var nextTime = "";
            // Iterate through each meal time for the eatery
            if (eatery.operatingHours[1].events) {
                eatery.operatingHours[1].events.forEach(function(meal, index, array) {
                    // If 
                    if (now >= meal.startTimestamp &
                        now <= meal.endTimestamp) {
                        status = "Open";
                    	if (index + 1 < array.length) {
                    		nextTime = array[index+1].startTimestamp;
                    	}
                    } 
                })
            }
			eateries[eatery.name] = {status:status,src:oust(eatery.about,'images')[0]};
        })
        cb(eateries);
    });
}

// This function simply returns the reverse of string s
function reverse(s) {
  var o = '';
  for (var i = s.length - 1; i >= 0; i--)
    o += s[i];
  return o;
}

// This mess of a function takes the current time in hours and minutes,
// then pulls the opening and closing times from gym out of the gymHours.json
// and returns whether "gym" is open or closed
// TODO: Find a way to do this without so many damn variables
function gymTime(gym,times) {
	var status = "Closed";
	var currentDate = new Date( new Date().getTime() + -4 * 3600 * 1000);	
	var rev = reverse(gym);
	var day = currentDate.getDay();
	var hour = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var after = hour > times[day][gym].split(':')[0] |
    			(hour == times[day][gym].split(':')[0] & minutes > times[day][gym].split(':')[1]);
    var before = hour < times[day][rev].split(':')[0] |
    			(hour == times[day][rev].split(':')[0] & minutes < times[day][rev].split(':')[1]);
	if(after & before) {
		return "Open";
	}	else { return "Closed";}

}



app.get('/api', function (req, res) {
	// Set up json objects that we will populate and respond 
	var data = {
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
			restCall('https://api.ssit.scl.cornell.edu/activity/fitness/50', function(counts) {		
				// Push json object for each gym
				rows.forEach(function(gym,index){
					data.gyms.push({
							location:gym.centerName,
							// For count, find matching rest call data
							count: parseCount(gym.centerName,counts,'FacilityName'),
							peak: gym.weekMax,
							status:gymTime(gym.centerName,times)});
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
				restCall('https://api.ssit.scl.cornell.edu/activity/dining/25', function(counts) {	
					// Pull in array from rest call
					restCall('https://api.ssit.scl.cornell.edu/activity/dining/5', function(surges) {
						// Pull in diner information from the eateries API
						statusCall("https://now.dining.cornell.edu/api/1.0/dining/eateries.json",function (status) {
							// Push json object for each gym
							rows.forEach(function(diner,index){
								// Convert name to the one used by eateries API
								var newName = getOppositeName(diner.centerName);
								if (newName == '') { console.log(diner.centerName);}
								data.diners.push({
										location: newName,
										// For count, find matching rest call data
										count: parseCount(diner.centerName,counts,'DiningUnit'),
										peak: diner.weekMax,
										surgeCount:parseCount(diner.centerName,surges,'DiningUnit'),
										// Take from surge query
										surgePeak:surgeRows[index].weekMax,
										// Take status from eatery API response
										status: (status[newName] ? status[newName].status:null),
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
							res.set('Content-Type', 'application/json; charset=utf-8');
							res.header("Access-Control-Allow-Origin", "*");
							res.send(data);
						})	
					
					});
				});
			}})
		}
	})

})




app.listen(3000, function() {
	console.log("App listening on port 3000!");
})
//END OF NEW CODE