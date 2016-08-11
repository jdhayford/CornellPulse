// Dependancies
var unirest = require('unirest');

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

// Functions for handling Cornell Rest API
// This script makes HTTP request to Cornell Rest Api
// where url is the api endpoint, and cb is the callback
function restCall(url,cb) {
    // Set host name for RESR Api and authentication
    var Request = unirest.get(url);
    Request.auth({
      user: 'ssit',
      pass: "w!<AW!w_5[u'~D*4",
      sendImmediately: true
    });
    // On request, return the body of the response as a json
    Request.header('Accept', 'application/json').end(function (data) {
        cb(JSON.parse(data.body));
    });
}

// Given a target of a database row's location name, target,
// the array of the Cornell Rest Api response, array,
// and the name reference that the api uses (changes for fitness or diner)
// Return the corresponding specific location count 
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

var collection = Array();
knex.select('datetime','centerName').max('count as peak').from(function () {
	this.select('datetime','centerName','count').from('Gyms')
	.orderBy('datetime','desc').limit(50400).as('Gyms');
}).as('ignored_alias').groupBy('centerName')

.then(function (rows) {
	// Pull in array from rest call
	restCall('https://api.ssit.scl.cornell.edu/activity/fitness/50', function(results) {		
		// Push json object for each gym
		rows.forEach(function(gym,index){
			console.log(gym);
			collection.push({
					location:gym.centerName,
					// For count, find matching rest call data
					count: parseCount(gym.centerName,results,'FacilityName'),
					peak: gym.peak});
		});
		module.exports = collection;
	});
});