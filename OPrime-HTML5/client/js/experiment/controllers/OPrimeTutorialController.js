console.log("Loading the OPrimeTutorialController.");

'use strict';
define([ "angular" ], function(angular) {
  var OPrimeTutorialController = function($scope, $rootScope) {
    $scope.title = $rootScope.title;
    $scope.openTutorial = function() {
      $scope.shouldBeOpen = true;
    };

    $scope.closeTutorial = function() {
      $scope.closeMsg = 'I was closed at: ' + new Date();
      $scope.shouldBeOpen = false;
    };
  };
  window.OPrimeTutorialController = OPrimeTutorialController;
  console.log("Declaring the OPrimeTutorialController");

  return OPrimeTutorialController;
});
