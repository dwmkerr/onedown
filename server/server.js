var path = require('path');
var express = require('express');
var connectLivereload = require('connect-livereload');

module.exports.start = function() {

  //  Load the config.
  var config = require('./config/config.js');
  console.log("Loaded config: " + config.name);

  //  Connect to the DB.
  var mongoose = require('mongoose');
  console.log("Connecting to: " + config.db.connectionString  + "...");
  mongoose.connect(config.db.connectionString);
  console.log("Connected.");

  //  Start the web server
  var app = express();

  //  TODO: connect only in dev mode.
  app.use(connectLivereload());
  app.use(express.static(path.join(__dirname, '../client')));

  //  Setup all API routes.
  require('./routes/routes.js')(app);

  app.listen(config.port);

  console.log('One Down server running on port ' + config.port);

};