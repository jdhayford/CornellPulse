// This javascript file contains the functions for API and DB calls

var oust = require('oust');
var unirest = require('unirest');
// var datetime = require('node-datetime');
var fs = require('fs');

refreshToken();

// This script makes HTTP POST to acquire new token
// Input: url of rest API
// Returns: full api Response Body
function refreshToken() {
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
      console.log(res.body.access_token);
      fs.writeFile("token.txt", res.body.access_token, function(err) {
          if(err) {
              return console.log(err);
          }

          console.log("Token Updated!");
      }); 
    }); 
}

