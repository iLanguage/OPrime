console.log("Loading CouchDBServices");
/*
 * http://guide.couchdb.org/draft/security.html
 * http://docs-next.angularjs.org/api/angular.module.ngCookies.$cookies
 * https://groups.google.com/forum/#!topic/angular/yc8tODmDm18
 * http://mail-archives.apache.org/mod_mbox/couchdb-user/201011.mbox/%3CAANLkTimSxUWQhwYfTTGe1vNkhkf2xnMiWmt9eriKMU8P@mail.gmail.com%3E
 * 
 */

'use strict';
define(
    [ "angular", "OPrime" ],
    function(angular, OPrime) {

      var CouchDBServices = angular
          .module('CouchDBServices', [ 'ngResource' ])
          .factory(
              "isAUser",
              function($resource) {
                return $resource(AuthService.getCouchConnection().complete
                    + "_design/user/_view/isauser", {}, {
                  run : {
                    method : "POST",
                    data : {
                      name : "semisecureadmin",
                      password : "none"
                    }
                  // isArray : false
                  }
                });
              })
          .factory(
              "getUserRoles",
              function($resource) {
                return $resource(AuthService.getCouchConnection().complete
                    + "_design/user/_view/roles", {}, {
                  run : {
                    method : "GET",
                    isArray : false
                  }
                });
              })
          .factory(
              'GetSessionToken',
              function($http, AuthService, Authenticate) {
                OPrime.debug("Contacting the DB to log user in.");
                if (!OPrime.useUnsecureCouchDB()) {
                  return {
                    'run' : function(dataToPost) {
                      OPrime.debug("Getting session token.");
                      var couchInfo = AuthService.getCouchConnection();
                      var promise = $http
                          .post(
                              couchInfo.protocol + couchInfo.domain + couchInfo.port + '/_session',
                              dataToPost)
                          .error(
                              function(response, status, headers, config) {
                                OPrime.debug("error getting session token", response, status,
                                    headers, config);
//                                OPrime.bug("TODO add more error checking");
                                AuthService
                                    .setError("You do not yet have access to the database, creating a user for you.");
                                /*
                                 * TODO if not a user tell auth to register the
                                 * user on the couchserver, and probably make
                                 * them a database, which will most likely call
                                 * back to this service to do the couch parts.
                                 */
                                Authenticate.register(dataToPost);
                              }).then(function(response) {
                            OPrime.debug("Session token set for ", response);
                            AuthService.setCouchConnection(couchInfo);
                            return;
                          });
                      return promise;
                    }
                  };
                } else {
                  OPrime.debug("Not getting session token, instead using an unsecure TouchDB.");
                  return {
                    'run' : function(dataToPost) {
                      var couchInfo = AuthService.getCouchConnection();
                      /*
                       * TODO do some sort of polling to get to the touchdb
                       * where page?
                       */
                      var promise = $http.get(
                          couchInfo.protocol + couchInfo.domain + couchInfo.port + '', dataToPost)
                          .then(function(response, data, status, headers, config) {
                            OPrime.debug("Faking Session token set");
                            return response;
                          });
                      return promise;
                    }
                  };
                }
              }).factory(
              'CouchDatabase',
              function($http, AuthService) {
                return {
                  'get' : function(UUID) {
                    var couchInfo = AuthService.getCouchConnection();
                    OPrime.debug("Contacting the DB to get Doc by UUID " + couchInfo.complete
                        + UUID);
                    var promise = $http.get(couchInfo.complete + UUID).then(function(response) {
                      OPrime.debug("Receiving item from db " + UUID + " : " + response.status);
                      return response.data;
                    }/*, function(e, f, g) {
                      OPrime.debug("Error Receiving item from db " + UUID + " : " + e.status);
                      return {};
                    }*/);
                    return promise;
                  },
                  'save' : function(document) {
                    var couchInfo = AuthService.getCouchConnection();
                    var promise = $http.post(couchInfo.complete, document).error(
                        function(response, status, headers, config) {
//                          OPrime.debug(response, status, headers, config);
                          AuthService.notify("There was an error saving "+document._id+", please try again. "
                              + document._id);
                          AuthService.setError("There was an error saving "+document._id+", please try again. "
                              + document._id);
                        }).then(
                        function(response, data, status, headers, config) {
                          OPrime.debug("CouchDB Document saved", response, data, status, headers,
                              config);
                          AuthService.setError("");
                          return;
                        });
                    return promise;
                  },
                  'register' : function(document) {
                    alert("TODO");
                  }
                };
              });
      return CouchDBServices;
    });
