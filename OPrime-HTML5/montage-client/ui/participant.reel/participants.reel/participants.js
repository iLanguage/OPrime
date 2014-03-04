/**
 * @module ui/participants.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	Database = require("core/data/database"),
	RangeController = require("montage/core/range-controller").RangeController;

/**
 * @class Participants
 * @extends Component
 */
exports.Participants = Component.specialize( /** @lends Participants# */ {
	constructor: {
		value: function Participants() {
			this.super();

			var self = this;
			if (!this.application.database) {
				this.application.database = Database;
			}
			this.application.database.databaseUrl = "https://corpusdev.lingsync.org/testingphophlo-debugging";
			this.application.database.view("participants_with_results").then(function(results) {
				if (results && results.rows) {
					self.participantsArray = results.rows.map(function(participant) {
						self.participantsWithResults[participant.key.userid] = self.participantsWithResults[participant.key.userid] || participant;
						self.participantsWithResults[participant.key.userid].experiments = self.participantsWithResults[participant.key.userid].experiments || [];
						self.participantsWithResults[participant.key.userid].experiments.push(participant.id);
						self.participantsWithResultsJSON = JSON.stringify(self.participantsWithResults);
						return participant.key;
					});
				}
			});
		}
	},

	participantsWithResults: {
		value: {}
	},

	participantsArray: {
		value: []
	},

	participantsWithResultsJSON: {
		value: null
	},

	participantsController: {
		value: null
	},

	enterDocument: {
		value: function(firsttime) {
			if (firsttime) {
				this.participantsController = new RangeController().initWithContent(this.participantsArray);
				this.participantsController.selection = [];
				this.participantsController.addRangeAtPathChangeListener("selection", this, "handleSelectionChange");
			}
		}
	},

	templateDidLoad: {
		value: function() {
			//Observe the selection for changes
			// this.participantsController.addRangeAtPathChangeListener("selection", this, "handleSelectionChange");
		}
	},

	selectedParticipant: {
		value: null
	},

	handleSelectionChange: {
		value: function(plus, minus) {
			console.log("Selection changed from: ", (minus[0] ? minus[0] : "nothing") + " -> ", (plus[0] ? plus[0] : "nothing"));
			this.selectedParticipant = plus[0];
			if (this.selectedParticipant && this.selectedParticipant.userid && this.participantsWithResults[this.selectedParticipant.userid] && this.participantsWithResults[this.selectedParticipant.userid].experiments) {
				this.selectedParticipant.experiments = this.participantsWithResults[this.selectedParticipant.userid].experiments;
				// this.participantsWithResults[this.selectedParticipant.userid].experiments.map(function(expId) {
				// 	this.selectedParticipant.experiments.push({
				// 		_id: expId
				// 	});
				// });
			}
		}
	}
});
