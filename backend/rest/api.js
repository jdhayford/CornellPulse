// This javascript file contains the functions for API and DB calls

var oust = require('oust');
var unirest = require('unirest');
// var datetime = require('node-datetime');

// This script makes HTTP POST to acquire new token
// Input: url of rest API
// Returns: full api Response Body
function getToken(token,cb) {
    var req = unirest("POST", "https://api.ssit.scl.cornell.edu/token");
    req.headers({
      "content-type": "application/x-www-form-urlencoded",
      "postman-token": "a2d2eeae-2b9c-b0f4-cc29-e91a30fdf91a",
      "cache-control": "no-cache"
    });

    req.form({
      "grant_type": "password",
      "username": "activity",
      "password": "NawWDeYhLhs4W*#T"
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);

      cb(res.body);
    }); 
}



// This script can make a HTTP request to the rest API
// Input: url of rest API
// Returns: full api Response Body
function restCall(url,token,cb) {
    // var unirest = require('unirest');
    var rest; // will hold data response body
    // Set host name for RESR Api and authentication
    var req = unirest.get(url);
    req.headers({
      "authorization": "Bearer "+token.access_token,
      "content-type": "application/json"
    });
    req.header('Accept', 'application/json').end(function (response) {
        cb(JSON.parse(response.body));
    });
}

// This script can make a HTTP request to the dining rest API
// Supplies the Dining locations STATUS and IMG URL
// Input: url of dining rest
// Output: Dining objects with Status and Thumbnail
function statusCall(url,cb) {
    // var unirest = require('unirest');
    var rest; // will hold data response body
    // Set host name for RESR Api and authentication
    var Request = unirest.get(url);
    Request.header('Accept', 'application/json').end(function (response) {
        // Take down current timestamp in seconds
        var now = Math.floor(Date.now()/1000);
        var eateries = {};
        // Iterate through each eatery in the API response
        if (response.body) {
          response.body.data.eateries.forEach(function (eatery){
            var status = "Closed";
            var currentEvent;
            var nextEvent;
            
            // Iterate through each meal time for the eatery
            if (eatery.operatingHours[1].events) {
                eatery.operatingHours[1].events.forEach(function(meal, index, array) {
                    // If 
                    if (now >= meal.startTimestamp &
                        now <= meal.endTimestamp) {
                        status = "Open";  
                        currentEvent = meal;
                         // If location closes within 1:30 from now 
                        currentEvent.closingSoon = (meal.endTimestamp - now < 3600);
                        }

                      if (index + 1 < array.length) {
                        nextEvent = array[index+1];
                      }
                })
            }
      // Format dining object fragments, fragments because they only contain a fraction of final information
      eateries[eatery.name] = {status:status,src:oust(eatery.about,'images')[0],currentEvent:currentEvent,nextEvent:nextEvent,eatery:eatery};
        })
      }
        cb(eateries);
    });
}

module.exports = {
  getToken: getToken,

  restCall: restCall,

  statusCall: statusCall
}