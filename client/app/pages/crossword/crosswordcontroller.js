angular.module('app').controller('CrosswordController', function($scope, crossword) {


  $scope.title = crossword.title;
  $scope.setter = crossword.setter;

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

});