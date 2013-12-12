/**
 * @module ui/one-image-stimulus.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent,
	AbstractStimulus = require("core/abstract-stimulus").AbstractStimulus;

/**
 * @class OneImageStimulus
 * @extends AbstractStimulus
 */
exports.OneImageStimulus = AbstractStimulus.specialize(/** @lends OneImageStimulus# */ {
    constructor: {
        value: function OneImageStimulus() {
            this.super();
            this.primeImage = "../../../assets/stimuli/image/01_PaulRejointSesAmisAuParcTousLesJours.jpg";
        }
    }
});
