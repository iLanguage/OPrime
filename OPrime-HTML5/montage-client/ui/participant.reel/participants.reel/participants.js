/**
 * @module ui/participants.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	Database = require("core/data/database");

/**
 * @class Participants
 * @extends Component
 */
exports.Participants = Component.specialize( /** @lends Participants# */ {
	constructor: {
		value: function Participants() {
			this.super();
		}
	},
	participantsWithResults: {
		value: {}
	},
	participantsWithResultsJSON: {
		value: null
	},
	enterDocument: {
		value: function(firsttime) {
			if (firsttime) {
				var self = this;
				if (!this.application.database) {
					this.application.database = Database;
				}
				this.application.database.databaseUrl = "https://corpusdev.lingsync.org/testingphophlo-debugging";
				this.application.database.view("participants_with_results").then(function(results) {
					if (results && results.rows) {
						results.rows.map(function(participant) {
							self.participantsWithResults[participant.key.userid] = self.participantsWithResults[participant.key.userid] || participant;
							self.participantsWithResults[participant.key.userid].experiments = self.participantsWithResults[participant.key.userid].experiments || [];
							self.participantsWithResults[participant.key.userid].experiments.push(participant.id);
							self.participantsWithResultsJSON = JSON.stringify(self.participantsWithResults);
						});
					}
				});
			}
		}
	}
});
