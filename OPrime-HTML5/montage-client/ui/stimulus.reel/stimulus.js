/**
 * @module ui/stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Stimulus
 * @extends Component
 */
exports.Stimulus = Component.specialize( /** @lends Stimulus# */ {
	constructor: {
		value: function Stimulus() {
			this.super();
			this.primeImage = "http://th00.deviantart.net/fs70/PRE/i/2012/316/a/c/aj__dash_and_rarity_by_reallyunimportant-d5knc6e.png";
		}
	}
});