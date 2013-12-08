/*
 * montage-client
 * https://github.com/ProjetDeRechercheSurLecriture/OPrime
 *
 * Copyright (c) 2013 
 * Licensed under the Apache, 2.0 licenses.
 */

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