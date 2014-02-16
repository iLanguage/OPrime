/**
 * @module ui/norm-visualization.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class NormVisualization
 * @extends Component
 */
exports.NormVisualization = Component.specialize( /** @lends NormVisualization# */ {
	constructor: {
		value: function NormVisualization() {
			this.super();
		}
	},

	_score: {
		value: null
	},

	score: {
		get: function() {
			return this._score;
		},
		set: function(value) {
			if (value >= 0 && value !== this._score) {
				console.log("Setting score " + value);
				this._score = Math.round(value);
			}
			console.log("Setting score " + this._score);
		}
	}
});
