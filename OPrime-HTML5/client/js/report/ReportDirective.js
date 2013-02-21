console.log("Loading the ReportDirectives.");

'use strict';
define([ "angular" ], function(angular) {
  var ReportDirectives = angular.module('Report.directives', []).directive(
      'moduleVersion', [ 'version', function(version) {
        return function(scope, element, attrs) {
          element.text(version);
        };
      } ]);

  return ReportDirectives;
});