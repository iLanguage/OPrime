console.log("Loading the OPrime main");

// Set the RequireJS configuration
require
    .config({
      paths : {
        /* AngularJS */
        "angular" : "../libs/angular/angular",
        "angular-resource" : "../libs/angular/angular-resource",
        "angular-ui" : "../libs/angular-ui/angular-ui",
        "angular-bootstrap-templates" : "../libs/angular-ui/ui-bootstrap-templates",

        /* HTML5 libraries to interact with Android Tablet */
        "OPrime" : "oprime/OPrime",
      },
      shim : {
        "angular" : {
          exports : "angular"
        },
        "angular-ui" : {
          deps : [ "angular" ],
          exports : "angular"
        },
        "angular-bootstrap-templates" : {
          deps : [ "angular" ],
          exports : "angular"
        },
        "angular-resource" : {
          deps : [ "angular", "angular-ui", "angular-bootstrap-templates" ],
          exports : "angular"
        },
        "OPrime" : {
          exports : "OPrime"
        }
      }
    });

/*
 * Declare only the variables that are needed here, the dependencies of the rest
 * will be discovered and loaded as needed by require.js
 */
require([ "angular-resource", "OPrime", "oprime_module_definition" ],
    function() {
      console.log("Initializing the OPrime Library for Angularjs.");
      // angular.bootstrap(document, [ 'OPrimeAPP' ]);
    });