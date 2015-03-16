var config = require('config');
var express = require('express');
var logger = require('morgan');
var log = require('./log');
var mongoose = require('mongoose');
var path = require('path');
var connectLivereload = require('connect-livereload');
var bodyParser = require('body-parser');

//  Load the config.
log.info("Loaded config: " + config.get('name'));

//  Connect to the DB.
log.info("Connecting to: " + config.get('db.connectionString') + "...");
mongoose.connect(config.get('db.connectionString'));

//  Start the web server
var app = express();
app.useDebug = function(middleware) {
  if(app.get('env') === 'development') {
    app.use(middleware);
  }
};

app.useDebug(connectLivereload());
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());
app.use(logger('dev', {stream: log.stream}));

require('./routes/routes.js')(app);

app.listen(config.get('port'));

log.info('One Down server running on port ' + config.port);