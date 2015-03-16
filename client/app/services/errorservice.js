angular.module('app').factory('ErrorService', function() {

  function ErrorService() {

    this.errors = [];

  }

  //  Logs an error.
  ErrorService.prototype.error = function error(title, message) {
    
    this.errors.push({
      title: title,
      message: message
    });

  };

  return new ErrorService();
});