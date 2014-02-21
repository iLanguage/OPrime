/**
 * @module ui/audiences.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Audiences
 * @extends Component
 */
exports.Audiences = Component.specialize( /** @lends Audiences# */ {
	constructor: {
		value: function Audiences() {
			this.content = [{
				"quote": "If music be the food of love, play on.",
				"important": false
			}, {
				"quote": "O Romeo, Romeo! wherefore art thou Romeo?",
				"important": true
			}, {
				"quote": "All that glitters is not gold.",
				"important": false
			}, {
				"quote": "I am amazed and know not what to say.",
				"important": false
			}];
		}
	},

	templateDidLoad: {
		value: function() {
			var rangeController = this.templateObjects.rangeController;
			rangeController.content = this.content;
			rangeController.select(this.content[1]);

			//Observe the selection for changes
			rangeController.addRangeAtPathChangeListener(
				"selection", this, "handleSelectionChange");
		}
	},

	handleSelectionChange: {
		value: function(plus, minus) {
			this.message = "Selection changed from: " + (minus[0] ? minus[0].quote : "nothing") + " -> " + (plus[0] ? plus[0].quote : "nothing");
		}
	}

});
