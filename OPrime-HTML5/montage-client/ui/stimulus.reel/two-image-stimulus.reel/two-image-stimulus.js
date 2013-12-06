/**
 * @module ui/two-image-stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	Stimulus = require("ui/stimulus.reel").Stimulus;

/**
 * @class TwoImageStimulus
 * @extends Component
 */
exports.TwoImageStimulus = Stimulus.specialize(/** @lends TwoImageStimulus# */ {
    constructor: {
        value: function TwoImageStimulus() {
            this.super();
        }
    }
});
