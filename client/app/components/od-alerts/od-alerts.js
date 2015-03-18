angular.module('app').directive('odAlerts', function(AlertsService) {

  return {
    restrict: "E",
    templateUrl: "app/components/od-alerts/od-alerts.html",
    scope: {
    },
    link: function(scope, element, attributes) {

      scope.alerts = AlertsService.alerts;

    }
  };

});