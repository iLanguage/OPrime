console.log("Loading the ExperimentDirectives.");

'use strict';
define(
    [ "angular" ],
    function() {

      var ExperimentDirectives = angular
          .module('Experiment.directives', [])
          /*
           * Show the user a tutorial
           */
          .directive('oprimeTutorial', function($rootScope) {
            return {
              restrict : 'E',
              scope : {
                logo : '@logo',
                instructionsAudio : '@instructionsAudio'
              },
              templateUrl : 'partials/tutorial.html',
              link : function(scope, element, attrs){
                scope.logo = window.experiment.logo;
                scope.title = window.experiment.title;
                scope.startInstructionsAudio = window.experiment.startInstructionsAudio;
                scope.startInstructions = window.experiment.startInstructions;
                scope.endInstructions = window.experiment.endInstructions;
              }
            };
          })
          /*
           * Allow the users to go forward and backward
           */
          .directive(
              'oprimeStimuliControlButtons',
              function() {
                return {
                  restrict : 'E',
                  scope : {},
                  template : '<div class="row-fluid pagination-centered">                '
                      + '<h1>              '
                      + '<i class="icon-forward pull-right" ng-click="nextStimuli()"></i> <i              '
                      + '  class="icon-backward pull-left" ng-click="previousStimuli()"></i>              '
                      + '</h1>             '
                      + '<img id="image_prime" width="100" />' + ' </div>',
                  link : function(scope, element, attrs) {
                    console.log("Linking an experiment button panel");
                    scope.previousStimuli = function() {
                      alert("Going to previous stimuli");
                    };
                    scope.nextStimuli = function() {
                      alert("Going to next stimuli");
                    };
                  }
                };
              })
          /*
           * Show the user the menu
           */
          .directive(
              'oprimeMenu',
              function($compile, $location) {
                var menuAngularConfig = {
                  restrict : 'E',
                  scope : {
                    logo : '@logo',
                    instructionsAudio : '@instructionsAudio'
                  },
                  template : '<div class="inner-container">'
                      + ' <img ng-src="{{logo}}" /> <br />'
                      + ' <button class="btn btn-success " ng-click="startExperiment()">Start!</button>'
                      + '</div>'
                      + '<audio id="tutorial_instructions_audio" ng-src="{{instructionsAudio}}" autoplay>'
                      + '</audio>',
                  link : function(scope, element, attrs) {
                    scope.startExperiment = function() {
                      alert("Ready to start?");
                      document.getElementById("tutorial_instructions_audio")
                          .pause();
                      $location.path("/play");
                    };
                    console.log("in the oprimeMenu link fuction");
                  }
                };

                return menuAngularConfig;
              })
          /*
           * Show the user the experiment
           */
          .directive('oprimeExperiment', function($http, $rootScope) {
            console.log("Declaring oprimeExperiment");
            return {
              restrict : 'E',
//              scope : {
//                experimentalDesign : window.experiment,
//              },
              template : "",
              link : function(scope, element, attrs) {
                console.log("Linking oprimeExperiment");

                // $http.get('data/tcpp_design.js').success(function(data) {
                // scope.experimentalDesign = data;
                // window.experimentalDesign = data;
                // });
                scope.experimentalDesign = window.experiment;
               
                scope.testOrPractice = "test";
                scope.currentExperiment = 0;
                scope.currentTrial = 0;
                scope.nextStimuli = function() {
                  alert("Next");
                };
              }
            };
          });

      return ExperimentDirectives;
    });
