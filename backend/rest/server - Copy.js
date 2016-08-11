// Dependencies
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

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

// Collections
var Gyms = require('./models/gym');
var Diners = require('./models/diner');

// Routing
var router = express.Router();

var oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
oneWeekAgo.setHours(0,0,0);
// '/gyms' returns peaks for all gyms
router.route('/gyms')
  .get(function (req, res) {
    Gyms.forge()
    .fetchAll()
    .then(function (model) {
    	console.log(model);
      // res.json({error: false, data: model.toJSON()});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

// '/diners' returns peaks for all diners
router.route('/diners')
  // fetch all users
  .get(function (req, res) {
    Diners.forge()
    .fetch()
    .then(function (model) {
      res.json({error: false, data: model.toJSON()});
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
