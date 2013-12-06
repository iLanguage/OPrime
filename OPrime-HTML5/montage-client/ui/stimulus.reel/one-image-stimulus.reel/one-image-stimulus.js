/**
 * @module ui/one-image-stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	Stimulus = require("ui/stimulus.reel").Stimulus;

/**
 * @class OneImageStimulus
 * @extends Component
 */
exports.OneImageStimulus = Stimulus.specialize(/** @lends OneImageStimulus# */ {
    constructor: {
        value: function OneImageStimulus() {
            this.super();
            this.primeImage = "../../../assets/stimuli/image/01_PaulRejointSesAmisAuParcTousLesJours.jpg";
        }
    }
});
