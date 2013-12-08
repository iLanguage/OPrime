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
			this._currentStimulus = {
				"auditoryStimuli": "auditory_stimuli_1",
				"audioFile": "1.wav",
				"primeImage": "animal1.png",
				"targetImage": "04_scie.png",
				"distractorImages": ["01_feu.png", "03_but.png", "02_chat.png"],
				"responses": [{
					"reactionTimeAudioOffset": null,
					"reactionTimeAudioOnset": null,
					"x": null,
					"y": null
				}]
			};
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