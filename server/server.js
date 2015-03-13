var path = require('path');
var express = require('express');
var connectLivereload = require('connect-livereload');
var bodyParser = require('body-parser');

//  Load the config.
var config = require('./config/config.js');
console.log("Loaded config: " + config.name);

//  Connect to the DB.
var mongoose = require('mongoose');
console.log("Connecting to: " + config.db.connectionString  + "...");
mongoose.connect(config.db.connectionString);
console.log("Done.");

//  Start the web server
var app = express();
app.useDebug = function(middleware) {
  if(app.get('env') === 'development') {
    app.use(middleware);
  }
};

// We are going to protect /api routes with JWT

//  TODO: connect only in dev mode.
app.useDebug(connectLivereload());
app.use(express.static(path.join(__dirname, '../client')));



//  API routes use the body parser.
app.use(bodyParser.json());
require('./routes/routes.js')(app);

app.listen(config.port);

console.log('One Down server running on port ' + config.port);