/**
 * @module ui/main.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ContextualizableComponent
 * @extends Component
 */
exports.ContextualizableComponent = Component.specialize( /** @lends ContextualizableComponent# */ {
	constructor: {
		value: function ContextualizableComponent() {
			this.super();
			this.contextualizer = window.contextualizer
		}
	},

	contextualizer: {
		value: null
	}
});