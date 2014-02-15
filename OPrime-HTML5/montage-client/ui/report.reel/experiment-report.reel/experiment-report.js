/**
 * @module ui/experiment-report.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ExperimentReport
 * @extends Component
 */
exports.ExperimentReport = Component.specialize( /** @lends ExperimentReport# */ {
	constructor: {
		value: function ExperimentReport() {
			this.super();
		}
	},

	/**
	 * An extremely simplistic score until we have normalization data, when this will change complete..
	 * @type {Object}
	 */
	calculateScore: {
		value: function() {
			var totalScore = 0;
			var totalStimuli = 0;
			for (var subexperimentIndex = 0; subexperimentIndex < this.experimentalDesign.subexperiments.length; subexperimentIndex++) {
				var subexperiment = this.experimentalDesign.subexperiments[subexperimentIndex];
				subexperiment.scoreSubTotal = 0;
				for (var stimulusIndex = 0; stimulusIndex < subexperiment.trials.length; stimulusIndex++) {
					var stimulusToScore = subexperiment.trials[stimulusIndex];
					if (stimulusToScore.responses && stimulusToScore.responses[stimulusToScore.responses.length - 1] && stimulusToScore.responses[stimulusToScore.responses.length - 1].responseScore) {
						subexperiment.scoreSubTotal += stimulusToScore.responses[stimulusToScore.responses.length - 1].responseScore;
					}
				}
				if (true || subexperiment.label.indexOf("practice") === -1) {
					totalScore += subexperiment.scoreSubTotal;
					totalStimuli += subexperiment.trials.length;
				}
			}
			this.experimentalDesign.scoreTotal = totalScore;
			this.scoreAsText = totalScore + "/" + totalStimuli;
			return this.scoreAsText;
		}
	}
});
