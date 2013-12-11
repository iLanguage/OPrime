/**
 * @module ui/four-image-stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	AbstractStimulus = require("core/abstract-stimulus").AbstractStimulus;

/**
 * @class FourImageStimulus
 * @extends AbstractStimulus
 */
exports.FourImageStimulus = AbstractStimulus.specialize( /** @lends FourImageStimulus# */ {
	constructor: {
		value: function FourImageStimulus() {
			this.super();
			this.primeImage = "http://fc09.deviantart.net/fs71/f/2012/338/2/1/wat__dash_by_reallyunimportant-d5gl3y0.png";
			this.visualChoiceA = "http://th03.deviantart.net/fs70/PRE/f/2012/274/5/0/da_fuk__applejack_by_reallyunimportant-d5gh1zz.png";
			this.visualChoiceB = "http://fc06.deviantart.net/fs71/f/2013/076/4/a/_vector___svg__go_home_berry__you_are_sober__by_tritebristle-d5yc4zh.svg";
			this.visualChoiceC = "http://th06.deviantart.net/fs71/PRE/f/2013/025/6/7/moustache_pinkie_pie_by_silentmatten-d5qfrai.png";
			this.visualChoiceD = "http://th01.deviantart.net/fs70/PRE/f/2012/291/0/f/annoyed_smart_cookie_by_silentmatten-d5i7448.png";
		}
	}

});