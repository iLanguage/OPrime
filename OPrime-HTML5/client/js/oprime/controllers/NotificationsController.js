console.log("Loading the NotificationsController .");

'use strict';
define(
    [ "angular", "OPrime", "underscore" ],
    function(angular, OPrime, _) {

      var NotificationsController = function($scope, $routeParams, AuthService) {
        OPrime.debug("Initializing the NotificationsController", $routeParams);

        // alert('$routeParams.action '+ $routeParams.action);
        // console.log('$routeParams', $routeParams);

        if ($routeParams.action == "dismiss") {
          AuthService.removeAllNotifications();
          $scope.auth = AuthService.getAuthInfo();
        }

        $scope.removeNotification = function(notification) {
          AuthService.removeNotification(notification);
          $scope.auth = AuthService.getAuthInfo();
        };

      };
      OPrime.debug("Declaring the NotificationsController .");
      NotificationsController.$inject = [ '$scope', '$routeParams',
          'AuthService' ];

      return NotificationsController;
    });