var app = angular.module('app', ['ngRoute', 'auth0', 'angular-storage', 'angular-jwt'])
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/create', {
        templateUrl: 'app/pages/create/create.html',
        controller: 'CreateController',
        requiresLogin: true
      })
      .when('/crosswords', {
        templateUrl: 'app/pages/crosswords/crosswords.html',
        controller: 'CrosswordsController',
        resolve: {
          crosswords: function($http, ErrorService) {
            return $http.get('api/crosswords').then(function(response) { 
              return response.data; 
            }, function(err) {
              ErrorService.error('Sorry', 'There was a problem loading the crosswords.');
            });
          }
        }
      })
      .when('/crosswords/:crosswordId', {
        templateUrl: 'app/pages/crossword/crossword.html',
        controller: 'CrosswordController',
        resolve: {
          crossword: function($route, $http) {
            return $http.get('api/crosswords/' + $route.current.params.crosswordId).then(function(response) { 
              return response.data; 
            }, function(err) {
              ErrorService.error('Sorry', 'There was a problem loading the crossword.');
            });
          }
        }
      })
      .otherwise({
        templateUrl: 'app/pages/home/home.html',
        controller: 'HomeController'
      });

  })
  .config(function (authProvider) {
    authProvider.init({
      domain: 'dwmkerr.auth0.com',
      clientID: 'oWeXhqDS5VLh8asTvNUEqKFA6wIbGIsJ',
      callbackURL: location.href,
      // Here we add the URL to go if the user tries to access a resource he can't because he's not authenticated
      loginUrl: '/login'
    });
  })
  .config(function (authProvider, $httpProvider, jwtInterceptorProvider) {

    // We're annotating this function so that the `store` is injected correctly when this file is minified
    jwtInterceptorProvider.tokenGetter = ['store', function(store) {
      // Return the saved token
      return store.get('token');
    }];

    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .run(function(auth) {
    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();
  })
  .run(function($rootScope, auth, store, jwtHelper, $location) {
    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
      if (!auth.isAuthenticated) {
        var token = store.get('token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            auth.authenticate(store.get('profile'), token);
          } else {
            // Either show Login page or use the refresh token to get a new idToken
            $location.path('/');
          }
        }
      }
    });
  });
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
angular.module('app').directive('odCrossword', function() {

  return {
    restrict: "E",
    templateUrl: "app/components/od-crossword/od-crossword.html",
    scope: {
      crossword: "=",
      selectedClue: "=",
      crosswordHeight: "="
    },
    link: function(scope, element, attributes) {

      //  Create the crossword DOM.
      var crosswordDom = new CrosswordsJS.CrosswordDOM(scope.crossword, element[0]);

      //  Set the selection if we have one.
      if(scope.selectedClue) {
        crosswordDom.selectClue(scope.selectedClue);
      }
      
      //  Update the selected clue when needed.
      var cleanupSelectedClueWatch = scope.$watch('selectedClue', function(newValue, oldValue) {
        if(newValue !== oldValue && newValue !== undefined) {
          crosswordDom.selectClue(scope.selectedClue);
        }
      });

      //  Watch for notifications.
      crosswordDom.onStateChanged = function(change) {
        //  TODO: selecting a clue fires a state change message.
        if(change.message === "clueSelected") {
          if(scope.selectedClue !== crosswordDom.currentClue) {
            scope.selectedClue = crosswordDom.currentClue;
            scope.$apply();
          }
        }
      };

      //  Cleanup on scope destroy.
      scope.$on('$destroy', function() {
        cleanupSelectedClueWatch();
        crosswordDom.destroy();
      });

      scope.crosswordHeight = $(crosswordDom.crosswordElement).height();

    }
  };

});
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
angular.module('app').controller('CreateController', function($scope) {

});
angular.module('app').controller('CrosswordController', function($scope, $q, $http, auth, IdentityService, ErrorService, crossword) {


  $scope.title = crossword.title;
  $scope.setter = crossword.setter;

  //  Our crossword might contain a solution. If it does, but each answer in the clue
  //  (which is the shape required by the CrosswordsJS class).
  if(crossword.solution) {

    var allClues = crossword.acrossClues.concat(crossword.downClues);
    var clueMap = {};
    for(var i=0; i<allClues.length; i++) {
      clueMap[allClues[i].number + (i < crossword.acrossClues.length ? 'a' : 'd')] = allClues[i];
    }

    for(i=0; i<crossword.solution.answers.length; i++) {
      clueMap[crossword.solution.answers[i].clueCode].answer = crossword.solution.answers[i].answer;
    }
  }

  //  Create the crossword model from the crossword definition. (TODO in router?)
  var crosswordModel = new CrosswordsJS.Crossword(crossword);
  $scope.crossword = crosswordModel;  
  $scope.acrossClues = crosswordModel.acrossClues;
  $scope.downClues = crosswordModel.downClues;

  $scope.isSelected = function isSelected(clue) {
    return clue === $scope.selectedClue;
  };

  $scope.selectClue = function selectClue(clue) {
    $scope.selectedClue = clue;
  };

  $scope.save = function save() {
    //  If we are going to save we'd better be logged in.
    IdentityService.ensureLoggedIn().then(function() {
      
      //  Build a solution to send.
      var solution = {
        answers: []
      };

      //  Go though the model and pull out all clues.
      var clues = crosswordModel.acrossClues.concat(crosswordModel.downClues);
      for(var i=0; i<clues.length; i++) {
        if(clues[i].answer) {
          solution.answers.push({
            clueCode: clues[i].code,
            answer: clues[i].answer
          });
        }
      }
      $http.post('api/crosswords/' + crossword._id + '/solution', solution).then(function() {

      }, function(err) {
        ErrorService('Sorry', 'There was a problem saving your answers.');
      });

    });
  };



});
angular.module('app').controller('CrosswordsController', function($scope, crosswords) {

  $scope.crosswords = crosswords;

});
angular.module('app').controller('HomeController', function() {

});