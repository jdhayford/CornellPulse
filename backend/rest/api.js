// This javascript file contains the functions for API and DB calls

var oust = require('oust');

// This script can make a HTTP request to the rest API
// Input: url of rest API
// Returns: full api Response Body
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

// This script can make a HTTP request to the dining rest API
// Supplies the Dining locations STATUS and IMG URL
// Input: url of dining rest
// Output: Dining objects with Status and Thumbnail
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
      // Format dining object fragments, fragments because they only contain a fraction of final information
      eateries[eatery.name] = {status:status,src:oust(eatery.about,'images')[0]};
        })
        cb(eateries);
    });
}

module.exports = {
  restCall: restCall,

  statusCall: statusCall
}