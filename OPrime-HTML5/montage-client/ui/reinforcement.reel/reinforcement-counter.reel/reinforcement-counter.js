/**
 * @module ui/reinforcement-counter.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ReinforcementCounter
 * @extends Component
 */
exports.ReinforcementCounter = Component.specialize( /** @lends ReinforcementCounter# */ {
    constructor: {
        value: function ReinforcementCounter() {
            this.super();
        }
    },

    content: {
        value: null
    },

    currentItem: {
        value: null
    },

    next: {
        value: function() {
            if (!this.content) {
                return;
            }
            if (this.currentItem === null) {
                this.currentItem = 0;
            }
            console.log("next reinforcement" + this.currentItem);
            if (this.content.length > this.currentItem) {
                this.content[this.currentItem].status = "after";
            }
            this.currentItem++;

        }
    },

    previous: {
        value: function() {
            if (!this.content) {
                return;
            }
            if (this.currentItem === null) {
                this.currentItem = 0;
            }
            console.log("previous reinforcement" + this.currentItem);
            if (this.currentItem >= 0) {
                this.content[this.currentItem].status = "before";
            }
            this.currentItem--;
        }
    },

    showFirst: {
        value: function() {
            if (!this.content) {
                return;
            }
            for (var item = 0; item < this.content.length; item++) {
                this.content[item].status = "before";
            }
            this.currentItem = 0;
            this.setDoubleColumn();
        }
    },

    showLast: {
        value: function() {
            if (this.content && this.content.length) {
                this.currentItem = this.content.length - 1;
            }
            if (!this.content) {
                return;
            }
            for (var item = 0; item < this.content.length; item++) {
                this.content[item].status = "after";
            }
        }
    },

    doubleColumn: {
        value: null
    },

    willDraw: {
        value: function() {
            this.setDoubleColumn();
            this.super();
        }
    },

    setDoubleColumn: {
        value: function() {
            if ((this.content && this.content.length > 3)) {
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
