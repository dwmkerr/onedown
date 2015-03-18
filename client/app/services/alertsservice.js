angular.module('app').factory('AlertsService', function() {

  function AlertsService() {

    this.alerts = [];

  }

  //  Logs an error.
  AlertsService.prototype.error = function error(title, message) {
    
    this.alerts.push({
      type: 'error',
      title: title,
      message: message
    });

  };

  AlertsService.prototype.info = function info(title, message) {
    
    this.alerts.push({
      type: 'info',
      title: title,
      message: message
    });

  };

  return new AlertsService();
});