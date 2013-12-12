/**
 * @module ui/main.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	Contextualizer = require("core/contextualizer").Contextualizer;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize( /** @lends Main# */ {
	constructor: {
		value: function Main() {
			// localStorage.setItem("montage_locale", "fr");
			this.super();
			this.contextualizer = new Contextualizer();
			
		}
	}
});