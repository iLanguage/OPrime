/**
 * @module ui/reinforcement-animation.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ReinforcementAnimation
 * @extends Component
 */
exports.ReinforcementAnimation = Component.specialize( /** @lends ReinforcementAnimation# */ {
	constructor: {
		value: function ReinforcementAnimation() {
			this.super();
		}
	},

	counter: {
		value: null
	},

	currentItem: {
		value: null
	},

	showFirst: {
		value: true
	},

	showLast: {
		value: false
	},

	next: {
		value: function() {
			if (!this.counter) {
				return;
			}
			this.showFirst = false;
			this.showLast = false;
			if (this.currentItem === null) {
				this.currentItem = 0;
			}
			console.log("next reinforcement" + this.currentItem);
			if (this.counter.length > this.currentItem) {
				this.counter[this.currentItem].status = "completed";
			}
			if (this.counter.length - 1 > this.currentItem) {
				this.currentItem++;
				if (this.counter.length > this.currentItem) {
					this.counter[this.currentItem].status = "current";
				}
			}
		}
	},

	previous: {
		value: function() {
			if (!this.counter) {
				return;
			}
			this.showFirst = false;
			this.showLast = false;
			if (this.currentItem === null) {
				this.currentItem = 0;
			}
			console.log("previous reinforcement" + this.currentItem);
			if (this.currentItem >= 0) {
				this.counter[this.currentItem].status = "incomplete";
			}
			this.currentItem--;
		}
	},

	showFirst: {
		value: function() {
			console.log("showFirst reinforcement");

			if (!this.counter) {
				return;
			}
			console.log("previous reinforcement" + this.currentItem);

			for (var item = 0; item < this.counter.length; item++) {
				this.counter[item].status = "incomplete";
			}
			this.currentItem = 0;
			this.showFirst = true;
			this.showLast = false;
		}
	},

	showLast: {
		value: function() {
			console.log("showLast reinforcement");
			if (this.counter && this.counter.length) {
				this.currentItem = this.counter.length - 1;
			}
			if (!this.counter) {
				return;
			}

			for (var item = 0; item < this.counter.length; item++) {
				this.counter[item].status = "completed";
			}
			this.showFirst = false;
			this.showLast = true;
		}
	},

	doubleColumn: {
		value: null
	},

	setDoubleColumn: {
		value: function() {
			if ((this.counter && this.counter.length > 3)) {
				this.doubleColumn = true;
				this.singleColumn = false;

				console.log("Using double column.");
			} else {
				console.log("Not setting double column.");
				this.singleColumn = true;
				this.doubleColumn = false;

			}
		}
	}
});
