/**
 * @module ui/reinforcement-animation.reel
 * @requires ui/reinforcement.reel
 */
var Reinforcement = require("ui/reinforcement.reel").Reinforcement;

/**
 * @class ReinforcementAnimation
 * @extends Reinforcement
 */
exports.ReinforcementAnimation = Reinforcement.specialize( /** @lends ReinforcementAnimation# */ {
    constructor: {
        value: function ReinforcementAnimation() {
            this.super();
        }
    },

    counter: {
        value: null
    },

    currentItem: {
        value: 0
    },

    shouldShowFirst: {
        value: true
    },

    shouldShowLast: {
        value: false
    },

    next: {
        value: function() {
            this.super();
            this.shouldShowFirst = false;
            this.shouldShowLast = false;
        }
    },

    previous: {
        value: function() {
            this.super();
            this.shouldShowFirst = false;
            this.shouldShowLast = false;
        }
    },

    showFirst: {
        value: function() {
            this.super();
            this.shouldShowFirst = true;
            this.shouldShowLast = false;
        }
    },

    showLast: {
        value: function() {
            this.super();
            this.shouldShowFirst = false;
            this.shouldShowLast = true;
        }
    }
});
