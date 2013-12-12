/**
 * @module ui/experiment.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	experimentalDesign = require("../../../assets/stimuli/tcpp_design.json"),
	ExperimentLocalizer = require("core/experiment-localizer"),
	RangeController = require("montage/core/range-controller").RangeController;

var defaultExperimentLocalizer = ExperimentLocalizer.defaultExperimentLocalizer,
	_ = defaultExperimentLocalizer.localizeSync.bind(defaultExperimentLocalizer);

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
			this.localizer = defaultExperimentLocalizer;
			this.waitForLocalizerMessages = true;
			
			this.super();

			this.experimentalDesignSrc = "../../../assets/stimuli/tcpp_design.json";
			this.experimentalDesign = require(this.experimentalDesignSrc);

			this.iconSrc = "../../../assets/img/ic_tcpp128.png";
			this.gamify = true;

			this.audiencesController = RangeController.create().initWithContent(this.audiences);
			this.audiencesController.selection = [];
			this.audiencesController.addRangeAtPathChangeListener(
				"selection", this, "handleAudienceChange");

			this.localesController = RangeController.create().initWithContent([{
				"iso": "en",
				"label": "English",
			}, {
				"iso": "fr",
				"label": "français",
			}, {
				"iso": "iu",
				"label": "ᐃᓄᒃᑎᑐᑦ",
			}]);
			this.localesController.selection = [];
			this.localesController.addRangeAtPathChangeListener(
				"selection", this, "handleLocaleChange");
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
	},


	/* Using an object and a select: http://montagejs.github.io/mfiddle/#!/7884716 */
	_targetAudience: {
		value: null
	},
	targetAudience: {
		get: function() {
			return this._targetAudience;
		},
		set: function(value) {
			if (this._targetAudience === value) {
				return;
			}
			this._targetAudience = value;
			this.needsDraw = true;
		}
	},
	audiences: {
		value: [{
			"gameLabel": "Child",
			"experimentLabel": "Participant",
			"key": "participant"
		}, {
			"gameLabel": "Teacher",
			"experimentLabel": "Administrator",
			"key": "experimentAdministrator"
		}, {
			"gameLabel": "Parent",
			"experimentLabel": "Parent",
			"key": "parent"
		}, {
			"gameLabel": "SLP",
			"experimentLabel": "Administrator",
			"key": "experimentAdministratorSpecialist"
		}, {
			"gameLabel": "School Records",
			"experimentLabel": "Report",
			"key": "report"
		}, {
			"gameLabel": "Default",
			"experimentLabel": "Default",
			"key": "default"
		}]
	},
	/**
	 *
	 * References:
	 * https://github.com/montagejs/montage/pull/1103
	 *
	 * @type {Object}
	 */
	handleAudienceChange: {
		value: function(now, previous) {
			if (!now || now.length == 0 || !now[0]) {
				return;
			}
			var label = this.gamify ? "gameLabel" : "experimentLabel";
			console.log("Audience changed from: " + (previous[0] ? previous[0][label] : "nothing") + " -> " + (now[0] ? now[0][label] : "nothing"));
			this.targetAudience = now[0].key;
			/*cause the title and description to change based on the audience. */
			console.log(this.description);
			console.log(this.title);
		}
	},

	handleLocaleChange: {
		value: function(now, previous) {
			if (!now || now.length == 0 || !now[0]) {
				return;
			}
			console.log("Locale changed from: " + (previous[0] ? previous[0].label : "nothing") + " -> " + (now[0] ? now[0].label : "nothing"));
		}
	},
	/*
	TODO change the labelPropertyName to use an FRB contingent on gamify
	 */
	gamify: {
		value: null
	},

	_description: {
		value: null
	},
	description: {
		get: function() {
			var description = this._description || "";
			if (!this.experimentalDesign || !this.experimentalDesign.description) {
				return description;
			}
			if (this.targetAudience) {
				description = this.experimentalDesign.description["for_" + this.targetAudience];
			}
			if (!description) {
				description = this.experimentalDesign.description["default"] || "";
			}
			return description;
		},
		set: function(value) {
			if (this._description === value) {
				return;
			}
			this._description = value;
		}
	},

	_title: {
		value: null
	},
	title: {
		get: function() {
			var title = this._title || "";
			if (!this.experimentalDesign || !this.experimentalDesign.title) {
				return title;
			}
			if (this.gamify) {
				title = this.experimentalDesign.title["gamified_title"] || "";
			}
			if (!title) {
				title = this.experimentalDesign.title["default"] || "";
			}
			return title;
		},
		set: function(value) {
			if (this._title === value) {
				return;
			}
			this._title = value;
		}
	},

	handleAction: {
		value: function(e) {
			console.log("handleAction has been triggered: ", e);

		}
	}
});