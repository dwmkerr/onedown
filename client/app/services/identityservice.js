angular.module('app').factory('IdentityService', function($q, auth, store) {

  function IdentityService() {

  }

  //  Returns a promise resolved immediately with the profile if logged in,
  //  or after login otherwise. Rejected for login failure.
  IdentityService.prototype.ensureLoggedIn = function ensureLoggedIn() {
    
    var deferred = $q.defer();
    if(auth.isAuthenticated) {
      deferred.resolve(auth.profile);
    } else {
      auth.signin({}, function(profile, token) {
        store.set('profile', profile);
        store.set('token', token);
        deferred.resolve(profile);
      });
    }
    return deferred.promise;

  };

  return new IdentityService();
});