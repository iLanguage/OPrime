console.log("Loading the OPrimeApp module.");

'use strict';
define([ "angular-resource", "experiment/controllers/OPrimeController",
    "experiment/controllers/OPrimeExperimentController",
    "experiment/controllers/OPrimeExperimentCompletedController",
    "experiment/controllers/OPrimeMenuController",
    "experiment/controllers/OPrimeTutorialController", 
    "experiment/directives/ExperimentDirectives",
    "stimulus/StimulusDirectives",
    "oprime" ], function(
    nonameshere) {

  /**
   * The main OPrime module.
   * 
   * @type {angular.Module}
   */
  var OPrimeApp = angular.module('OPrimeApp',
      [/* dependancy injection */'Experiment.directives', 'Stimulus.directives', 'ui.bootstrap' ]).config(
      [ '$routeProvider', function($routeProvider) {
        console.log("Initializing the OPrimeApp module routes.");
        $routeProvider.when('/prepare', {
          templateUrl : 'partials/menu.html',
          controller : OPrimeMenuController
        }).when('/tutorial', {
          templateUrl : 'partials/tutorial.html',
          controller : OPrimeTutorialController
        }).when('/play', {
          templateUrl : 'partials/play.html',
          controller : OPrimeExperimentController
        }).when('/end', {
          templateUrl : 'partials/save_score.html',
          controller : OPrimeExperimentCompletedController
        }).otherwise({
          redirectTo : '/prepare'
        });
      } ]);
  console.log("Declaring the OPrimeAppModule");

  return OPrimeApp;
});
