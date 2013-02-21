console.log("Loading AuthenticationServices");

'use strict';
define([ "angular", "underscore" ], function(angular, _) {

  var AuthenticationServices = angular.module('Authentication.services',
      [ 'ngResource' ])
  /**
   * Encrypt accepts a string (UTF8) and returns a CryptoJS object, in base64
   * encoding so that it looks like a string, and can be saved as a string in
   * the corpus.
   * 
   * @param contents
   *          A UTF8 string
   * @returns Returns a base64 string prefixed with "confidential" so that the
   *          views can choose to not display the entire string for the user.
   */
  .factory("EncryptUser", function(contents) {
    var result = CryptoJS.AES.encrypt(contents, OPrime.userEncryptionToken());
    // return the base64 version to save it as a string in the
    // corpus
    return "confidential:" + btoa(result);
  })
  /**
   * Decrypt uses this object's secret key to decode its parameter using the AES
   * algorithm.
   * 
   * @param encrypted
   *          A base64 string prefixed (or not) with the word "confidential"
   * @returns Returns the encrypted result as a UTF8 string.
   */
  .factory(
      "DecryptUser",
      function(encrypted) {
        encrypted = encrypted.replace("confidential:", "");
        // decode base64
        encrypted = atob(encrypted);
        resultpromise = CryptoJS.AES.decrypt(encrypted,
            OPrime.userEncryptionToken()).toString(CryptoJS.enc.Utf8);
        return resultpromise;
      }).factory(
      'SaltUsersPassword',
      function(usernameAndPassword, salt) {
        var token = usernameAndPassword.password + salt;
        var hash = CryptoJS.MD5(token);
        if (Pivot88.debugMode)
          Pivot88.debug("hash: " + hash.toString() + " password: "
              + usernameAndPassword.password);
        return hash;
      }).factory(
      'Authenticate',
      function(AuthService) {
        var domain = window.location.origin;
        if (domain.indexOf("localhost:8138")) {
          domain = "http://demo.pivot88.com:5984";
        }
        var port = window.location.port;
        if (port.indexOf("8138")) {
          port = "5984"
        }
        var newUsersDBConnection = {
          complete : window.location.origin + "/newUsersDBTemplate/",
          protocol : window.location.protocol,
          domain : domain,
          port : port,
          db : "newUsersDBTemplate/"
        };

        return {
          'login' : function(loginuser, loggedInClientSideCallback) {
            OPrime.debug("Authenticating " + loginuser.username);
            /*
             * If the person trying to log in, isn't in the active user, then
             * add them to the list and set them as the active user.
             */
            var usersIndexInKnownUsers = _.pluck(auth.users, "username")
                .indexOf(loginuser.username);
            if (usersIndexInKnownUsers == -1) {
              auth.users.unshift(AuthService.newUser({
                username : loginuser.username
              }));
            } else {
              var knownuser = auth.users.splice(usersIndexInKnownUsers, 1);
              auth.users.unshift(knownuser[0]);
              OPrime.debug("Welcome back " + auth.users[0].username + "!");
            }
            if (typeof loggedInClientSideCallback == "function") {
              loggedInClientSideCallback();
            }
          },
          'logout' : function() {
            auth.users[0].hash = undefined;
            auth.users[0].validated = false;
            AuthService.saveAuth();
            window.location.replace(AuthService.getWebsiteURL());
            return;
          },
          'register' : function(couchuser) {
            // alert("TODO write functions to create a database, if this is
            // a valid platform user.. and to turn on replication and
            // redirect to users touchdb if they are on an android.");

            return;
          }
        };
      });

  console.log("Declaring AuthenticationServices");

  return AuthenticationServices;

});