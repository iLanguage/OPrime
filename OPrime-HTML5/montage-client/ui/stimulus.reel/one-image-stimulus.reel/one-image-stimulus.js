/**
 * @module ui/one-image-stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
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
