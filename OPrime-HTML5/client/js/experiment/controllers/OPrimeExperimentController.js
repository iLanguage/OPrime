console.log("Loading the OPrimeExperimentController.");

'use strict';
define([ "angular" ], function(angular) {
  var OPrimeExperimentController = function($scope, $rootScope) {
    console.log("In the OPrimeExperimentController.");
//    console.log("experimentalDesign", $scope.experimentalDesign);
  };
  window.OPrimeExperimentController = OPrimeExperimentController;
  console.log("Declaring the OPrimeExperimentController");

  return OPrimeExperimentController;
});
