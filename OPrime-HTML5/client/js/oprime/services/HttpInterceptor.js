console.log("Loading HttpInterceptor");
/*
 * http://stackoverflow.com/questions/11971213/error-401-handling-with-angularjs
 */
'use strict';
define([ "angular" ], function(angular) {

  var interceptor = [ '$rootScope', '$q', function(scope, $q) {

    function success(response) {
      return response;
    }

    function error(response) {
      var status = response.status;

      if (status == 401) {
        var deferred = $q.defer();
        var req = {
          config : response.config,
          deferred : deferred
        };
        window.location = "./index.html";
      }
      // otherwise
      return $q.reject(response);

    }

    return function(promise) {
      return promise.then(success, error);
    };

  } ];
  $httpProvider.responseInterceptors.push(interceptor);

  return interceptor;
});