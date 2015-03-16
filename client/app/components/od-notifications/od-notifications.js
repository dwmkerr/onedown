angular.module('app').directive('odNotifications', function(ErrorService) {

  return {
    restrict: "E",
    templateUrl: "app/components/od-notifications/od-notifications.html",
    scope: {
    },
    link: function(scope, element, attributes) {

      scope.errors = ErrorService.errors;    

    }
  };

});