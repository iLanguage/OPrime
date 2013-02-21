console.log("Loading UserServices");
'use strict';
define([ "angular", "underscore" ], function(angular, _) {

  var UserServices = angular.module('User.services', [ 'ngResource' ]).factory(
      'UserService', function(VisitorService) {

        OPrime.debug("Initializing UserServices");

        var newUser = function(attributes) {
          var user = VisitorService.newVisitor();
          user.setAttributes({
            userRoles : [ "User" ],
            name : "",
            email : ""
          });
          user.setAttributes(attributes);
          user.userPublic.name = user.name;
          return user;
        };

        /*
         * Load user from localstorage or create a new app
         */
        var initialize = function(user) {
          if (!user) {
            user = localStorage.getItem("encryptedUser");
            if (user) {
              OPrime.debug("Setting user from localstorage");
              user = JSON.parse(user);
            }
          }
          if (!user) {
            OPrime.debug("Creating new user.");
            user = newExperimenter();
          }
          /*
           * Leak scope out to the window so that we can debug, if we are in
           * debugMode
           */
          if (OPrime.debugMode) {
            window.user = user;
          }
          return user;
        };

        return {
          'newUser' : newUser,
          'getName' : function() {
            return user.firstname + " " + user.lastname;
          },
          'saveUser' : function() {
            if (user) {
              localStorage.setItem("encryptedUser", JSON.stringify(user));
            }
            OPrime.debug(user);
          }
        };

        
      });

  console.log("Declaring UserServices");
  return UserServices;
});