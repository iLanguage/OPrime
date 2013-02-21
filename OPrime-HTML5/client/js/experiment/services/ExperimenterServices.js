console.log("Loading ExperimenterServices");
'use strict';
define([ "angular", "underscore" ], function(angular, _) {

  var ExperimenterServices = angular.module('User.services', [ 'ngResource' ])
      .factory('ExperimenterService', function() {

        OPrime.debug("Initializing ExperimenterService");
        var getDefaultUserPreferedSubExperiments = function() {
          return [];
        };
        var getDefaultReportColumns = function() {
          return [ {
            "label" : "id",
            "title" : "locale_view",
            "show" : "true"
          }, {
            "label" : "starred",
            "title" : "locale_starred",
            "show" : "true"
          }, {
            "label" : "status",
            "title" : "locale_status",
            "show" : "true"
          }, {
            "label" : "date_first_retrieved",
            "title" : "locale_date_first_retrieved",
            "show" : "true"
          }, {
            "label" : "date_forecasted_experiment",
            "title" : "locale_date_forecasted_experiment",
            "show" : "true"
          }, {
            "label" : "experiment_location",
            "title" : "locale_experiment_location",
            "show" : "true"
          }, {
            "label" : "conclusion",
            "title" : "locale_conclusion",
            "show" : "false"
          }, {
            "label" : "actionRequired",
            "title" : "locale_action_required",
            "show" : "true"
          } ];
        };
        var newExperimenter = function(attributes) {
          var experimenter = new User();
          experimenter.setUserAttributes({
            userRoles : [ "Experimenter" ],
            preferencesReportView : {
              defaultView : "view_all"
            },
            reportColumnPreferences : getDefaultReportColumns(),
            preferencesReportView : {
              defaultView : "view_all"
            }
          });
          experimenter.setAttributes(attributes);
          return experimenter;
        };

        /*
         * Load experimenter from localstorage or create a new experimenter
         */
        var initialize = function(experimenter) {
          if (!experimenter) {
            experimenter = localStorage.getItem("encryptedExperimenter");
            if (experimenter) {
              OPrime.debug("Setting experimenter from localstorage");
              experimenter = JSON.parse(experimenter);
            }
          }
          if (!experimenter) {
            OPrime.debug("Creating new experimenter.");
            experimenter = newExperimenter();
          }
          /*
           * Leak scope out to the window so that we can debug, if we are in
           * debugMode
           */
          if (OPrime.debugMode) {
            window.experimenter = experimenter;
          }
          return experimenter;
        };
        var experimenter = {};
        experimenter = initialize();

        return {
          'newExperimenter' : newExperimenter,
          'getUserPreferredColumns' : function() {
            return experimenter.reportColumnPreferences;
          },
          'setUserPreferredColumns' : function(reportColumnPreferences) {
            experimenter.reportColumnPreferences = reportColumnPreferences;
          }
        };

      });
  console.log("Declaring ExperimenterServices");
  return ExperimenterServices;
});