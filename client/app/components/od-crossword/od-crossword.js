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