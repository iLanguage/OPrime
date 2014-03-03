/**
 * @module ui/reinforcement-item.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ReinforcementItem
 * @extends Component
 */
exports.ReinforcementItem = Component.specialize( /** @lends ReinforcementItem# */ {
	constructor: {
		value: function ReinforcementItem() {
			this.super();
		}
	},

	json: {
		value: {
			"incompleteImageFile": "../../../assets/img/blank.png",
			"completedImageFile" : "../../../assets/img/blank.png"
		}
	}
});
