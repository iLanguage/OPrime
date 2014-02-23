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
				"key": "participant",
				"gamifiedKey": "child",
				"selected": true
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
				"key": "resultReport",
				"gamifiedKey": "school_records"
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

	enterDocument: {
		value: function(firstTime) {
			this.super(firstTime);

			if (firstTime) {
				var rangeController = this.templateObjects.rangeController;
				//Observe the selection for changes

				// rangeController.content = this.content;
				var self = this;
				if (this.content) {
					this.content.map(function(audience) {
						if (audience.selected) {
							self.templateObjects.select.value = audience;
							self.handleChange();
						}
					});
				}
			}
			this.element.addEventListener("change", this, false);
		}
	},

	handleChange: {
		value: function() {
			// console.log("handleChange", this.templateObjects.select.value);
			if (this._currentAudience !== this.templateObjects.select.value) {
				this._currentAudience = this.templateObjects.select.value;
				this.application.currentAudience = this._currentAudience;
				var changeAudienceEvent = document.createEvent("CustomEvent");
				changeAudienceEvent.initCustomEvent("changeCurrentAudience", true, true, null);
				this.dispatchEvent(changeAudienceEvent);
			}
			console.log("Audiences handleChange", this._currentAudience);
		}
	},

	_currentAudience: {
		value: null
	}
});
