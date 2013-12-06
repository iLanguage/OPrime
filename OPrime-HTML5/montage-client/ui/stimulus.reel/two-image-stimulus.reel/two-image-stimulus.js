/**
 * @module ui/two-image-stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	AbstractStimulus = require("core/abstract-stimulus").AbstractStimulus;

/**
 * @class TwoImageStimulus
 * @extends AbstractStimulus
 */
exports.TwoImageStimulus = AbstractStimulus.specialize(/** @lends TwoImageStimulus# */ {
    constructor: {
        value: function TwoImageStimulus() {
            this.super();
        }
    }
});
