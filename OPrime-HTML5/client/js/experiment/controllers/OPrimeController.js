console.log("Loading the OPrimeController.");

'use strict';
define([ "angular" ], function(angular) {
  var OPrimeController = function($scope, $rootScope) {
    console.log("In the OPrimeController.");
  };
  window.OPrimeController = OPrimeController;
  console.log("Declaring the OPrimeController");

  return OPrimeController;
});
