var winston = require('winston');
var config = require('config');
var logentries = require('node-logentries');

var levels = {
  'detail': 0,
  'trace': 1,
  'debug': 2,
  'enter': 3,
  'info': 4,
  'warn': 5,
  'error': 6
};
var colours = {
  'detail': 'grey',
  'trace': 'white',
  'debug': 'blue',
  'enter': 'inverse',
  'info': 'green',
  'warn': 'yellow',
  'error': 'red'
};

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)( {
      level: 'detail',
      colorize: true,
      timestamp: true
    })],
  levels: levels
});
winston.addColors(colours);

//  If config has a logentries token, use it.
if(config.has('logging.logentries.token')) {
  
  //  Use logentries.
  var log = logentries.logger({
    token: config.get('logging.logentries.token')
  }).winston(winston);

  log.info('Logentries logging configured...');
}

//  Log unhandled exceptions.
process.on('uncaughtException', function (err) {
  log.error(err.stack, err);
  process.exit(1);
});

//  Configure the logger stream to support other mechanisms writing to our log.
logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

module.exports = logger;