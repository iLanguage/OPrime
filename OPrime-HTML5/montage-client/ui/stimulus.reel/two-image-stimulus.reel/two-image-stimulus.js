/**
 * @module ui/two-image-stimulus.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent,
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
