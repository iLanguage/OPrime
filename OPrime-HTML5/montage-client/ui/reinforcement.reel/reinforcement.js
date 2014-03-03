/**
 * @module ui/reinforcement.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Reinforcement
 * @extends Component
 */
exports.Reinforcement = Component.specialize( /** @lends Reinforcement# */ {
    constructor: {
        value: function Reinforcement() {
            this.super();
        }
    },

    counter: {
        value: null
    },

    currentItem: {
        value: 0
    },

    next: {
        value: function() {
            if (!this.counter) {
                return;
            }
            var previousIndex = this.currentItem - 1;
            if (previousIndex >= 0 && this.counter[previousIndex]) {
                this.counter[previousIndex].status = "completed";
            }
            if (this.currentItem >= 0 && this.counter[this.currentItem]) {
                this.counter[this.currentItem].status = "current";
            }
            console.log("next reinforcement current " + this.currentItem);
        }
    },

    previous: {
        value: function() {
            if (!this.counter) {
                return;
            }
            var followingIndex = this.currentItem + 1;
            if (followingIndex >= 0 && this.counter[followingIndex]) {
                this.counter[followingIndex].status = "incomplete";
            }
            if (this.currentItem >= 0 && this.counter[this.currentItem]) {
                this.counter[this.currentItem].status = "current";
            }
            console.log("previous reinforcement current " + this.currentItem);
        }
    },

    showFirst: {
        value: function() {
            console.log("shouldShowFirst reinforcement");

            if (!this.counter) {
                return;
            }
            console.log("reinforcement" + this.currentItem);

            for (var item = 1; item < this.counter.length; item++) {
                this.counter[item].status = "incomplete";
            }
            this.counter[0].status = "current";
        }
    },

    showLast: {
        value: function() {
            console.log("shouldShowLast reinforcement");
            if (!this.counter) {
                return;
            }
            for (var item = 0; item < this.counter.length; item++) {
                this.counter[item].status = "completed";
            }
        }
    }
});
