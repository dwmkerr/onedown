angular.module('app').directive('odMenu', function($location, auth, store, IdentityService) {
  return {
    restrict: 'E',
    templateUrl: 'app/menu/od-menu.html',
    link: function(scope, element, attrs) {

      scope.auth = auth;


      scope.login = function() {
        IdentityService.ensureLoggedIn();
      };

      scope.logout = function() {
        auth.signout();
        store.remove('profile');
        store.remove('token');
      };

      scope.isLoggedIn = function() {
        return auth.isAuthenticated;
      };

    }
  };
});