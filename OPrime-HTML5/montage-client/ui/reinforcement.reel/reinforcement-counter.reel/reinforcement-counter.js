/**
 * @module ui/reinforcement-counter.reel
 * @requires ui/reinforcement.reel
 */
var Reinforcement = require("ui/reinforcement.reel").Reinforcement;

/**
 * @class ReinforcementCounter
 * @extends Reinforcement
 */
exports.ReinforcementCounter = Reinforcement.specialize( /** @lends ReinforcementCounter# */ {
    constructor: {
        value: function ReinforcementCounter() {
            this.super();
        }
    },

    next: {
        value: function() {
            this.super()
        }
    },

    previous: {
        value: function() {
            this.super();
        }
    },

    showFirst: {
        value: function() {
            this.super();
        }
    },

    showLast: {
        value: function() {
            this.super();
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
