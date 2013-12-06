/**
 * @module ui/four-image-stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	Stimulus = require("ui/stimulus.reel").Stimulus;

/**
 * @class FourImageStimulus
 * @extends Stimulus
 */
exports.FourImageStimulus = Stimulus.specialize( /** @lends FourImageStimulus# */ {
	constructor: {
		value: function FourImageStimulus() {
			this.super();
			this.primeImage = "http://fc09.deviantart.net/fs71/f/2012/338/2/1/wat__dash_by_reallyunimportant-d5gl3y0.png";
		}
	},

	templateDidLoad: {
        value: function() {
            var prime = this.templateObjects.stimulus.templateObjects.visualPrime;
			//TODO use a class to change the default visual prime? ie FourImageStimulus-Stimulus-prime-image
        }
    }
});