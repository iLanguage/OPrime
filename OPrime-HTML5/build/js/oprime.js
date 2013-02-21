
define('angular',{});
define('angular-ui',{});
define('angular-bootstrap-templates',{});
define('angular-resource',{});
var OPrime = {};
/*
 * Declare functions for PubSub
 */
OPrime.publisher = {
  subscribers : {
    any : []
  },
  subscribe : function(type, fn, context) {
    type = type || 'any';
    fn = typeof fn === "function" ? fn : context[fn];

    if (typeof this.subscribers[type] === "undefined") {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push({
      fn : fn,
      context : context || this
    });
  },
  unsubscribe : function(type, fn, context) {
    this.visitSubscribers('unsubscribe', type, fn, context);
  },
  publish : function(type, publication) {
    this.visitSubscribers('publish', type, publication);
  },
  visitSubscribers : function(action, type, arg, context) {
    var pubtype = type || 'any';
    var subscribers = this.subscribers[pubtype];
    if (!subscribers || subscribers.length == 0) {
      OPrime.debug(pubtype + ": There were no subscribers.");
      return;
    }
    var i;
    var maxUnsubscribe = subscribers ? subscribers.length - 1 : 0;
    var maxPublish = subscribers ? subscribers.length : 0;

    if (action === 'publish') {
      // count up so that older subscribers get the message first
      for (i = 0; i < maxPublish; i++) {
        if (subscribers[i]) {
          // TODO there is a bug with the subscribers they are getting lost, and
          // it is trying to call fn of undefiend. this is a workaround until we
          // figure out why subscribers are getting lost. Update: i changed the
          // loop to count down and remove subscribers from the ends, now the
          // size of subscribers isnt changing such that the subscriber at index
          // i doesnt exist.
          subscribers[i].fn.call(subscribers[i].context, arg);
        }
      }
      OPrime.debug('Visited ' + subscribers.length + ' subscribers.');

    } else {

      // count down so that subscribers index exists when we remove them
      for (i = maxUnsubscribe; i >= 0; i--) {
        try {
          if (!subscribers[i].context) {
            OPrime
                .debug("This subscriber has no context. should we remove it? "
                    + i);
          }
          if (subscribers[i].context === context) {
            var removed = subscribers.splice(i, 1);
            OPrime.debug("Removed subscriber " + i + " from " + type, removed);
          } else {
            OPrime.debug(type + " keeping subscriber " + i,
                subscribers[i].context);
          }
        } catch (e) {
          OPrime.debug("problem visiting Subscriber " + i, subscribers)
        }
      }
    }
  }
};
OPrime.makePublisher = function(o) {
  var i;
  for (i in OPrime.publisher) {
    if (OPrime.publisher.hasOwnProperty(i)
        && typeof OPrime.publisher[i] === "function") {
      o[i] = OPrime.publisher[i];
    }
  }
  o.subscribers = {
    any : []
  };
};

OPrime.debugMode = true;
OPrime.runFromTouchDBOnAndroidInLocalNetwork = true;

OPrime.debug = function(message, message2) {
  if (!message2) {
    message2 = "";
  }
  if (this.debugMode) {
    console.log(message, message2);
  }
};

OPrime.bug = function(message) {
  alert(message);
};

OPrime.warn = function(message) {
  alert(message);
};

/**
 * http://www.w3schools.com/js/js_cookies.asp name of the cookie, the value of
 * the cookie, and the number of days until the cookie expires.
 * 
 * @param c_name
 * @param value
 * @param exdays
 */
OPrime.setCookie = function(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value = escape(value)
      + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
};
OPrime.getCookie = function(c_name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
};

OPrime.isAndroidApp = function() {
  // Development tablet navigator.userAgent:
  // Mozilla/5.0 (Linux; U; Android 3.0.1; en-us; gTablet Build/HRI66)
  // AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13
  // this.debug("The user agent is " + navigator.userAgent);
  return navigator.userAgent.indexOf("OfflineAndroidApp") > -1;
};

if (OPrime.isAndroidApp()) {
  var debugOrNot = Android.isD();
  console.log("Setting debug mode to the Android's mode: " + debugOrNot);
  OPrime.debugMode = debugOrNot;
};

OPrime.isAndroid4 = function() {
  return navigator.userAgent.indexOf("Android 4") > -1;
};

OPrime.isChromeApp = function() {
  return window.location.href.indexOf("chrome-extension") > -1;
};

/*
 * Audio functions
 */
OPrime.playAudioFile = function(divid, audioOffsetCallback, callingcontext) {
  this.debug("Playing Audio File and subscribing to audio completion.")
  var audiourl = document.getElementById(divid).getAttribute("src")
  if (!callingcontext) {
    callingcontext = window;
  }
  var callingcontextself = callingcontext;
  if (!audioOffsetCallback) {
    audioOffsetCallback = function(message) {
      OPrime.debug("In audioOffsetCallback: " + message);
      OPrime.hub.unsubscribe("playbackCompleted", null, callingcontextself);
    }
  }
  this.hub.unsubscribe("playbackCompleted", null, callingcontextself);
  this.hub.subscribe("playbackCompleted", audioOffsetCallback,
      callingcontextself);

  if (this.isAndroidApp()) {
    this.debug("Playing Audio via Android:" + audiourl + ":");
    Android.playAudio(audiourl);
  } else {
    this.debug("Playing Audio via HTML5:" + audiourl + ":");
    document.getElementById(divid).removeEventListener('ended',
        OPrime.audioEndListener);
    OPrime.debug("\tRemoved previous endaudio event listeners for " + audiourl);
    document.getElementById(divid).addEventListener('ended',
        OPrime.audioEndListener);
    document.getElementById(divid).play();
  }
}
OPrime.audioEndListener = function() {
  var audiourl = this.getAttribute("src")
  OPrime.debug("End audio ", audiourl);
  OPrime.hub.publish('playbackCompleted', audiourl);
};
OPrime.pauseAudioFile = function(divid, callingcontext) {
  if (!callingcontext) {
    callingcontext = window;
  }
  var callingcontextself = callingcontext;
  OPrime.hub.unsubscribe("playbackCompleted", null, callingcontextself);

  if (this.isAndroidApp()) {
    this.debug("Pausing Audio via Android");
    Android.pauseAudio();
  } else {
    this.debug("Pausing Audio via HTML5");
    document.getElementById(divid).pause();
    if (document.getElementById(divid).currentTime > 0.05) {
      document.getElementById(divid).currentTime = document
          .getElementById(divid).currentTime - 0.05;
    }

  }
}
OPrime.stopAudioFile = function(divid, callback, callingcontext) {
  if (!callingcontext) {
    callingcontext = window;
  }
  var callingcontextself = callingcontext;
  OPrime.hub.unsubscribe("playbackCompleted", null, callingcontextself);

  if (this.isAndroidApp()) {
    this.debug("Stopping Audio via Android");
    Android.stopAudio();
  } else {
    this.debug("Stopping Audio via HTML5");
    document.getElementById(divid).pause();
    document.getElementById(divid).currentTime = 0;
  }
  if (typeof callback == "function") {
    callback();
  }
}
OPrime.playingInterval = false;
OPrime.playIntervalAudioFile = function(divid, startime, endtime, callback) {
  startime = parseFloat(startime, 10);
  endtime = parseFloat(endtime, 10);
  if (this.isAndroidApp()) {
    this.debug("Playing Audio via Android from " + startime + " to " + endtime);
    startime = startime * 1000;
    endtime = endtime * 1000;
    var audiourl = document.getElementById(divid).getAttribute("src")
    Android.playIntervalOfAudio(audiourl, startime, endtime);
  } else {
    this.debug("Playing Audio via HTML5 from " + startime + " to " + endtime);
    document.getElementById(divid).pause();
    document.getElementById(divid).currentTime = startime;
    OPrime.debug("Cueing audio to "
        + document.getElementById(divid).currentTime);
    document.getElementById(divid).play();
    OPrime.playingInterval = true;
    document.getElementById(divid).addEventListener("timeupdate", function() {
      if (this.currentTime >= endtime && OPrime.playingInterval) {
        OPrime.debug("CurrentTime: " + this.currentTime);
        this.pause();
        OPrime.playingInterval = false; /*
                                         * workaround for not being able to
                                         * remove events
                                         */
      }
    });
  }
  if (typeof callback == "function") {
    callback();
  }
}
OPrime.captureAudio = function(resultfilename, callbackRecordingStarted,
    callbackRecordingCompleted, callingcontext) {
  if (!callingcontext) {
    callingcontext = window;
  }
  /*
   * verify completed callback and subscribe it to audioRecordingCompleted
   */
  var callingcontextself = callingcontext;
  if (!callbackRecordingCompleted) {
    callbackRecordingCompleted = function(message) {
      OPrime.debug("In callbackRecordingCompleted: " + message);
      OPrime.hub.unsubscribe("audioRecordingCompleted", null,
          callingcontextself);
    };
  }
  this.hub.unsubscribe("audioRecordingCompleted", null, callingcontextself);
  this.hub.subscribe("audioRecordingCompleted", callbackRecordingCompleted,
      callingcontextself);

  /*
   * verify started callback and subscribe it to
   * audioRecordingSucessfullyStarted
   */
  if (!callbackRecordingStarted) {
    callbackRecordingStarted = function(message) {
      OPrime.debug("In callbackRecordingStarted: " + message);
      OPrime.hub.unsubscribe("audioRecordingSucessfullyStarted", null,
          callingcontextself);
    };
  }
  this.hub.unsubscribe("audioRecordingSucessfullyStarted", null,
      callingcontextself);
  this.hub.subscribe("audioRecordingSucessfullyStarted",
      callbackRecordingStarted, callingcontextself);

  /* start the recording */
  if (this.isAndroidApp()) {
    this.debug("Recording Audio via Android");
    Android.startAudioRecordingService(resultfilename);
    // the android will publish if its successfully stopped, and that it
    // completed
  } else {
    this.debug("Recording Audio via HTML5: " + resultfilename);
    alert("Recording audio only works on Android, because it has a microphone, and your computer might not.\n\n Faking that it was sucessful")
    // fake publish it was sucessfully started
    this.hub.publish('audioRecordingSucessfullyStarted', resultfilename);
  }

};
OPrime.stopAndSaveAudio = function(resultfilename, callbackRecordingStopped,
    callingcontext) {

  /*
   * verify started callback and subscribe it to
   * audioRecordingSucessfullyStarted
   */
  var callingcontextself = callingcontext;
  if (!callbackRecordingStopped) {
    callbackRecordingStopped = function(message) {
      OPrime.debug("In callbackRecordingStopped: " + message);
      OPrime.hub.unsubscribe("audioRecordingSucessfullyStopped", null,
          callingcontextself);
    };
  }
  this.hub.unsubscribe("audioRecordingSucessfullyStopped", null,
      callingcontextself);
  this.hub.subscribe("audioRecordingSucessfullyStopped",
      callbackRecordingStopped, callingcontextself);

  /* start the recording */
  if (this.isAndroidApp()) {
    this.debug("Stopping Recording Audio via Android");
    Android.stopAudioRecordingService(resultfilename);
    // the android will publish if its successfully started
  } else {
    this.debug("Stopping Recording Audio via HTML5: " + resultfilename);
    alert("Recording audio only works on Android, because it has a microphone, and your computer might not.\n\n Faking that stopped and saved sucessfully")
    // fake publish it was sucessfully started
    resultfilename = "chime.mp3"
    this.hub.publish('audioRecordingSucessfullyStopped', resultfilename);
    // fake publish it finished
    this.hub.publish('audioRecordingCompleted', resultfilename);
  }

};
/*
 * Camera functions
 */
OPrime.capturePhoto = function(resultfilename, callbackPictureCaptureStarted,
    callbackPictureCaptureCompleted, callingcontext) {
  if (!callingcontext) {
    callingcontext = window;
  }
  /*
   * verify completed callback and subscribe it to audioRecordingCompleted
   */
  var callingcontextself = callingcontext;
  if (!callbackPictureCaptureStarted) {
    callbackPictureCaptureStarted = function(message) {
      OPrime.debug("In callbackPictureCaptureStarted: " + message);
      OPrime.hub.unsubscribe("pictureCaptureSucessfullyStarted", null,
          callingcontextself);
    };
  }
  if (!callbackPictureCaptureCompleted) {
    callbackPictureCaptureCompleted = function(message) {
      OPrime.debug("In callbackPictureCaptureCompleted: " + message);
      OPrime.hub.unsubscribe("pictureCaptureSucessfullyCompleted", null,
          callingcontextself);
    };
  }
  /*
   * unsubscribe this context from the chanel incase the user calls it many
   * times on teh same item, only fire the last event
   */
  this.hub.unsubscribe("pictureCaptureSucessfullyStarted", null,
      callingcontextself);
  this.hub.unsubscribe("pictureCaptureSucessfullyCompleted", null,
      callingcontextself);
  /* subscribe the caller's functions to the channels */
  this.hub.subscribe("pictureCaptureSucessfullyStarted",
      callbackPictureCaptureStarted, callingcontextself);
  this.hub.subscribe("pictureCaptureSucessfullyCompleted",
      callbackPictureCaptureCompleted, callingcontextself);

  /* start the picture taking */
  if (this.isAndroidApp()) {
    this.debug("Starting picture capture via Android");
    Android.takeAPicture(resultfilename);
    // the android will publish if its successfully started and completed
  } else {
    this.debug("Starting picture capture via HTML5: " + resultfilename);
    alert("Taking a picture only works on Android, because it has a camera, and your computer might not.\n\n Faking that taken a picture and saved sucessfully");
    // fake publish it was sucessfully started
    resultfilename = "happyface.png";
    this.hub.publish('pictureCaptureSucessfullyStarted', resultfilename);
    this.hub.publish('pictureCaptureSucessfullyCompleted', resultfilename);
  }
};

/*
 * Initialize the debugging output, taking control from the Android side.
 */
OPrime.debug("Intializing OPrime Javascript library. \n" + "The user agent is "
    + navigator.userAgent);

if (OPrime.isAndroidApp()) {
  if (!Android.isD()) {
    this.debugMode = false;
    this.debug = function() {
    };
  } else {
    this.debugMode = true;
  }
}

OPrime.userEncryptionToken = function() {
  return "topsecretuserencryptiontokenfortestingTODOchangethis";
};

OPrime.runFromTouchDBOnAndroidInLocalNetwork = true;

OPrime.couchURL = function() {
  if (OPrime.isAndroidApp()) {
    return {
    };
  }
  if (OPrime.runFromTouchDBOnAndroidInLocalNetwork && window.location.origin.indexOf("chrome-extension") != 0) {
    return {
    };
  }
  return {
  };
};

OPrime.getConnectivityType = function(callingcontextself, callback) {
  this.hub.unsubscribe("connectivityType", null, callingcontextself);
  /* subscribe the caller's functions to the channels */
  this.hub.subscribe("connectivityType", callback, callingcontextself);

  /* Fire command which will publish the connectivity */
  if (OPrime.isAndroidApp()) {
    OPrime.debug("This is an Android.");
    Android.getConectivityType();
  } else {
    OPrime.hub.publish('connectivityType', 'Probably Online');
  }
};

OPrime.getHardwareInfo = function(callingcontextself, callback) {
  this.hub.unsubscribe("hardwareDetails", null, callingcontextself);
  /* subscribe the caller's functions to the channels */
  this.hub.subscribe("hardwareDetails", callback, callingcontextself);

  /* Fire command which will publish the connectivity */
  if (OPrime.isAndroidApp()) {
    OPrime.debug("This is an Android.");
    Android.getHardwareDetails();
  } else {
    OPrime.hub.publish('hardwareDetails', {
      name : 'Browser',
      model : navigator.userAgent,
      identifier : 'TODOgetMACAddress'
    });
  }
};
OPrime.useUnsecureCouchDB = function() {
  if (OPrime.isAndroidApp()) {
    /*
     * TODO if later when TouchDB has secure databases, we can use a secure
     * TouchDB, return false
     */
    return true;
  }
  if (OPrime.runFromTouchDBOnAndroidInLocalNetwork && window.location.origin.indexOf("chrome-extension") != 0) {
    return true;
  }
  return false;
};

/*
 * Initialize pub sub
 */
OPrime.hub = {};
OPrime.makePublisher(OPrime.hub);

define("OPrime", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.OPrime;
    };
}(this)));

console.log("Loading the OPrimeController.");


define('experiment/controllers/OPrimeController',[ "angular" ], function(angular) {
  var OPrimeController = function($scope, $rootScope) {
    console.log("In the OPrimeController.");
  };
  window.OPrimeController = OPrimeController;
  console.log("Declaring the OPrimeController");

  return OPrimeController;
});

console.log("Loading the OPrimeExperimentController.");


define('experiment/controllers/OPrimeExperimentController',[ "angular" ], function(angular) {
  var OPrimeExperimentController = function($scope, $rootScope) {
    console.log("In the OPrimeExperimentController.");
//    console.log("experimentalDesign", $scope.experimentalDesign);
  };
  window.OPrimeExperimentController = OPrimeExperimentController;
  console.log("Declaring the OPrimeExperimentController");

  return OPrimeExperimentController;
});

console.log("Loading the OPrimeExperimentCompletedController.");


define('experiment/controllers/OPrimeExperimentCompletedController',[ "angular" ], function(angular) {
  var OPrimeExperimentCompletedController = function($scope, $rootScope) {
    console.log("In the OPrimeExperimentCompletedController.");
  };
  window.OPrimeExperimentCompletedController = OPrimeExperimentCompletedController;
  console.log("Declaring the OPrimeExperimentCompletedController");

  return OPrimeExperimentCompletedController;
});

console.log("Loading the OPrimeMenuController.");


define('experiment/controllers/OPrimeMenuController',[ "angular" ], function(angular) {
  var OPrimeMenuController = function($scope, $rootScope) {
    console.log("Initializing the OPrimeMenuController");
    
    
    
  };
  window.OPrimeMenuController = OPrimeMenuController;
  console.log("Declaring the OPrimeMenuController");

  return OPrimeMenuController;
});


console.log("Loading the OPrimeTutorialController.");


define('experiment/controllers/OPrimeTutorialController',[ "angular" ], function(angular) {
  var OPrimeTutorialController = function($scope, $rootScope) {
    $scope.title = $rootScope.title;
    $scope.openTutorial = function() {
      $scope.shouldBeOpen = true;
    };

    $scope.closeTutorial = function() {
      $scope.closeMsg = 'I was closed at: ' + new Date();
      $scope.shouldBeOpen = false;
    };
  };
  window.OPrimeTutorialController = OPrimeTutorialController;
  console.log("Declaring the OPrimeTutorialController");

  return OPrimeTutorialController;
});

console.log("Loading the ExperimentDirectives.");


define('experiment/directives/ExperimentDirectives',
    [ "angular" ],
    function() {

      var ExperimentDirectives = angular
          .module('Experiment.directives', [])
          /*
           * Show the user a tutorial
           */
          .directive('oprimeTutorial', function($rootScope) {
            return {
              restrict : 'E',
              scope : {
                logo : '@logo',
                instructionsAudio : '@instructionsAudio'
              },
              templateUrl : 'partials/tutorial.html',
              link : function(scope, element, attrs){
                scope.logo = window.experiment.logo;
                scope.title = window.experiment.title;
                scope.startInstructionsAudio = window.experiment.startInstructionsAudio;
                scope.startInstructions = window.experiment.startInstructions;
                scope.endInstructions = window.experiment.endInstructions;
              }
            };
          })
          /*
           * Allow the users to go forward and backward
           */
          .directive(
              'oprimeStimuliControlButtons',
              function() {
                return {
                  restrict : 'E',
                  scope : {},
                  template : '<div class="row-fluid pagination-centered">                '
                      + '<h1>              '
                      + '<i class="icon-forward pull-right" ng-click="nextStimuli()"></i> <i              '
                      + '  class="icon-backward pull-left" ng-click="previousStimuli()"></i>              '
                      + '</h1>             '
                      + '<img id="image_prime" width="100" />' + ' </div>',
                  link : function(scope, element, attrs) {
                    console.log("Linking an experiment button panel");
                    scope.previousStimuli = function() {
                      alert("Going to previous stimuli");
                    };
                    scope.nextStimuli = function() {
                      alert("Going to next stimuli");
                    };
                  }
                };
              })
          /*
           * Show the user the menu
           */
          .directive(
              'oprimeMenu',
              function($compile, $location) {
                var menuAngularConfig = {
                  restrict : 'E',
                  scope : {
                    logo : '@logo',
                    instructionsAudio : '@instructionsAudio'
                  },
                  template : '<div class="inner-container">'
                      + ' <img ng-src="{{logo}}" /> <br />'
                      + ' <button class="btn btn-success " ng-click="startExperiment()">Start!</button>'
                      + '</div>'
                      + '<audio id="tutorial_instructions_audio" ng-src="{{instructionsAudio}}" autoplay>'
                      + '</audio>',
                  link : function(scope, element, attrs) {
                    scope.startExperiment = function() {
                      alert("Ready to start?");
                      document.getElementById("tutorial_instructions_audio")
                          .pause();
                      $location.path("/play");
                    };
                    console.log("in the oprimeMenu link fuction");
                  }
                };

                return menuAngularConfig;
              })
          /*
           * Show the user the experiment
           */
          .directive('oprimeExperiment', function($http, $rootScope) {
            console.log("Declaring oprimeExperiment");
            return {
              restrict : 'E',
//              scope : {
//                experimentalDesign : window.experiment,
//              },
              template : "",
              link : function(scope, element, attrs) {
                console.log("Linking oprimeExperiment");

                // $http.get('data/tcpp_design.js').success(function(data) {
                // scope.experimentalDesign = data;
                // window.experimentalDesign = data;
                // });
                scope.experimentalDesign = window.experiment;
               
                scope.testOrPractice = "test";
                scope.currentExperiment = 0;
                scope.currentTrial = 0;
                scope.nextStimuli = function() {
                  alert("Next");
                };
              }
            };
          });

      return ExperimentDirectives;
    });

console.log("Loading the StimulusDirectives.");


define('stimulus/StimulusDirectives',
    [ "angular" ],
    function() {

      var StimulusDirectives = angular
          .module('Stimulus.directives', [])
          /*
           * Four image stimuli, 1 prime and 1 audio
           */
          .directive(
              'oprimeFourImageStimulus',
              function() {
                return {
                  restrict : 'E',
                  scope : {},
                  template : ''
                      + '<div class="row-fluid span6">'
                      + '  <div class="span6 ">'
                      + '    <img ng-src="image_stimuli/{{currentTrial.imageFiles[0]}}" '
                      + '      ng-click="confirmChoice()" /> <br /> <img'
                      + '      ng-src="image_stimuli/{{currentTrial.imageFiles[1]}}"'
                      + '      ng-click="confirmChoice()" />' + '  </div>'
                      + '  <div class="span6 ">'
                      + '    <img ng-src="image_stimuli/{{currentTrial.imageFiles[2]}}" '
                      + '      ng-click="confirmChoice()" /> <br /> <img'
                      + '      ng-src="image_stimuli/{{currentTrial.imageFiles[3]}}" '
                      + '      ng-click="confirmChoice()" />' + '  </div>'
                      + '   <audio  ng-src="audio_stimuli/{{currentTrial.audioFile}}" '
                      + '    ng-model="audio_stimulus"></audio>'
                      + '</div>',
                  link : function(scope, element, attrs) {
                    console.log("Linking an experiment stimuli");
                    scope.currentTrial = window.experiment.subexperiments[0].test.trials[0];

                    scope.confirmChoice = function() {
                      alert("Are you sure?");
                    };
                  }
                };
              });

      return StimulusDirectives;
    });

console.log("Loading the OPrimeApp module.");


define('oprime_module_definition',[ "angular-resource", "experiment/controllers/OPrimeController",
    "experiment/controllers/OPrimeExperimentController",
    "experiment/controllers/OPrimeExperimentCompletedController",
    "experiment/controllers/OPrimeMenuController",
    "experiment/controllers/OPrimeTutorialController", 
    "experiment/directives/ExperimentDirectives",
    "stimulus/StimulusDirectives",
    "oprime" ], function(
    nonameshere) {

  /**
   * The main OPrime module.
   * 
   * @type {angular.Module}
   */
  var OPrimeApp = angular.module('OPrimeApp',
      [/* dependancy injection */'Experiment.directives', 'Stimulus.directives', 'ui.bootstrap' ]).config(
      [ '$routeProvider', function($routeProvider) {
        console.log("Initializing the OPrimeApp module routes.");
        $routeProvider.when('/prepare', {
          templateUrl : 'partials/menu.html',
          controller : OPrimeMenuController
        }).when('/tutorial', {
          templateUrl : 'partials/tutorial.html',
          controller : OPrimeTutorialController
        }).when('/play', {
          templateUrl : 'partials/play.html',
          controller : OPrimeExperimentController
        }).when('/end', {
          templateUrl : 'partials/save_score.html',
          controller : OPrimeExperimentCompletedController
        }).otherwise({
          redirectTo : '/prepare'
        });
      } ]);
  console.log("Declaring the OPrimeAppModule");

  return OPrimeApp;
});

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
define("oprime", function(){});
