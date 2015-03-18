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
          crosswords: function($http, AlertsService) {
            return $http.get('api/crosswords').then(function(response) { 
              return response.data; 
            }, function(err) {
              AlertsService.error('Sorry', 'There was a problem loading the crosswords.');
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
              AlertsService.error('Sorry', 'There was a problem loading the crossword.');
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