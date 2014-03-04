/**
 * @module ui/experiments.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Experiments
 * @extends Component
 */
exports.Experiments = Component.specialize( /** @lends Experiments# */ {
	constructor: {
		value: function Experiments() {
			this.super();
			if (!this.application.database) {
				this.application.database = Database;
			}
			this.application.database.databaseUrl = "";
			this.experiments.map(function(experiment){
				this.application.database.get(experiment._id).then(function(doc){
					experiment.details = doc;
				});
			});
		}
	}
});
