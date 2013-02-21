console.log("Loading VisitorServices");
'use strict';
define([ "angular", "underscore" ], function(angular, _) {

  var VisitorServices = angular.module('Visitor.services', [ 'ngResource' ])
      .factory(
          'VisitorService',
          function() {

            OPrime.debug("Initializing VisitorServices");

            var setAttributes = function(attributes) {
              for ( var x in attributes) {
                if (x == "name") {
                  // alert("setting name to "+attributes[x]);
                  if (attributes[x] == "") {
                    continue;
                  }
                }
                visitor[x] = attributes[x];
              }
            };
            var newVisitor = function(attributes) {
              var visitor = {
                userRoles : [ "Visitor" ],

                preferedLanguage : {
                  iso_code : "en",
                  jslocalecode : "en",
                  languagename : "EN"
                },
                authConnections : [],
                ftpConnections : [],
                databaseConnections : [],
                versionWhenCreated : {
                  software : AuthService.getSofware(),
                  hardware : AuthService.getHardware()
                },
                versionWhenModified : {
                  software : AuthService.getSofware(),
                  hardware : AuthService.getHardware()
                },
                dateCreated : JSON.stringify(new Date()),
                dateModified : JSON.stringify(new Date()),
                username : Date.now(),
                userPublic : {
                  username : "",
                  offlineLogins : [],
                  validated : false
                },
                hash : null,
                validated : false,
                offlineLogins : [],
                error : "",
                status : "",
                notifications : []
              };
              visitor.setAttributes(attributes);
              visitor.userPublic.offlineLogins = visitor.offlineLogins;
              return visitor;
            };

            /*
             * Load visitor from localstorage or create a new app
             */
            var initialize = function(visitor) {
              if (!visitor) {
                visitor = localStorage.getItem("encryptedVistor");
                if (visitor) {
                  OPrime.debug("Setting visitor from localstorage");
                  visitor = JSON.parse(visitor);
                }
              }
              if (!visitor) {
                OPrime.debug("Creating new visitor.");
                visitor = newVisitor();
              }
              /*
               * Leak scope out to the window so that we can debug, if we are in
               * debugMode
               */
              if (OPrime.debugMode) {
                window.visitor = visitor;
              }
              return visitor;

            };

            return {
              'newVisitor' : newVisitor,
              'getUserPublic' : function() {
                /* TODO why is this function empty */
                return;
              },
              'addRoleToVisitor' : function(roleString) {
                visitor.userRoles.unshift(roleString);
                visitor.userRoles = _.unique(visitor.userRoles);
              },
              'notify' : function(message) {
                visitor.notifications.unshift({
                  message : message,
                  timestamp : Date.now()
                });
              },
              /*
               * Find the index of the notification with this timestamp, and
               * remove it from the array
               */
              'removeNotification' : function(notification) {
                visitor.notifications.splice(_.pluck(visitor.notifications,
                    "timestamp").indexOf(notification.timestamp), 1);
              },
              'removeAllNotifications' : function() {
                visitor.notifications = [];
              },
              'setStatus' : function(status) {
                visitor.status = status;
              },
              'setError' : function(error) {
                visitor.error = error;
              },
              'getHash' : function() {
                return visitor.hash;
              },
              'getVisitor' : function() {
                return visitor;
              },
              'getHardware' : function() {
                return visitor.hardwares[0];
              },
              'getSoftware' : function() {
                return visitor.softwares[0];
              },
              'getAuthConnection' : function() {
                return visitor.authConnections[0];
              },
              'setAuthConnection' : function(authConnection) {
                visitor.authConnections.unshift(authConnection);
                visitor.authConnections = _.unique(visitor.authConnections);
              },
              'getFTPConnection' : function() {
                return visitor.ftpConnections[0];
              },
              'setFTPConnection' : function(ftpConnection) {
                visitor.ftpConnections.unshift(ftpConnection);
                visitor.ftpConnections = _.unique(visitor.ftpConnections);
              },
              'getCouchConnection' : function() {
                return OPrime.couchURL();
              },
              'setCouchConnection' : function(couchConnection) {
                visitor.couchConnections.unshift(couchConnection);
                visitor.couchConnections = _.unique(visitor.couchConnections);
              },
              'setSalt' : function(salt) {
                visitor.salt = salt;
              },
              'saltVisitorsPassword' : saltVisitorsPassword,
              'getConnectivity' : function(connectivity) {
              },
              'setConnectivity' : function(connectivity) {
              },
              'setVisitorAttributes' : setVisitorAttributes,
              /**
               * @param iso_code
               * @returns a language object which can be stored in the scope
               */
              'changeLanguage' : function(iso_code) {
                if (!iso_code) {
                  visitor.preferedLanguage = Locale.getNextLanguage();
                } else {
                  visitor.preferedLanguage = Locale.getLanguage(iso_code);
                }
                return visitor.preferedLanguage;
              },
              'getVisitorsLanguage' : function() {
                if (visitor) {
                  return visitor.preferedLanguage;
                } else {
                  return {
                    iso_code : "en",
                    jslocalecode : "en",
                    languagename : "EN"
                  };
                }
              },
              'getVisitorInfo' : function() {
                return visitor;
              },
              'saveVisitor' : function() {
                if (visitor) {
                  localStorage.setItem("encryptedVisitor", JSON
                      .stringify(visitor));
                }
                OPrime.debug(visitor);
              },
              'getWhoWhereHow' : function() {
                return {
                  user : visitor.userPublic,
                  hardware : visitor.hardwares[0],
                  software : visitor.softwares[0]
                };
              },
              'startNewVisit' : function(visit) {
                if (visit) {
                  visit = {
                    dateStarted : Date.now(),
                    dateCompleted : ""
                  };
                }
                visitor.visits.unshift(visit);
              },
              'createWhoWhatWhereWhenHowWhy' : function(what) {
                return {
                  whoWhereHow : {
                    user : visitor.userPublic,
                    hardware : visitor.hardwares[0],
                    software : visitor.softwares[0]
                  },
                  when : {
                    usersDate : new Date(),
                    timestamp : Date.now()
                  },
                  what : what
                };
              }
            };

          });

  console.log("Declaring VisitorServices");
  return VisitorServices;
});