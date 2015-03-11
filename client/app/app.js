var app = angular.module('app', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/crosswords', {
        templateUrl: 'app/pages/crosswords/crosswords.html',
        controller: 'CrosswordsController',
        resolve: {
          crosswords: function($http) {
            return $http.get('api/crosswords').then(function(response) { 
              return response.data; 
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
            });
          }
        }
      })
      .otherwise({
        templateUrl: 'app/pages/home/home.html',
        controller: 'HomeController'
      });

  });    