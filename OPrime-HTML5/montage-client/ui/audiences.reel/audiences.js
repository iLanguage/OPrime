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
				"gameLabel": "Child",
				"text": "Child",
				"experimentLabel": "Participant",
				"key": "participant"
			}, {
				"gameLabel": "Teacher",
				"text": "Teacher",
				"experimentLabel": "Administrator",
				"key": "experimentAdministrator"
			}, {
				"gameLabel": "Parent",
				"text": "Parent",
				"experimentLabel": "Parent",
				"key": "parent"
			}, {
				"gameLabel": "SLP",
				"text": "SLP",
				"experimentLabel": "Administrator",
				"key": "experimentAdministratorSpecialist"
			}, {
				"gameLabel": "School Records",
				"text": "School Records",
				"experimentLabel": "Report",
				"key": "report"
			}, {
				"gameLabel": "Debug",
				"text": "Debug",
				"experimentLabel": "Debug",
				"key": "debug"
			}, {
				"gameLabel": "Default",
				"text": "Default",
				"experimentLabel": "Default",
				"key": "default"
			}];
		}
	},

	templateDidLoad: {
		value: function() {
			var rangeController = this.templateObjects.rangeController;
			rangeController.content = this.content;
			rangeController.select(this.content[5]);

			//Observe the selection for changes
			rangeController.addRangeAtPathChangeListener(
				"selection", this, "handleSelectionChange");
		}
	},

	handleSelectionChange: {
		value: function(plus, minus) {
			this.message = "Selection changed from: " + (minus[0] ? minus[0].gameLabel : "nothing") + " -> " + (plus[0] ? plus[0].gameLabel : "nothing");
			this._currentAudience = plus[0];
		}
	},

	_currentAudience: {
		value: null
	}

});
