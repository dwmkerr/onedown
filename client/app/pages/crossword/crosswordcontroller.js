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