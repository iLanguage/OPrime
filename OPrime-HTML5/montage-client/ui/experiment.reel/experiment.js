/**
 * @module ui/experiment.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Experiment
 * @extends Component
 */
exports.Experiment = Component.specialize( /** @lends Experiment# */ {

	_currentStimulus: {
		value: null
	},

	_currentTestBlock: {
		value: null
	},

	constructor: {
		value: function Experiment() {
			this.super();
		}
	},

	run: {
		value: function() {}
	},

	next: {
		value: function() {}
	},

	previous: {
		value: function() {}
	},

	pause: {
		value: function() {}
	}
});