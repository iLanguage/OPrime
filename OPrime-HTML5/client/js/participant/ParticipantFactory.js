console.log("Loading ParticipantFactory");
'use strict';
define([ "angular", "text!modules/pivot88/locale/en/messages.json",
    "text!modules/pivot88/locale/zh-cn/messages.json", "underscore" ],
    function(angular, CouchDBServices, Locale_en, Locale_zh_cn, _) {

      var ParticipantFactory = angular.module('Authentication.services',
          [ 'ngResource' ]).factory('AuthService', function() {

        OPrime.debug("Initializing ParticipantFactory");

        var newParticipant = function(attributes) {
          var participant = {
            userRoles : [ "Participant" ]
          };
          participant.setAttributes(attributes);
          return participant;
        };

        /*
         * Load participant from localstorage or create a new participant
         */
        var initialize = function(participant) {
          if (!participant) {
            participant = localStorage.getItem("encryptedParticipant");
            if (participant) {
              OPrime.debug("Setting participant from localstorage");
              participant = JSON.parse(participant);
            }
          }
          if (!participant) {
            OPrime.debug("Creating new participant.");
            participant = newParticipant();
          }
          /*
           * Leak scope out to the window so that we can debug, if we are in
           * debugMode
           */
          if (OPrime.debugMode) {
            window.participant = participant;
          }
          return participant;
        };
        initialize();

        return {
          'newParticipant' : newParticipant
        };

      });

      console.log("Declaring ParticipantFactory");
      return ParticipantFactory;
    });