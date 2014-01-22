/**
 * @module ui/reinforcement.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Reinforcement
 * @extends Component
 */
exports.Reinforcement = Component.specialize(/** @lends Reinforcement# */ {
    constructor: {
        value: function Reinforcement() {
            this.super();
        }
    },
    images: {
    	value: "/assets/stimuli/image/r00_caterpillars.png"
    },
    next: {
        value: function () {
            console.log("next")
            this.currentImage= this.images;
        }
    },
});
