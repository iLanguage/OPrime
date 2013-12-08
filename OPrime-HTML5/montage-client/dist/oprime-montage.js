/*! oprime-montage - v0.0.1 - 2013-10-04
* https://github.com/OpenSourceFieldlinguistics/OPrime/issues/milestones?state=closed
* Copyright (c) 2013 ; Licensed Apache 2.0 */
(function(exports) {

    'use strict';

    exports.Experiment = function() {
        return {
            'run': function() {
                console.log("Running");
                return "running";
            }
        };
    };

}(typeof exports === 'object' && exports || this));